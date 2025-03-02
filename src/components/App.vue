<template>
  <ContextMenu :ref="'contextMenu'" @option-clicked="optionClicked" />
  <div @click="rootClick">
    <link v-if="theme == 'd2'" href="css/theme.css" rel="stylesheet" />

    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="octicon octicon-clippy navbar-brand">
        <a href="https://github.com/ricola3d">Ricola3D</a> /
        <a class="font-weight-bold" href="https://github.com/ricola3d/d2s-editor">d2s-editor</a>
      </div>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div id="navbarSupportedContent" class="collapse navbar-collapse">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
          <!-- <li class="nav-item" v-if="theme !== 'd2'">
            <a class="nav-link" href="#" @click="setTheme('d2')">Change Theme</a>
          </li>
          <li class="nav-item" v-if="theme === 'd2'">
            <a class="nav-link" href="#" @click="setTheme('dark')">Change Theme</a>
          </li> -->
        </ul>
      </div>
    </nav>

    <div id="LoadItem" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Select an Item</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row d-flex justify-content-center mt-3 pl-5 pr-5">
              <Item v-if="preview" :item="preview" clazz="item-edit" />
            </div>
            <label for="Item">Item</label>
            <multiselect
              v-model="previewModel"
              :options="itempack"
              label="key"
              value-prop="value"
              :searchable="true"
              @update:model-value="previewItem"
            />
          </div>
          <div class="modal-footer">
            <input id="d2iFile" style="display: none" type="file" name="d2iFile" @change="onItemFileChange" />
            <label for="d2iFile" class="mb-0 btn btn-primary">Load From File</label>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="loadItemFromJson">Load From JSON</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="loadItem">Load</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row">
        <div class="offset-lg-1 col-lg-10 mt-2">
          <div class="card bg-light">
            <div class="card-body">
              <div class="alert alert-primary" role="alert">
                This editor is still a work in progress. Some things may not work. Found a bug?
                <a href="https://github.com/ricola3d/d2s-editor/issues/new">Report it.</a>
              </div>
              <form id="d2sForm">
                <fieldset>
                  <div class="form-group">
                    <div class="input-group">
                      <select id="open-mod" v-model="$work_mod.value" name="open-mod" title="Workspace Mod" @change="changeMod()">
                        <option value="vanilla">Vanilla</option>
                        <option value="remodded">ReMoDDeD</option>
                      </select>
                      <select
                        id="work-version"
                        v-model="$work_version.value"
                        name="work-version"
                        title="Workspace Version"
                        @change="changeMod()"
                      >
                        <option v-if="$work_mod.value == 'vanilla'" value="96">LOD 1.10-1.14d</option>
                        <option v-if="$work_mod.value == 'vanilla'" value="97">D2R Alpha</option>
                        <option value="98">D2R 2.4 (MP)</option>
                        <option value="99">D2R 2.5+</option>
                      </select>
                      <div class="custom-file">
                        <input id="d2sFile" type="file" name="d2sFile" accept=".d2s" @change="onFileChange" />
                        <label class="custom-file-label" for="d2sFile">*.d2s</label>
                      </div>
                      <div>
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown">Create New</button>
                        <div class="dropdown-menu dropdown-menu-right">
                          <button class="dropdown-item" type="button" @click="newChar(0)">Amazon</button>
                          <button class="dropdown-item" type="button" @click="newChar(1)">Sorceress</button>
                          <button class="dropdown-item" type="button" @click="newChar(2)">Necromancer</button>
                          <button class="dropdown-item" type="button" @click="newChar(3)">Paladin</button>
                          <button class="dropdown-item" type="button" @click="newChar(4)">Barbarian</button>
                          <button class="dropdown-item" type="button" @click="newChar(5)">Druid</button>
                          <button class="dropdown-item" type="button" @click="newChar(6)">Assassin</button>
                        </div>
                      </div>
                      <div class="input-group-append">
                        <span>&nbsp;</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="save != null">
                    <ul id="tabs" class="nav nav-tabs">
                      <li class="nav-item">
                        <a id="stats-tab" class="nav-link active" data-toggle="tab" data-target="#stats-content" role="tab" type="button"
                          >Stats</a
                        >
                      </li>
                      <li class="nav-item" role="presentation">
                        <a id="waypoints-tab" class="nav-link" data-toggle="tab" data-target="#waypoints-content" role="tab" type="button"
                          >Waypoints</a
                        >
                      </li>
                      <li class="nav-item" role="presentation">
                        <a id="quests-tab" class="nav-link" data-toggle="tab" data-target="#quests-content" role="tab" type="button"
                          >Quests</a
                        >
                      </li>
                      <li class="nav-item" role="presentation">
                        <a id="skills-tab" class="nav-link" data-toggle="tab" data-target="#skills-content" role="tab" type="button"
                          >Skills</a
                        >
                      </li>
                      <li class="nav-item" role="presentation">
                        <a id="items-tab" class="nav-link" data-toggle="tab" data-target="#items-content" role="tab" type="button">Items</a>
                      </li>
                    </ul>
                    <div id="tabs-content" class="tab-content">
                      <div id="stats-content" class="tab-pane show active" role="tabpanel">
                        <Stats v-model:save="save" />
                      </div>
                      <div id="waypoints-content" class="tab-pane" role="tabpanel">
                        <Waypoints :waypoints="save.header.waypoints" @update:waypoints="save.header.waypoints = $event" />
                      </div>
                      <div id="quests-content" class="tab-pane" role="tabpanel">
                        <Quests :save="save" @update:save="save = $event" />
                      </div>
                      <div id="skills-content" class="tab-pane" role="tabpanel">
                        <Skills v-model:save="save" />
                      </div>
                      <div id="items-content" class="tab-pane" role="tabpanel">
                        <div v-for="(notification, idx) in notifications" :key="idx" :class="notification.alert" role="alert">
                          {{ notification.message }}
                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="row mt-3">
                          <div class="btn-group overflow-auto offset-md-3 col-md-6" role="group">
                            <button
                              type="button"
                              class="btn btn-secondary"
                              :class="{
                                active: activeTab == 1,
                              }"
                              @click="changeTab(1)"
                            >
                              Equipped
                            </button>
                            <button
                              type="button"
                              class="btn btn-secondary"
                              :class="{
                                active: activeTab == 3,
                              }"
                              @click="changeTab(3)"
                            >
                              Stash
                            </button>
                            <button
                              type="button"
                              class="btn btn-secondary"
                              :class="{
                                active: activeTab == 4,
                              }"
                              @click="changeTab(4)"
                            >
                              Cube
                            </button>
                            <button
                              type="button"
                              class="btn btn-secondary"
                              :class="{
                                active: activeTab == 5,
                              }"
                              @click="changeTab(5)"
                            >
                              Mercenary
                            </button>
                            <button
                              type="button"
                              class="btn btn-secondary"
                              :class="{
                                active: activeTab == 6,
                              }"
                              @click="changeTab(6)"
                            >
                              All
                            </button>
                          </div>
                          <div class="col-md-3">
                            <div class="float-right">
                              <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" />
                              <div class="dropdown-menu dropdown-menu-right">
                                <div class="p-3 form-group">
                                  <div class="form-row">
                                    <div class="col-md-12">
                                      <label>Inventory</label>
                                      <div class="input-group">
                                        <input
                                          v-model.number="grid.inv.w"
                                          type="number"
                                          min="1"
                                          max="20"
                                          class="form-control"
                                          @input="gridChange"
                                        />
                                        <div class="input-group-prepend input-group-append">
                                          <div class="input-group-text">,</div>
                                        </div>
                                        <input
                                          v-model.number="grid.inv.h"
                                          type="number"
                                          min="1"
                                          max="20"
                                          class="form-control"
                                          @input="gridChange"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div class="form-row">
                                    <div class="col-md-12">
                                      <label>Stash</label>
                                      <div class="input-group">
                                        <input
                                          v-model.number="grid.stash.w"
                                          type="number"
                                          min="1"
                                          max="20"
                                          class="form-control"
                                          @input="gridChange"
                                        />
                                        <div class="input-group-prepend input-group-append">
                                          <div class="input-group-text">,</div>
                                        </div>
                                        <input
                                          v-model.number="grid.stash.h"
                                          type="number"
                                          min="1"
                                          max="20"
                                          class="form-control"
                                          @input="gridChange"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div class="form-row">
                                    <div class="col-md-12">
                                      <label>Cube</label>
                                      <div class="input-group">
                                        <input
                                          v-model.number="grid.cube.w"
                                          type="number"
                                          min="1"
                                          max="20"
                                          class="form-control"
                                          @input="gridChange"
                                        />
                                        <div class="input-group-prepend input-group-append">
                                          <div class="input-group-text">,</div>
                                        </div>
                                        <input
                                          v-model.number="grid.cube.h"
                                          type="number"
                                          min="1"
                                          max="20"
                                          class="form-control"
                                          @input="gridChange"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                class="btn btn-primary"
                                :disabled="!$clipboard.value"
                                @click="pasteItem($clipboard.value)"
                              >
                                Paste
                              </button>
                              <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#LoadItem">Load Item</button>
                            </div>
                          </div>
                        </div>
                        <Equipped
                          v-if="activeTab == 1 || activeTab == 6"
                          :id="'Equipped'"
                          v-model:items="equipped"
                          :context-menu="$refs.contextMenu"
                          @item-selected="onSelect"
                          @item-event="onEvent"
                        />
                        <Grid
                          v-if="activeTab == 1 || activeTab == 6"
                          :id="'InventoryGrid'"
                          v-model:items="inventory"
                          :width="grid.inv.w"
                          :height="grid.inv.h"
                          :alt_position_id="1"
                          :context-menu="$refs.contextMenu"
                          @item-selected="onSelect"
                          @item-event="onEvent"
                        />
                        <Grid
                          v-if="activeTab == 3 || activeTab == 6"
                          :id="'StashGrid'"
                          v-model:items="stash"
                          :width="grid.stash.w"
                          :height="grid.stash.h"
                          :alt_position_id="5"
                          :context-menu="$refs.contextMenu"
                          @item-selected="onSelect"
                          @item-event="onEvent"
                        />
                        <Grid
                          v-if="activeTab == 4 || activeTab == 6"
                          :id="'CubeGrid'"
                          v-model:items="cube"
                          :width="grid.cube.w"
                          :height="grid.cube.h"
                          :alt_position_id="4"
                          :context-menu="$refs.contextMenu"
                          @item-selected="onSelect"
                          @item-event="onEvent"
                        />
                        <Mercenary
                          v-if="activeTab == 5 || activeTab == 6"
                          v-model:items="mercenary"
                          :context-menu="$refs.contextMenu"
                          @item-selected="onSelect"
                        />
                        <ItemEditor
                          v-if="selectedItem"
                          :id="'Selected'"
                          ref="editor"
                          v-model:item="selectedItem"
                          :context-menu="$refs.contextMenu"
                          @item-event="onEvent"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
                <div id="errors" />
                <br />
                <div v-if="save != null">
                  <button type="button" class="btn btn-primary" @click="unlockHell">Unlock Hell</button>
                  <button type="button" class="btn btn-primary" @click="unlockAllWPs">Unlock All WPs</button>
                  <button type="button" class="btn btn-primary" @click="setLvl99">Set Level 99</button>
                  <button type="button" class="btn btn-primary" @click="unlockAllQuests">Complete all Qs</button>
                  <button type="button" class="btn btn-secondary" @click="unlockSkillStatQs">Complete Skill/Stat Qs</button>
                  <button type="button" class="btn btn-primary" @click="maxGold">Max Gold</button>
                  <br /><br />
                  <button id="d2" type="button" class="btn btn-primary" @click="saveFile('vanilla', 0x60)">Save D2 LOD</button>
                  <div style="display: inline-block; width: 10px" />
                  <button id="d2" type="button" class="btn btn-primary" @click="saveFile('vanilla', 0x62)">Save D2R TCP-IP</button>
                  <button id="d2r" type="button" class="btn btn-primary" @click="saveFile('vanilla', 0x63)">Save D2R Bnet</button>
                  <div style="display: inline-block; width: 10px" />
                  <button id="d2r" type="button" class="btn btn-primary" @click="saveFile('remodded', 0x62)">Save ReMoDDeD MP</button>
                  <button id="d2r" type="button" class="btn btn-primary" @click="saveFile('remodded', 0x63)">Save ReMoDDeD SP</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="theme == 'd2'" class="text-center mt-3">
      Credits to Dimka-DJZLO at
      <a href="https://discord.gg/NvfftHY">Phrozen Keep</a> for the theme!
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';

import Item from './inventory/Item.vue';
import ContextMenu from './ContextMenu.vue';
import Stats from './Stats.vue';
import Waypoints from './Waypoints.vue';
import Quests from './Quests.vue';
import Skills from './Skills.vue';
import Equipped from './inventory/Equipped.vue';
import Grid from './inventory/Grid.vue';
import Mercenary from './Mercenary.vue';
import ItemEditor from './inventory/ItemEditor.vue';

import charpack_vanilla_97 from '../d2/charpack_vanilla_97.js';
import charpack_remodded_98 from '../d2/charpack_remodded_98.js';
import charpack_remodded_99 from '../d2/charpack_remodded_99.js';
import itempack_vanilla_99 from '../d2/itempack_vanilla_99.js';
import utils from '../utils.mjs';

const charPacks = {
  charpack_default: charpack_vanilla_97,
  charpack_vanilla_97,
  charpack_remodded_98,
  charpack_remodded_99,
};

const savedItemPacks = {
  itempack_vanilla_99,
};

export default {
  components: {
    Item,
    Stats,
    Waypoints,
    Quests,
    Skills,
    Equipped,
    Grid,
    Mercenary,
    ItemEditor,
    ContextMenu,
  },
  filters: {},
  data() {
    return {
      save: null,
      activeTab: 1,
      itempack: [],
      previewModel: null,
      preview: null,
      load: null,
      notifications: [],
      grid: {
        inv: { w: 10, h: 8 },
        stash: { w: 16, h: 13 },
        cube: { w: 16, h: 13 },
      },
      selectedItem: null,
      theme: localStorage.getItem('theme'),
      // work_mod: 'remodded',
      // work_version: 99,
    };
  },
  computed: {
    log() {
      console.log('Computed  ' + this.$work_mod.value + this.$work_version.value);
      return 0;
    },
    // // We need a computed prop because globalProperties are not accessible from templates
    // work_mod: {
    //   // getter
    //   get() {
    //     // return 'remodded';
    //     return this.$work_mod.value;
    //   },
    //   // setter
    //   set(newValue) {
    //     this.$work_mod.value = newValue;
    //   },
    // },
    // // We need a computed prop because globalProperties are not accessible from templates
    // work_version: {
    //   // getter
    //   get() {
    //     return 99;
    //     // return this.$work_version.value;
    //   },
    //   // setter
    //   set(newValue) {
    //     this.$work_version.value = newValue;
    //   },
    // },
    equipped() {
      return this.save && this.save.items ? this.save.items.filter((item) => item.location_id === 1) : [];
    },
    inventory() {
      return this.save && this.save.items ? this.save.items.filter((item) => item.location_id === 0 && item.alt_position_id === 1) : [];
    },
    stash() {
      return this.save && this.save.items ? this.save.items.filter((item) => item.location_id === 0 && item.alt_position_id === 5) : [];
    },
    cube() {
      return this.save && this.save.items ? this.save.items.filter((item) => item.location_id === 0 && item.alt_position_id === 4) : [];
    },
    mercenary() {
      return this.save && this.save.merc_items ? this.save.merc_items : [];
    },
  },
  mounted() {
    // console.log('Mounted ' + this.$work_mod.value + this.$work_version.value);
    if (localStorage.grid) {
      this.grid = JSON.parse(localStorage.getItem('grid'));
    }
    this.changeMod();
  },
  methods: {
    setTheme(theme) {
      localStorage.setItem('theme', theme);
      this.theme = theme;
      return;
    },
    rootClick() {
      this.$refs.contextMenu.close();
    },
    async getPaletteData() {
      let a1PaletteBuffer;
      const colorMapBuffers = {};
      const a1PalettePath = utils.getA1PalettePath(this.$work_mod.value, this.$work_version.value);
      let response = await fetch(a1PalettePath);
      a1PaletteBuffer = new Uint8Array(await response.arrayBuffer());
      const colormapPaths = utils.getColormapPaths(this.$work_mod.value, this.$work_version.value);
      for (const [index, colorMapPath] of Object.entries(colormapPaths)) {
        response = await fetch(colorMapPath);
        colorMapBuffers[index] = new Uint8Array(await response.arrayBuffer());
      }
      utils.fillPalettes(this.$palettes.value, a1PaletteBuffer, colorMapBuffers);
    },
    // Uses globalProperties $work_mod & $work_version as input
    changeMod(failSafe = true) {
      // console.log('Changing mod to ' + this.$work_mod.value + this.$work_version.value);
      let succeed = true;
      try {
        // Safety check
        this.$getWorkConstantData();
      } catch (e) {
        // console.log("Safety resets version to 99")
        succeed = false;
        if (failSafe) {
          this.$work_version.value = 99; // Fallback
        } else {
          return false;
        }
      }
      // console.log('Changing mod to ' + this.$work_mod.value + '_' + this.$work_version.value);

      this.save = null;

      this.getPaletteData();

      return succeed;
    },
    optionClicked(event) {
      switch (event.option.text) {
        case 'Delete':
          this.onEvent({
            type: 'delete',
            item: event.obj,
          });
          break;
        case 'Copy':
          this.onEvent({
            type: 'copy',
            item: event.obj,
          });
          break;
        case 'Cut':
          this.onEvent({
            type: 'cut',
            item: event.obj,
          });
          break;
        case 'Export':
          this.onEvent({
            type: 'export',
            item: event.obj,
          });
          break;
        case 'Import At': {
          this.onEvent({
            type: 'import',
            position: event.obj,
          });
          break;
        }
        case 'Paste At':
          if (this.$clipboard.value == null) {
            break;
          }
          this.onEvent({
            type: 'pasteAt',
            item: this.$clipboard.value,
            position: event.obj,
          });
          break;
        case 'Select':
          this.onSelect(event.obj);
          break;
      }
      this.$refs.contextMenu.close();
    },
    gridChange() {
      localStorage.setItem('grid', JSON.stringify(this.grid));
    },
    changeTab(i) {
      this.activeTab = i;
    },
    onSelect(e) {
      this.selectedItem = e;
    },
    findIndex(list, i) {
      return list.findIndex(
        (item) =>
          item.location_id == i.location_id &&
          item.equipped_id == i.equipped_id &&
          item.position_x == i.position_x &&
          item.position_y == i.position_y &&
          item.alt_position_id == i.alt_position_id,
      );
    },
    // Method to share an item (through clipboard). By default we share as a vanilla 99 item.
    async exportItem(item) {
      let bytes = await this.$d2s.writeItem(item, this.$work_mod.value, this.$work_version.value);
      let base64 = this.$d2s.utils.arrayBufferToBase64String(bytes);
      let hex = this.$d2s.utils.arrayBufferToHexString(bytes);
      let sharedContent = {
        mod: this.$work_mod.value,
        version: this.$work_version.value,
        base64: base64,
        hex: hex,
      };
      navigator.clipboard.writeText(JSON.stringify(sharedContent));
      this.notifications = [];
      this.notifications.push({
        alert: 'alert alert-info',
        message: `Item data copied to clipboard. One may use 'import' or 'load From JSON' to get the item.`,
      });
    },
    async importItem(position) {
      try {
        const text = await navigator.clipboard.readText();
        const json = JSON.parse(text);
        if (json.mod && json.version && json.base64) {
          this.previewModel = json;
          await this.previewItem();
          this.pasteItem(this.preview, position);
        } else {
          alert('Empty clipboard or JSON is malformed.');
        }
      } catch (e) {
        alert('Failed to load the item, contact the Administrator.');
        console.error(e);
      }
    },
    deleteItem(item) {
      let idx = this.findIndex(this.save.items, item);
      if (idx != -1) {
        this.save.items.splice(idx, 1);
        this.selectedItem = null;
        return;
      }
      idx = this.findIndex(this.save.merc_items, item);
      if (idx != -1) {
        this.save.merc_items.splice(idx, 1);
        this.selectedItem = null;
        return;
      }
    },
    pasteItem(item, position) {
      let safePosition = null;
      if (position) {
        if (position.location_id == 0) {
          // Paste to a stored location (inventory, stash, cube)
          if (this.canPlaceItem(item, position.alt_position_id, position.position_x, position.position_y)) {
            safePosition = position;
          }
        } else {
          // TODO
        }
      }

      if (!safePosition) safePosition = this.findSafePosition(item);

      let itemCopy = cloneDeep(item);
      itemCopy.location_id = safePosition.location_id;
      itemCopy.equipped_id = safePosition.equipped_id;
      itemCopy.position_x = safePosition.position_x;
      itemCopy.position_y = safePosition.position_y;
      itemCopy.alt_position_id = safePosition.alt_position_id;
      this.notifications = [];
      if (itemCopy.location_id == 4) {
        this.notifications.push({
          alert: 'alert alert-warning',
          message: `Could not find safe location to place item. Placed in mouse buffer.`,
        });
      } else {
        let loc = itemCopy.alt_position_id == 1 ? 'inventory' : itemCopy.alt_position_id == 5 ? 'stash' : 'cube';
        this.notifications = [];
        this.notifications.push({
          alert: 'alert alert-info',
          message: `Loaded item in ${loc} at ${itemCopy.position_x}, ${itemCopy.position_y}`,
        });
      }
      this.save.items.push(itemCopy);
      this.selectedItem = itemCopy;
    },
    onEvent(e) {
      if (e.type == 'export') {
        this.exportItem(e.item);
      } else if (e.type == 'import') {
        this.importItem(e.position);
      } else if (e.type == 'copy') {
        this.$clipboard.value = cloneDeep(e.item);
      } else if (e.type == 'cut') {
        this.$clipboard.value = cloneDeep(e.item);
        this.deleteItem(e.item);
      } else if (e.type == 'update') {
        this.$d2s.enhanceItems([e.item], this.$work_mod.value, this.$work_version.value, this.save ? this.save.attributes : null);
        this.resolveInventoryImage(e.item);
      } else if (e.type == 'delete') {
        this.deleteItem(e.item);
      } else if (e.type == 'move') {
        let element = document.getElementById(e.id);
        element.style.backgroundColor = '';
        element.style.width = '';
        element.style.height = '';
        if (this.$uuid == e.uuid) {
          let idx = this.findIndex(this.save.items, e.item);
          this.onMove(this.save.items[idx], e);
        } else {
          //copy to another tab
          if (this.onMove(e.item, e)) {
            this.save.items.push(e.item);
          }
        }
      } else if (e.type == 'dragenter') {
        let item = e.item;
        if (this.canPlaceItem(item, e.location.alt_position_id, e.location.x, e.location.y)) {
          let element = document.getElementById(e.id);
          element.style.backgroundColor = 'green';
          element.style.width = `calc(var(--grid-size) * ${item.inv_width})`;
          element.style.height = `calc(var(--grid-size) * ${item.inv_height})`;
        }
      } else if (e.type == 'dragleave') {
        let element = document.getElementById(e.id);
        element.style.backgroundColor = '';
        element.style.width = '';
        element.style.height = '';
      } else if (e.type === 'pasteAt') {
        this.pasteItem(e.item, e.position);
      }
    },
    onMove(item, e) {
      if (!this.canPlaceItem(item, e.location.alt_position_id, e.location.x, e.location.y)) {
        return false;
      }
      if (e.location.location == 1) {
        item.location_id = e.location.location;
        item.equipped_id = e.location.equipped_location;
        item.position_x = 0;
        item.position_y = 0;
        item.alt_position_id = 0;
      } else if (e.location.location == 0) {
        item.location_id = e.location.location;
        item.equipped_id = 0;
        item.position_x = e.location.x;
        item.position_y = e.location.y;
        item.alt_position_id = e.location.alt_position_id;
      } else if (e.location.location == 4) {
        item.location_id = e.location.location;
        item.equipped_id = 0;
        item.position_x = 4; //why?
        item.position_y = 0;
        item.alt_position_id = 0;
      }
      return true;
    },
    // Method to parse an item byte array and preview it
    async readItem(bytes, mod, version) {
      this.preview = await this.$d2s.readItem(bytes, mod, version);
      await this.resolveInventoryImage(this.preview);
      utils.removeMaxDurabilityFromRunwords(this.preview);
    },
    // Callback to read the input-select value and fill the preview thumbnail
    async previewItem(/* event */) {
      if (this.previewModel) {
        if (!this.previewModel.mod || !this.previewModel.version) {
          throw new Error('No mod and version specified.');
        }
        if (this.previewModel.object) {
          this.preview = cloneDeep(this.previewModel.object);
        } else if (this.previewModel.base64) {
          const bytes = this.$d2s.utils.b64StringToArrayBuffer(this.previewModel.base64);
          this.preview = await this.$d2s.readItem(bytes, this.previewModel.mod, this.previewModel.version);
        } else if (this.previewModel.hex) {
          const bytes = this.$d2s.utils.hexStringToArrayBuffer(this.previewModel.hex);
          this.preview = await this.$d2s.readItem(bytes, this.previewModel.mod, this.previewModel.version);
        } else {
          throw new Error('No item code in the input.');
        }
        this.$d2s.enhanceItem(this.preview, this.previewModel.mod, this.previewModel.version, this.save.attributes);
        await this.resolveInventoryImage(this.preview);
        utils.removeMaxDurabilityFromRunwords(this.preview);
      }
    },
    async onItemFileLoad(event) {
      this.previewModel = {
        base64: this.$d2s.utils.arrayBufferToBase64String(event.target.result),
        mod: this.$work_mod.value,
        version: this.$work_version.value,
      };
      this.previewItem();
    },
    onItemFileChange(event) {
      let reader = new FileReader();
      reader.onload = this.onItemFileLoad;
      reader.readAsArrayBuffer(event.target.files[0]);
      event.target.value = null;
    },
    // Method to load an item from its a JSON {mod, version, base64 or hex} or simply a base64 string (mod & version will be set to vanilla 99 by default).
    async loadItemFromJson() {
      let input = prompt('Please enter a JSON with mod, version and base64 or hex.');
      try {
        const json = JSON.parse(input);
        if (json.mod && json.version && json.base64) {
          this.previewModel = json;
          await this.previewItem();
          this.pasteItem(this.preview);
        } else {
          alert('JSON is malformed.');
        }
      } catch (e) {
        alert('Failed to load the item, contact the Administrator.');
        console.error(e);
      }
    },
    // Method to load a chosen item
    loadItem() {
      this.pasteItem(this.preview);
    },
    findSafePosition(item) {
      // Search in inventory
      for (let i = 0; i < this.grid.inv.w; i++) {
        for (let j = 0; j < this.grid.inv.h; j++) {
          if (this.canPlaceItem(item, 1, i, j)) {
            // return [0, 0, i, j, 1]
            return {
              location_id: 0,
              equipped_id: 0,
              position_x: i,
              position_y: j,
              alt_position_id: 1,
            };
          }
        }
      }
      // Search in stash
      for (let i = 0; i < this.grid.stash.w; i++) {
        for (let j = 0; j < this.grid.stash.h; j++) {
          if (this.canPlaceItem(item, 5, i, j)) {
            // return [0, 0, i, j, 5]
            return {
              location_id: 0,
              equipped_id: 0,
              position_x: i,
              position_y: j,
              alt_position_id: 5,
            };
          }
        }
      }
      // Search in cube
      for (let i = 0; i < this.grid.cube.w; i++) {
        for (let j = 0; j < this.grid.cube.h; j++) {
          if (this.canPlaceItem(item, 4, i, j)) {
            // return [0, 0, i, j, 4]
            return {
              location_id: 0,
              equipped_id: 0,
              position_x: i,
              position_y: j,
              alt_position_id: 4,
            };
          }
        }
      }
      // To cursor
      // return [4, 0, 4, 0, 0]
      return {
        location_id: 4,
        equipped_id: 0,
        position_x: 0,
        position_y: 0,
        alt_position_id: 0,
      };
    },
    canPlaceItem(item, loc, x, y) {
      var bounds;
      if (loc == 4) {
        bounds = this.grid.cube;
      } else if (loc == 5) {
        bounds = this.grid.stash;
      } else {
        bounds = this.grid.inv;
      }
      if (x + item.inv_width > bounds.w) {
        return false;
      }
      if (y + item.inv_height > bounds.h) {
        return false;
      }
      var rect = [x, y, x + item.inv_width, y + item.inv_height];
      let closeItems = this.save.items.filter((item) => item.location_id === 0 && item.alt_position_id === loc);
      for (var closeItem of closeItems) {
        var r = [
          closeItem.position_x,
          closeItem.position_y,
          closeItem.position_x + closeItem.inv_width,
          closeItem.position_y + closeItem.inv_height,
        ];
        if (this.contains(rect, r) || this.overlaps(rect, r)) {
          return false;
        }
      }
      return true;
    },
    contains(a, b) {
      return !(b[0] < a[0] || b[1] < a[1] || b[2] > a[2] || b[3] > a[3]);
    },
    overlaps(a, b) {
      if (a[0] >= b[2] || b[0] >= a[2]) return false;
      if (a[1] >= b[3] || b[1] >= a[3]) return false;
      return true;
    },
    async resolveInventoryImages() {
      const allItems = [...this.save.items, ...this.save.merc_items, ...this.save.corpse_items, this.save.golem_item];
      const promises = allItems.map(async function (item) {
        return this.resolveInventoryImage(item);
      }, this);
      return Promise.all(promises);
    },
    async resolveInventoryImage(item) {
      if (!item) {
        return;
      }
      item.src = await utils.getInventoryImage(item, this.$work_mod.value, this.$work_version.value, this.$palettes.value);
      if (!item.src) {
        console.error('No src ' + item.type_name + '/' + item.unique_name);
      }

      for (let i = 0; i < item.socketed_items.length; i++) {
        utils
          .getInventoryImage(item.socketed_items[i], this.$work_mod.value, this.$work_version.value, this.$palettes.value)
          .then((img) => {
            if (!img) {
              console.error('No src ' + item.type_name + '/' + item.unique_name);
            } else if (item.socketed_items[i]) {
              // Recheck cause it's async, and user may have used unsocket all button in the meanwhile
              item.socketed_items[i].src = img;
            }
          });
      }
    },
    getNewCharFile(classIdx) {
      let charPack;
      let charFile;
      const lookUpKey = `charpack_${this.$work_mod.value}_${this.$work_version.value}`;
      const fallbackKey = 'charpack_default';
      if (lookUpKey in charPacks) {
        charPack = charPacks[lookUpKey];
      } else {
        charPack = charPacks[fallbackKey];
      }
      if (charPack) {
        charFile = charPack.find((char) => char.class == classIdx);
      }
      return charFile;
    },
    newChar(classIdx) {
      const newCharFile = this.getNewCharFile(classIdx);
      if (newCharFile) {
        let bytes = this.$d2s.utils.b64StringToArrayBuffer(newCharFile.base64);
        try {
          this.readBuffer(bytes, null, false); // Do not update version in case we use a fallback file
        } catch (e) {
          alert('Failed to create a character for this mod and version.');
          console.log(e);
        }
      }
    },
    onFileLoad(event) {
      try {
        // If failed, in a 2nd time try parsing it as a remodded 99 file
        this.readBuffer(event.target.result, event.target.filename);
        this.notifications = [];
      } catch (e) {
        alert('Error, have you selected the right mod ? More details in logs.');
        console.error(e);
      }
    },
    readBuffer(bytes, filename, updateVersion = true) {
      let that = this;
      this.save = null;
      this.selectedItem = null;
      this.$d2s
        .read(bytes, this.$work_mod.value)
        .then(async (response) => {
          // Change work version to match the file version
          if (updateVersion && this.$work_version.value != response.header.version) {
            this.$work_version.value = response.header.version;
            this.changeMod(false);
          }

          // Items pack
          const lookupKey = `itempack_${this.$work_mod.value}_${this.$work_version.value}`; // Unfortunately we would exceed localstorage quota if we saved each version item pack
          // if (sessionStorage[lookupKey]) {
          if (utils.utilsCache.has(lookupKey)) {
            // Reuse stored item pack
            // const json = sessionStorage.getItem(lookupKey);
            // this.itempack = JSON.parse(json);
            this.itempack = utils.utilsCache.get(lookupKey);
          } else {
            // Regenerate item pack
            this.itempack = [];

            // Add all bases
            await this.addItemsPackBases('weapon_items', 'Weapons');
            await this.addItemsPackBases('armor_items', 'Armors');
            await this.addItemsPackBases('other_items', 'Misc');

            // Retrieve items from static pack
            if (lookupKey in savedItemPacks) {
              this.itempack.push(...savedItemPacks[lookupKey]);
            }

            // Put in session storage
            // sessionStorage.setItem(lookupKey, JSON.stringify(this.itempack));
            utils.utilsCache.set(lookupKey, this.itempack);
          }

          console.log('Attributes: ' + JSON.stringify(response.attributes));
          that.save = response;

          if (filename) {
            // Force char name to be equal to file name
            that.save.header.name = filename.split('.')[0];
          }
          that.resolveInventoryImages();
        })
        .catch((e) => {
          console.error(e);
          throw e;
        });
    },
    onFileChange(event) {
      let reader = new FileReader();
      reader.filename = event.target.files[0].name;
      reader.onload = this.onFileLoad;
      reader.readAsArrayBuffer(event.target.files[0]);
      event.target.value = null;
    },
    maxGold() {
      const constants = this.$getWorkConstantData();
      this.save.attributes.gold = this.save.header.level * constants.gold.perCharLevel;
      this.save.attributes.goldbank = constants.gold.bank;
    },
    unlockAllQuests() {
      for (const diff of ['quests_normal', 'quests_nm', 'quests_hell']) {
        this.completeQuest(diff, 'act_i', 'den_of_evil', ['newskills'], 1);
        this.completeQuest(diff, 'act_i', 'sisters_burial_grounds');
        this.completeQuest(diff, 'act_i', 'the_search_for_cain');
        this.completeQuest(diff, 'act_i', 'the_forgotten_tower');
        this.completeQuest(diff, 'act_i', 'tools_of_the_trade');
        this.completeQuest(diff, 'act_i', 'sisters_to_the_slaughter');

        this.completeQuest(diff, 'act_ii', 'radaments_lair', ['newskills'], 1);
        this.completeQuest(diff, 'act_ii', 'the_horadric_staff');
        this.completeQuest(diff, 'act_ii', 'tainted_sun');
        this.completeQuest(diff, 'act_ii', 'arcane_sanctuary');
        this.completeQuest(diff, 'act_ii', 'the_summoner');
        this.completeQuest(diff, 'act_ii', 'the_seven_tombs');

        this.completeQuest(diff, 'act_iii', 'the_golden_bird', ['maxhp', 'hitpoints'], 20);
        this.completeQuest(diff, 'act_iii', 'blade_of_the_old_religion');
        this.completeQuest(diff, 'act_iii', 'khalims_will');
        this.completeQuest(diff, 'act_iii', 'lam_esens_tome', ['statpts'], 5);
        this.completeQuest(diff, 'act_iii', 'the_blackened_temple');
        this.completeQuest(diff, 'act_iii', 'the_guardian');

        this.completeQuest(diff, 'act_iv', 'the_fallen_angel', ['newskills'], 2);
        this.completeQuest(diff, 'act_iv', 'hellforge');
        this.completeQuest(diff, 'act_iv', 'terrors_end');

        this.completeQuest(diff, 'act_v', 'siege_on_harrogath');
        this.completeQuest(diff, 'act_v', 'rescue_on_mount_arreat');
        this.completeQuest(diff, 'act_v', 'prison_of_ice', null, null);
        this.completeQuest(diff, 'act_v', 'betrayal_of_harrogath');
        this.completeQuest(diff, 'act_v', 'rite_of_passage');
        this.completeQuest(diff, 'act_v', 'eve_of_destruction');
      }
    },
    completeQuest(difficulty, act, quest, attributes, amount) {
      if (this.save.header[difficulty][act][quest].b0_is_completed === false) {
        this.save.header[difficulty][act][quest].b0_is_completed = true;
        if (quest === 'prison_of_ice') {
          this.save.header[difficulty][act][quest].b7_custom3 = true; // Consumed scroll
        } else if (quest === 'siege_on_harrogath') {
          this.save.header[difficulty][act][quest].b0_is_completed = false; // Consumed Larzuk Q
          this.save.header[difficulty][act][quest].b1_is_requirement_completed = true; // Larzuk Socket Q available
        } else if (attributes) {
          for (let attribute of attributes) {
            this.save.attributes[attribute] = (this.save.attributes[attribute] ?? 0) + amount;
          }
        } else {
          // Simple quest without stat/skill rewards
        }
      }
    },
    unlockSkillStatQs() {
      for (const diff of ['quests_normal', 'quests_nm', 'quests_hell']) {
        this.completeQuest(diff, 'act_i', 'den_of_evil', ['newskills'], 1);
        this.completeQuest(diff, 'act_ii', 'radaments_lair', ['newskills'], 1);
        this.completeQuest(diff, 'act_iii', 'lam_esens_tome', ['statpts'], 5);
        this.completeQuest(diff, 'act_iii', 'the_golden_bird', ['maxhp', 'hitpoints'], 20);
        this.completeQuest(diff, 'act_iv', 'the_fallen_angel', ['newskills'], 2);
        this.completeQuest(diff, 'act_v', 'prison_of_ice', null, null);
      }
    },
    unlockHell() {
      for (let i of ['quests_normal', 'quests_nm', 'quests_hell']) {
        for (let j of ['act_i', 'act_ii', 'act_iii', 'act_iv', 'act_v']) {
          this.save.header[i][j].introduced = true;
          this.save.header[i][j].completed = true;
        }
        this.save.header[i].act_i.sisters_to_the_slaughter.b0_is_completed = true;
        this.save.header[i].act_ii.the_summoner.b0_is_completed = true;
        this.save.header[i].act_ii.tainted_sun.b0_is_completed = true;
        this.save.header[i].act_ii.the_horadric_staff.b0_is_completed = true;
        this.save.header[i].act_ii.arcane_sanctuary.b0_is_completed = true;
        this.save.header[i].act_ii.the_seven_tombs.b0_is_completed = true;
        this.save.header[i].act_iii.khalims_will.b0_is_completed = true;
        this.save.header[i].act_iii.the_blackened_temple.b0_is_completed = true;
        this.save.header[i].act_iii.the_guardian.b0_is_completed = true;
        this.save.header[i].act_iv.terrors_end.b0_is_completed = true;
        this.save.header[i].act_v.rite_of_passage.b0_is_completed = true;
        this.save.header[i].act_v.eve_of_destruction.b0_is_completed = true;
      }
      for (let i of ['normal', 'nm', 'hell']) {
        this.save.header.waypoints[i].act_i.rogue_encampement = true;
        this.save.header.waypoints[i].act_ii.lut_gholein = true;
        this.save.header.waypoints[i].act_iii.kurast_docks = true;
        this.save.header.waypoints[i].act_iv.the_pandemonium_fortress = true;
        this.save.header.waypoints[i].act_v.harrogath = true;
      }
      this.save.header.progression = 15;
    },
    unlockAllWPs() {
      for (var i of ['normal', 'nm', 'hell']) {
        for (var a in this.save.header.waypoints[i]) {
          for (var w in this.save.header.waypoints[i][a]) {
            this.save.header.waypoints[i][a][w] = true;
          }
        }
      }
    },
    setLvl99() {
      this.save.header.level = 99;
    },
    saveFile(mod, version) {
      let link = document.createElement('a');
      let that = this;
      link.style.display = 'none';
      document.body.appendChild(link);
      this.$d2s
        .write(this.save, mod, version)
        .then(function (response) {
          let blob = new Blob([response], { type: 'octet/stream' });
          link.href = window.URL.createObjectURL(blob);
          link.download = that.save.header.name + '.d2s';
          link.click();
          link.remove();
        })
        .catch((e) => {
          alert(
            "Could not perform operation, try removing items with properties that don't exist in this mod/version. More details in logs.",
          );
          console.error(e);
        });
    },
    async addItemsPackBases(categoryKey, categoryDisplayName) {
      let newItems = [];
      const constants = this.$getWorkConstantData();
      for (const item of Object.entries(constants[categoryKey])) {
        if (item[1].n) {
          const newItem = this.$d2s.newItem();
          const typeData = item[1];
          newItem.type = item[0];
          newItem.quality = 2;
          newItem.level = 41;
          newItem.inv_width = typeData.iw;
          newItem.inv_height = typeData.ih;
          newItem.categories = typeData.c;
          newItem.identified = true;
          if (newItem.categories.indexOf('Weapon') > -1) {
            newItem.base_damage = {
              mindam: typeData.mind,
              maxdam: typeData.maxd,
              twohandmindam: typeData.min2d,
              twohandmaxdam: typeData.max2d,
            };
            newItem.current_durability = typeData.durability;
            newItem.max_durability = typeData.durability;
          } else if (newItem.categories.indexOf('Any Armor') > -1) {
            newItem.defense_rating = typeData.maxac;
            newItem.current_durability = typeData.durability;
            newItem.max_durability = typeData.durability;
          } else {
            // Nothing for now
          }
          if (typeData.s) {
            newItem.quantity = typeData.smax || typeData.sspawn || 1;
          }

          newItems.push(newItem);
        }
      }
      this.$d2s.enhanceItems(newItems, this.$work_mod.value, this.$work_version.value, this.save ? this.save.attributes : null);
      for (const item of newItems) {
        // let bytes = await this.$d2s.writeItem(
        //   item,
        //   this.$work_mod.value,
        //   this.$work_version
        // )
        // let base64 = this.$d2s.utils.arrayBufferToBase64String(bytes)
        // let hex = this.$d2s.utils.arrayBufferToHexString(bytes)
        let category = item.categories[0];
        this.itempack.push({
          key: './Bases/' + categoryDisplayName + '/' + category + '/' + item.type_name.split('<br>').pop() + '.d2i',
          value: {
            mod: this.$work_mod.value,
            version: this.$work_version.value,
            // base64: base64,
            // hex: hex,
            object: item,
          },
        });
      }
    },
  },
};
</script>

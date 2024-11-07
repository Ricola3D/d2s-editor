<template>
  <ContextMenu :ref="'contextMenu'" @option-clicked="optionClicked" />
  <div @click.native="rootClick">
    <link v-if="theme == 'd2'" href="css/theme.css" rel="stylesheet" />

    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="octicon octicon-clippy navbar-brand">
        <a href="https://github.com/ricola3d">Ricola3D</a> /
        <a
          class="font-weight-bold"
          href="https://github.com/ricola3d/d2s-editor"
          >d2s-editor</a
        >
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
            <a class="nav-link" href="#"
              >Home <span class="sr-only">(current)</span></a
            >
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
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
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
            <input
              id="d2iFile"
              style="display: none"
              type="file"
              name="d2iFile"
              @change="onItemFileChange"
            />
            <label for="d2iFile" class="mb-0 btn btn-primary"
              >Load From File</label
            >
            <button
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
              @click="loadBase64Item"
            >
              Load From String
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
              @click="loadItem"
            >
              Load
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
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
                This editor is still a work in progress. Some things may not
                work. Found a bug?
                <a href="https://github.com/ricola3d/d2s-editor/issues/new"
                  >Report it.</a
                >
              </div>
              <form id="d2sForm">
                <fieldset>
                  <div class="form-group">
                    <div class="input-group">
                      <select
                        id="open-mod"
                        name="open-mod"
                        @change="onModChange($event)"
                      >
                        <option value="vanilla">Vanilla</option>
                        <option value="remodded" selected="selected">
                          ReMoDDeD
                        </option>
                      </select>
                      <div class="custom-file">
                        <input
                          id="d2sFile"
                          type="file"
                          name="d2sFile"
                          accept=".d2s"
                          @change="onFileChange"
                        />
                        <label class="custom-file-label" for="d2sFile"
                          >*.d2s</label
                        >
                      </div>
                      <div>
                        <button
                          type="button"
                          class="btn btn-secondary dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          Create New
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                          <button
                            class="dropdown-item"
                            type="button"
                            @click="newChar(0)"
                          >
                            Amazon
                          </button>
                          <button
                            class="dropdown-item"
                            type="button"
                            @click="newChar(1)"
                          >
                            Sorceress
                          </button>
                          <button
                            class="dropdown-item"
                            type="button"
                            @click="newChar(2)"
                          >
                            Necromancer
                          </button>
                          <button
                            class="dropdown-item"
                            type="button"
                            @click="newChar(3)"
                          >
                            Paladin
                          </button>
                          <button
                            class="dropdown-item"
                            type="button"
                            @click="newChar(4)"
                          >
                            Barbarian
                          </button>
                          <button
                            class="dropdown-item"
                            type="button"
                            @click="newChar(5)"
                          >
                            Druid
                          </button>
                          <button
                            class="dropdown-item"
                            type="button"
                            @click="newChar(6)"
                          >
                            Assassin
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        class="btn btn-danger"
                        @click="test()"
                      >
                        Test
                      </button>
                      <div class="input-group-append">
                        <span>&nbsp;</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="save != null">
                    <ul id="tabs" class="nav nav-tabs">
                      <li class="nav-item">
                        <a
                          id="stats-tab"
                          class="nav-link active"
                          data-toggle="tab"
                          data-target="#stats-content"
                          role="tab"
                          type="button"
                          >Stats</a
                        >
                      </li>
                      <li class="nav-item" role="presentation">
                        <a
                          id="waypoints-tab"
                          class="nav-link"
                          data-toggle="tab"
                          data-target="#waypoints-content"
                          role="tab"
                          type="button"
                          >Waypoints</a
                        >
                      </li>
                      <li class="nav-item" role="presentation">
                        <a
                          id="quests-tab"
                          class="nav-link"
                          data-toggle="tab"
                          data-target="#quests-content"
                          role="tab"
                          type="button"
                          >Quests</a
                        >
                      </li>
                      <li class="nav-item" role="presentation">
                        <a
                          id="skills-tab"
                          class="nav-link"
                          data-toggle="tab"
                          data-target="#skills-content"
                          role="tab"
                          type="button"
                          >Skills</a
                        >
                      </li>
                      <li class="nav-item" role="presentation">
                        <a
                          id="items-tab"
                          class="nav-link"
                          data-toggle="tab"
                          data-target="#items-content"
                          role="tab"
                          type="button"
                          >Items</a
                        >
                      </li>
                    </ul>
                    <div id="tabs-content" class="tab-content">
                      <div
                        id="stats-content"
                        class="tab-pane show active"
                        role="tabpanel"
                      >
                        <Stats v-model:save="save" />
                      </div>
                      <div
                        id="waypoints-content"
                        class="tab-pane"
                        role="tabpanel"
                      >
                        <Waypoints
                          :waypoints="save.header.waypoints"
                          @update:waypoints="save.header.waypoints = $event"
                        />
                      </div>
                      <div id="quests-content" class="tab-pane" role="tabpanel">
                        <Quests :save="save" @update:save="save = $event" />
                      </div>
                      <div id="skills-content" class="tab-pane" role="tabpanel">
                        <Skills v-model:save="save" />
                      </div>
                      <div id="items-content" class="tab-pane" role="tabpanel">
                        <div
                          v-for="(notification, idx) in notifications"
                          :key="idx"
                          :class="notification.alert"
                          role="alert"
                        >
                          {{ notification.message }}
                          <button
                            type="button"
                            class="close"
                            data-dismiss="alert"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="row mt-3">
                          <div
                            class="btn-group overflow-auto offset-md-3 col-md-6"
                            role="group"
                          >
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
                              <button
                                type="button"
                                class="btn btn-secondary dropdown-toggle"
                                data-toggle="dropdown"
                              />
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
                                        <div
                                          class="input-group-prepend input-group-append"
                                        >
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
                                        <div
                                          class="input-group-prepend input-group-append"
                                        >
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
                                        <div
                                          class="input-group-prepend input-group-append"
                                        >
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
                                :disabled="!clipboard"
                                @click="paste()"
                              >
                                Paste
                              </button>
                              <button
                                type="button"
                                class="btn btn-primary"
                                data-toggle="modal"
                                data-target="#LoadItem"
                              >
                                Load Item
                              </button>
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
                          :page="1"
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
                          :page="5"
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
                          :page="4"
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
                          @item-event="onEvent"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
                <div id="errors" />
                <br />
                <div v-if="save != null">
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="unlockHell"
                  >
                    Unlock Hell
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="unlockAllWPs"
                  >
                    Unlock All WPs
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="setLvl99"
                  >
                    Set Level 99
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="unlockAllQuests"
                  >
                    Complete all Qs
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="unlockSkillStatQs"
                  >
                    Complete Skill/Stat Qs
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="maxGold"
                  >
                    Max Gold
                  </button>
                  <br /><br />
                  <button
                    type="button"
                    class="btn btn-danger"
                    @click="setAllSkills20"
                  >
                    Set All Skills 20
                  </button>
                  <br /><br />
                  <!-- <template v-if="work_mod === 'vanilla'">
                    <button
                      id="d2"
                      type="button"
                      class="btn btn-primary"
                      @click="saveFile(work_mod, 0x60)"
                    >
                      Save D2
                    </button>
                    <button
                      id="d2r"
                      type="button"
                      class="btn btn-primary"
                      @click="saveFile(work_mod, 0x63)"
                    >
                      Save D2R
                    </button>
                  </template>
                  <template v-else>
                    <button
                      id="d2r"
                      type="button"
                      class="btn btn-primary"
                      @click="saveFile(work_mod, 0x63)"
                    >
                      Save
                    </button>
                  </template> -->
                  <button
                    id="d2"
                    type="button"
                    class="btn btn-primary"
                    @click="saveFile('vanilla', 0x60)"
                  >
                    Save D2
                  </button>
                  <button
                    id="d2r"
                    type="button"
                    class="btn btn-primary"
                    @click="saveFile('vanilla', 0x63)"
                  >
                    Save D2R
                  </button>
                  <button
                    id="d2r"
                    type="button"
                    class="btn btn-primary"
                    @click="saveFile('remodded', 0x62)"
                  >
                    Save ReMoDDeD MP
                  </button>
                  <button
                    id="d2r"
                    type="button"
                    class="btn btn-primary"
                    @click="saveFile('remodded', 0x63)"
                  >
                    Save ReMoDDeD SP
                  </button>
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
import { cloneDeep } from 'lodash'

import Item from './inventory/Item.vue'
import ContextMenu from './ContextMenu.vue'
import Stats from './Stats.vue'
import Waypoints from './Waypoints.vue'
import Quests from './Quests.vue'
import Skills from './Skills.vue'
import Equipped from './inventory/Equipped.vue'
import Grid from './inventory/Grid.vue'
import Mercenary from './Mercenary.vue'
import ItemEditor from './inventory/ItemEditor.vue'

import ItemPack from '../d2/ItemPack.js'
import CharPack from '../d2/CharPack.js'
import utils from '../utils.js'

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
      itempack: ItemPack,
      item_options: [],
      previewModel: null,
      preview: null,
      clipboard: null,
      load: null,
      notifications: [],
      grid: {
        inv: { w: 10, h: 8 },
        stash: { w: 16, h: 13 },
        cube: { w: 16, h: 13 },
      },
      selectedItem: null,
      theme: localStorage.getItem('theme'),
    }
  },
  computed: {
    equipped() {
      return this.save.items.filter((item) => item.location_id === 1)
    },
    inventory() {
      return this.save.items.filter(
        (item) => item.location_id === 0 && item.alt_position_id === 1
      )
    },
    stash() {
      return this.save.items.filter(
        (item) => item.location_id === 0 && item.alt_position_id === 5
      )
    },
    cube() {
      return this.save.items.filter(
        (item) => item.location_id === 0 && item.alt_position_id === 4
      )
    },
    mercenary() {
      return this.save.merc_items || []
    },
  },
  async mounted() {
    window.work_mod = 'remodded'
    window.work_version = 99

    // A list of existing versions can be found here: https://github.com/WalterCouto/D2CE/blob/main/d2s_File_Format.md#versions.
    d2s.setConstantData('vanilla', 0x60, window.vanilla_constants_96) //1.10-1.14d
    d2s.setConstantData('vanilla', 0x61, window.vanilla_constants_96) //alpha? (D2R)
    d2s.setConstantData('vanilla', 0x62, window.vanilla_constants_98) //2.4 (D2R)
    d2s.setConstantData('remodded', 0x62, window.remodded_constants_98) //2.4 (D2R)
    d2s.setConstantData('vanilla', 0x63, window.vanilla_constants_99) //2.5+ (D2R)
    d2s.setConstantData('remodded', 0x63, window.remodded_constants_99) //2.5+ (D2R)

    await this.getPaletteData()

    if (localStorage.grid) {
      this.grid = JSON.parse(localStorage.getItem('grid'))
    }

    // Add all the base weapons & armors to the insertable items list
    if (sessionStorage.itempack) {
      const json = sessionStorage.getItem('itempack')
      this.itempack = JSON.parse(json)
    } else {
      await this.addItemsPackBases('weapon_items', 'Weapons')
      await this.addItemsPackBases('armor_items', 'Armors')
      sessionStorage.setItem('itempack', JSON.stringify(this.itempack))
    }

    this.item_options = this.itempack.map((item) => ({
      id: item.key,
      text: item.key,
      value: item.value,
    }))
  },
  methods: {
    setTheme(theme) {
      localStorage.setItem('theme', theme)
      this.theme = theme
      return
    },
    rootClick() {
      this.$refs.contextMenu.close()
    },
    async getPaletteData() {
      window.palettes = {}
      window.palettes['ACT1'] = []
      let response = await fetch(
        `d2/game_data/${window.work_mod}/version_${window.work_version}/global/palette/ACT1/pal.dat`
      )
      let buffer = new Uint8Array(await response.arrayBuffer())
      for (let i = 0; i < 256; i += 1) {
        window.palettes['ACT1'].push([
          buffer[i * 3 + 2],
          buffer[i * 3 + 1],
          buffer[i * 3],
        ])
      }
      for (const [k, v] of Object.entries(utils.colormaps)) {
        response = await fetch(v)
        buffer = new Uint8Array(await response.arrayBuffer())
        window.palettes[k] = []
        for (let i = 0; i < Object.keys(utils.colors).length; i += 1) {
          window.palettes[k].push(buffer.slice(0 + i * 256, 256 + i * 256))
        }
      }
    },
    onModChange(event) {
      window.work_mod = event.target.value
      this.getPaletteData()
    },
    optionClicked(event) {
      switch (event.option.text) {
        case 'Delete':
          this.onEvent({
            type: 'delete',
            item: event.obj,
          })
          break
        case 'Copy':
          this.onEvent({
            type: 'copy',
            item: event.obj,
          })
          break
        case 'Share':
          this.onEvent({
            type: 'share',
            item: event.obj,
          })
          break
        case 'Paste At':
          if (event.obj?.length !== 2 || this.clipboard == null) {
            break
          }
          this.onEvent({
            type: 'pasteAt',
            item: this.clipboard,
            grid: event.obj,
          })
          break
        case 'Select':
          this.onSelect(event.obj)
          break
      }
      this.$refs.contextMenu.close()
    },
    gridChange() {
      localStorage.setItem('grid', JSON.stringify(this.grid))
    },
    changeTab(i) {
      this.activeTab = i
    },
    onSelect(e) {
      this.selectedItem = e
    },
    findIndex(list, i) {
      return list.findIndex(
        (item) =>
          item.location_id == i.location_id &&
          item.equipped_id == i.equipped_id &&
          item.position_x == i.position_x &&
          item.position_y == i.position_y &&
          item.alt_position_id == i.alt_position_id
      )
    },
    deleteItem(list, idx) {
      list.splice(idx, 1)
      this.selectedItem = null
    },
    // Method to share an item (through clipboard). By default we share as a vanilla 99 item.
    async shareItem(item) {
      let bytes = await d2s.writeItem(
        item,
        window.work_mod,
        window.work_version
      )
      let base64 = utils.arrayBufferToBase64String(bytes)
      let hex = utils.arrayBufferToHexString(bytes)
      let sharedContent = {
        mod: window.work_mod,
        version: window.work_version,
        base64: base64,
        hex: hex,
      }
      navigator.clipboard.writeText(JSON.stringify(sharedContent))
      this.notifications.push({
        alert: 'alert alert-info',
        message: `Item data copied to clipboard. Use load from string to share it with someone.`,
      })
    },
    onEvent(e) {
      if (e.type == 'share') {
        this.shareItem(e.item)
      } else if (e.type == 'copy') {
        this.clipboard = cloneDeep(e.item)
      } else if (e.type == 'update') {
        d2s.enhanceItems([e.item], window.work_mod, window.work_version)
        this.resolveInventoryImage(e.item)
      } else if (e.type == 'delete') {
        let idx = this.findIndex(this.save.items, e.item)
        if (idx != -1) {
          this.deleteItem(this.save.items, idx)
          return
        }
        idx = this.findIndex(this.save.merc_items, e.item)
        if (idx != -1) {
          this.deleteItem(this.save.merc_items, idx)
          return
        }
      } else if (e.type == 'move') {
        let element = document.getElementById(e.id)
        element.style.backgroundColor = ''
        element.style.width = ''
        element.style.height = ''
        if (window.uuid == e.uuid) {
          let idx = this.findIndex(this.save.items, e.item)
          this.onMove(this.save.items[idx], e)
        } else {
          //copy to another tab
          if (this.onMove(e.item, e)) {
            this.save.items.push(e.item)
          }
        }
      } else if (e.type == 'dragenter') {
        let item = e.item
        if (
          this.canPlaceItem(
            item,
            e.location.storage_page,
            e.location.x,
            e.location.y
          )
        ) {
          let element = document.getElementById(e.id)
          element.style.backgroundColor = 'green'
          element.style.width = `calc(var(--grid-size) * ${item.inv_width})`
          element.style.height = `calc(var(--grid-size) * ${item.inv_height})`
        }
      } else if (e.type == 'dragleave') {
        let element = document.getElementById(e.id)
        element.style.backgroundColor = ''
        element.style.width = ''
        element.style.height = ''
      } else if (e.type === 'pasteAt') {
        const storage_page =
          this.activeTab === 1
            ? 1 // Equipped
            : this.activeTab === 3
              ? 5 // Stash
              : this.activeTab === 4
                ? 4 // Cube
                : 1 // Inventory
        // For now, paste can only be made in the grid
        if (this.canPlaceItem(e.item, storage_page, e.grid[0], e.grid[1])) {
          this.paste(e.item, [
            0, // location_id: 0 (Stored)
            0, // equipped_id: 0 (Stored)
            e.grid[0],
            e.grid[1],
            storage_page,
          ])
        } else {
          this.paste(e.item)
        }
      }
    },
    onMove(item, e) {
      if (
        !this.canPlaceItem(
          item,
          e.location.storage_page,
          e.location.x,
          e.location.y
        )
      ) {
        return false
      }
      if (e.location.location == 1) {
        item.location_id = e.location.location
        item.equipped_id = e.location.equipped_location
        item.position_x = 0
        item.position_y = 0
        item.alt_position_id = 0
      } else if (e.location.location == 0) {
        item.location_id = e.location.location
        item.equipped_id = 0
        item.position_x = e.location.x
        item.position_y = e.location.y
        item.alt_position_id = e.location.storage_page
      } else if (e.location.location == 4) {
        item.location_id = e.location.location
        item.equipped_id = 0
        item.position_x = 4 //why?
        item.position_y = 0
        item.alt_position_id = 0
      }
      return true
    },
    // Method to parse an item byte array and preview it
    async readItem(bytes, mod, version) {
      this.preview = await d2s.readItem(bytes, mod, version)
      await this.resolveInventoryImage(this.preview)
      utils.removeMaxDurabilityFromRunwords(this.preview)
    },
    // Callback to read the input-select value and fill the preview thumbnail
    async previewItem(/* event */) {
      if (this.previewModel) {
        let bytes = utils.b64StringToArrayBuffer(this.previewModel.base64)
        this.readItem(bytes, this.previewModel.mod, this.previewModel.version)
      }
    },
    // Method to load an item from its a JSON {mod, version, base64 or hex} or simply a base64 string (mod & version will be set to vanilla 99 by default).
    async loadFromString() {
      let input = prompt(
        'Please enter a JSON with mod, version and base64 or hex.'
      )
      try {
        let obj = JSON.parse(input)
        let bytes = null
        if (!obj.mod || !obj.version) {
          throw new Error('No mod and version specified.')
        }
        if (obj.b64) bytes = utils.b64StringToArrayBuffer(obj.b64)
        else if (obj.hex) {
          bytes = utils.hexStringToArrayBuffer(obj.hex)
        } else {
          throw new Error('No item code in the input.')
        }
        await this.readItem(bytes, obj.mod, obj.version)
        this.paste(this.preview)
      } catch (e) {
        alert('Failed to load the item, contact the Administrator.')
        console.error(e)
      }
    },
    // Method to load a chosen item
    loadItem() {
      this.paste(this.preview)
    },
    paste(item, position) {
      let copy = JSON.parse(
        JSON.stringify(item != null ? item : this.clipboard)
      )
      let pos = position ?? this.findSafeLocation(copy)
      copy.location_id = pos[0]
      copy.equipped_id = pos[1]
      copy.position_x = pos[2]
      copy.position_y = pos[3]
      copy.alt_position_id = pos[4]
      this.notifications = []
      if (copy.location_id == 4) {
        this.notifications.push({
          alert: 'alert alert-warning',
          message: `Could not find safe location to place item. Placed in mouse buffer.`,
        })
      } else {
        let loc =
          copy.alt_position_id == 1
            ? 'inventory'
            : copy.alt_position_id == 5
              ? 'stash'
              : 'cube'
        this.notifications.push({
          alert: 'alert alert-info',
          message: `Loaded item in ${loc} at ${copy.position_x}, ${copy.position_y}`,
        })
      }
      this.save.items.push(copy)
      this.selectedItem = copy
    },
    findSafeLocation(item) {
      //inv = 1, cube = 4, stash = 5
      for (let i = 0; i < this.grid.inv.w; i++) {
        for (let j = 0; j < this.grid.inv.h; j++) {
          if (this.canPlaceItem(item, 1, i, j)) {
            return [0, 0, i, j, 1]
          }
        }
      }
      for (let i = 0; i < this.grid.stash.w; i++) {
        for (let j = 0; j < this.grid.stash.h; j++) {
          if (this.canPlaceItem(item, 5, i, j)) {
            return [0, 0, i, j, 5]
          }
        }
      }
      for (let i = 0; i < this.grid.cube.w; i++) {
        for (let j = 0; j < this.grid.cube.h; j++) {
          if (this.canPlaceItem(item, 4, i, j)) {
            return [0, 0, i, j, 4]
          }
        }
      }
      return [4, 0, 4, 0, 0]
    },
    canPlaceItem(item, loc, x, y) {
      var bounds
      if (loc == 4) {
        bounds = this.grid.cube
      } else if (loc == 5) {
        bounds = this.grid.stash
      } else {
        bounds = this.grid.inv
      }
      if (x + item.inv_width > bounds.w) {
        return false
      }
      if (y + item.inv_height > bounds.h) {
        return false
      }
      var rect = [x, y, x + item.inv_width, y + item.inv_height]
      let closeItems = this.save.items.filter(
        (item) => item.location_id === 0 && item.alt_position_id === loc
      )
      for (var closeItem of closeItems) {
        var r = [
          closeItem.position_x,
          closeItem.position_y,
          closeItem.position_x + closeItem.inv_width,
          closeItem.position_y + closeItem.inv_height,
        ]
        if (this.contains(rect, r) || this.overlaps(rect, r)) {
          return false
        }
      }
      return true
    },
    contains(a, b) {
      return !(b[0] < a[0] || b[1] < a[1] || b[2] > a[2] || b[3] > a[3])
    },
    overlaps(a, b) {
      if (a[0] >= b[2] || b[0] >= a[2]) return false
      if (a[1] >= b[3] || b[1] >= a[3]) return false
      return true
    },
    test() {
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/zod_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/gem/perfect_diamond2.lowend.sprite")
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/thul_rune.lowend.sprite"      )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/hel_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/ber_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/ith_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/gem/perfect_diamond3.lowend.sprite")
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/gem/perfect_diamond5.lowend.sprite")
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/hel_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/lo_rune.lowend.sprite"        )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/tir_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/gem/perfect_diamond6.lowend.sprite")
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/mal_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/gem/perfect_diamond1.lowend.sprite")
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/ohm_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/el_rune.lowend.sprite"        )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/ort_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/ko_rune.lowend.sprite"        )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/gul_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/um_rune.lowend.sprite"        )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/ist_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/amn_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/lem_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/lum_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/ral_rune.lowend.sprite"       )
      fetch("d2/game_data/remodded/version_99/hd/global/ui/items/misc/rune/cham_rune.lowend.sprite"      )
    },
    async resolveInventoryImages() {
      const allItems = [
        ...this.save.items,
        ...this.save.merc_items,
        ...this.save.corpse_items,
        this.save.golem_item,
      ]
      const promises = allItems.map(async function (item) {
        return this.resolveInventoryImage(item)
      }, this)
      return Promise.all(promises)
    },
    async resolveInventoryImage(item) {
      if (!item) {
        return
      }
      item.src = await utils.getInventoryImage(item)
      if (!item.src) {
        console.error("No src " + item.type_name + "/" + item.unique_name)
      }

      for (let i = 0; i < item.socketed_items.length; i++) {
        item.socketed_items[i].src = await utils.getInventoryImage(
          item.socketed_items[i]
        )
        if (!item.socketed_items[i].src) {
          console.error("No src " + item.type_name + "/" + item.unique_name)
        }
      }
    },
    newChar(index) {
      let char = CharPack[index]
      let bytes = utils.b64StringToArrayBuffer(char.base64)
      this.readBuffer(bytes, char.mod)
    },
    onFileLoad(event) {
      let mod = document.getElementById('open-mod').value
      try {
        // If failed, in a 2nd time try parsing it as a remodded 99 file
        this.readBuffer(event.target.result, mod, event.target.filename)
      } catch (e) {
        alert("Could not perform operation, check you selected the proper mod. More details in logs.")
        console.error(e)
      }
    },
    readBuffer(bytes, mod, filename) {
      let that = this
      this.save = null
      this.selectedItem = null
      d2s.read(bytes, mod).then((response) => {
        console.log('Attributes: ' + JSON.stringify(response.attributes))
        that.save = response
        window.work_version = that.save.header.version
        if (filename) {
          // Force char name to be equal to file name
          that.save.header.name = filename.split('.')[0]
        }
        that.resolveInventoryImages()
      }).catch((e) => {
        alert("Could not perform operation, check you selected the proper mod. More details in logs.")
        console.error(e);
      });
    },
    onFileChange(event) {
      let reader = new FileReader()
      reader.filename = event.target.files[0].name
      reader.onload = this.onFileLoad
      reader.readAsArrayBuffer(event.target.files[0])
      event.target.value = null
    },
    maxGold() {
      this.save.attributes.gold = this.save.header.level * 10000
      this.save.attributes.goldbank = 2500000
    },
    unlockAllQuests() {
      for (const diff of ['quests_normal', 'quests_nm', 'quests_hell']) {
        this.completeQuest(diff, 'act_i', 'den_of_evil', ['newskills'], 1)
        this.completeQuest(diff, 'act_i', 'sisters_burial_grounds')
        this.completeQuest(diff, 'act_i', 'the_search_for_cain')
        this.completeQuest(diff, 'act_i', 'the_forgotten_tower')
        this.completeQuest(diff, 'act_i', 'tools_of_the_trade')
        this.completeQuest(diff, 'act_i', 'sisters_to_the_slaughter')

        this.completeQuest(diff, 'act_ii', 'radaments_lair', ['newskills'], 1)
        this.completeQuest(diff, 'act_ii', 'the_horadric_staff')
        this.completeQuest(diff, 'act_ii', 'tainted_sun')
        this.completeQuest(diff, 'act_ii', 'arcane_sanctuary')
        this.completeQuest(diff, 'act_ii', 'the_summoner')
        this.completeQuest(diff, 'act_ii', 'the_seven_tombs')

        this.completeQuest(
          diff,
          'act_iii',
          'the_golden_bird',
          ['maxhp', 'hitpoints'],
          20
        )
        this.completeQuest(diff, 'act_iii', 'blade_of_the_old_religion')
        this.completeQuest(diff, 'act_iii', 'khalims_will')
        this.completeQuest(diff, 'act_iii', 'lam_esens_tome', ['statpts'], 5)
        this.completeQuest(diff, 'act_iii', 'the_blackened_temple')
        this.completeQuest(diff, 'act_iii', 'the_guardian')

        this.completeQuest(diff, 'act_iv', 'the_fallen_angel', ['newskills'], 2)
        this.completeQuest(diff, 'act_iv', 'hellforge')
        this.completeQuest(diff, 'act_iv', 'terrors_end')

        this.completeQuest(diff, 'act_v', 'siege_on_harrogath')
        this.completeQuest(diff, 'act_v', 'rescue_on_mount_arreat')
        this.completeQuest(diff, 'act_v', 'prison_of_ice', null, null)
        this.completeQuest(diff, 'act_v', 'betrayal_of_harrogath')
        this.completeQuest(diff, 'act_v', 'rite_of_passage')
        this.completeQuest(diff, 'act_v', 'eve_of_destruction')
      }
    },
    completeQuest(difficulty, act, quest, attributes, amount) {
      if (this.save.header[difficulty][act][quest].b0_is_completed === false) {
        this.save.header[difficulty][act][quest].b0_is_completed = true
        if (quest === 'prison_of_ice') {
          this.save.header[difficulty][act][quest].b7_custom3 = true // Consumed scroll
        } else if (attributes) {
          for (let attribute of attributes) {
            this.save.attributes[attribute] =
              (this.save.attributes[attribute] ?? 0) + amount
          }
        } else {
          // Simple quest without stat/skill rewards
        }
      }
    },
    unlockSkillStatQs() {
      for (const diff of ['quests_normal', 'quests_nm', 'quests_hell']) {
        this.completeQuest(diff, 'act_i', 'den_of_evil', ['newskills'], 1)
        this.completeQuest(diff, 'act_ii', 'radaments_lair', ['newskills'], 1)
        this.completeQuest(diff, 'act_iii', 'lam_esens_tome', ['statpts'], 5)
        this.completeQuest(
          diff,
          'act_iii',
          'the_golden_bird',
          ['maxhp', 'hitpoints'],
          20
        )
        this.completeQuest(diff, 'act_iv', 'the_fallen_angel', ['newskills'], 2)
        this.completeQuest(diff, 'act_v', 'prison_of_ice', null, null)
      }
    },
    unlockHell() {
      for (var i of ['quests_normal', 'quests_nm', 'quests_hell']) {
        for (var j of ['act_i', 'act_ii', 'act_iii', 'act_iv', 'act_v']) {
          this.save.header[i][j].introduced = true
          this.save.header[i][j].completed = true
        }
        this.save.header[i].act_i.sisters_to_the_slaughter.b0_is_completed =
          true
        this.save.header[i].act_ii.the_summoner.b0_is_completed = true
        this.save.header[i].act_ii.tainted_sun.b0_is_completed = true
        this.save.header[i].act_ii.the_horadric_staff.b0_is_completed = true
        this.save.header[i].act_ii.arcane_sanctuary.b0_is_completed = true
        this.save.header[i].act_ii.the_seven_tombs.b0_is_completed = true
        this.save.header[i].act_iii.khalims_will.b0_is_completed = true
        this.save.header[i].act_iii.the_blackened_temple.b0_is_completed = true
        this.save.header[i].act_iii.the_guardian.b0_is_completed = true
        this.save.header[i].act_iv.terrors_end.b0_is_completed = true
        this.save.header[i].act_v.rite_of_passage.b0_is_completed = true
        this.save.header[i].act_v.eve_of_destruction.b0_is_completed = true
      }
      for (var i of ['normal', 'nm', 'hell']) {
        this.save.header.waypoints[i].act_i.rogue_encampement = true
        this.save.header.waypoints[i].act_ii.lut_gholein = true
        this.save.header.waypoints[i].act_iii.kurast_docks = true
        this.save.header.waypoints[i].act_iv.the_pandemonium_fortress = true
        this.save.header.waypoints[i].act_v.harrogath = true
      }
      this.save.header.progression = 15
    },
    unlockAllWPs() {
      for (var i of ['normal', 'nm', 'hell']) {
        for (var a in this.save.header.waypoints[i]) {
          for (var w in this.save.header.waypoints[i][a]) {
            this.save.header.waypoints[i][a][w] = true
          }
        }
      }
    },
    setLvl99() {
      this.save.header.level = 99
    },
    setAllSkills20() {
      for (var s of this.save.skills) {
        s.points = 20
      }
    },
    saveFile(mod, version) {
      let link = document.createElement('a')
      let that = this
      link.style.display = 'none'
      document.body.appendChild(link)
      d2s.write(this.save, mod, version).then(function (response) {
        let blob = new Blob([response], { type: 'octet/stream' })
        link.href = window.URL.createObjectURL(blob)
        link.download = that.save.header.name + '.d2s'
        link.click()
        link.remove()
      }).catch((e) => {
        alert("Could not perform operation, try removing items with deprecated properties. More details in logs.")
        console.error(e);
      });
    },
    async addItemsPackBases(categoryKey, categoryDisplayName) {
      let newItems = []
      const constants =
        window[`${window.work_mod}_constants_${window.work_version}`]
      for (const item of Object.entries(constants[categoryKey])) {
        if (item[1].n) {
          const newItem = d2s.newItem()
          const value = item[1]
          newItem.type = item[0]
          newItem.quality = 2
          newItem.level = 41
          newItem.inv_width = value.iw
          newItem.inv_height = value.ih
          newItem.categories = value.c
          newItem.identified = 1
          if (newItem.categories.indexOf('Weapon') > -1) {
            newItem.base_damage = {
              mindam: value.mind,
              maxdam: value.maxd,
              twohandmindam: value.min2d,
              twohandmaxdam: value.max2d,
            }
          }
          if (newItem.categories.indexOf('Any Armor') > -1) {
            newItem.defense_rating = value.maxac
          }
          newItem.current_durability = value.durability
          newItem.max_durability = value.durability
          newItems.push(newItem)
        }
      }
      d2s.enhanceItems(newItems, window.work_mod, window.work_version)
      for (const item of newItems) {
        let bytes = await d2s.writeItem(
          item,
          window.work_mod,
          window.work_version
        )
        let base64 = utils.arrayBufferToBase64String(bytes)
        let hex = utils.arrayBufferToHexString(bytes)
        let category = item.categories[0]
        this.itempack.push({
          key:
            './Bases/' +
            categoryDisplayName +
            '/' +
            category +
            '/' +
            item.type_name +
            '.d2i',
          value: {
            mod: window.work_mod,
            version: window.work_version,
            base64: base64,
            hex: hex,
          },
        })
      }
    },
  },
}
</script>

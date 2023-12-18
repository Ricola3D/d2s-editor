<template>
  <ContextMenu :ref="'contextMenu'" @option-clicked="optionClicked"></ContextMenu>
  <div @click.native="rootClick">
    <link v-if="theme == 'd2'" href="css/theme.css" rel="stylesheet" />

    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="octicon octicon-clippy navbar-brand">
        <i class="fa fa-fw fa-github"></i>
        <a href="https://github.com/ricola3d">Ricola3D</a> / <a class="font-weight-bold"
          href="https://github.com/ricola3d/d2s-editor">d2s-editor</a>
      </div>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
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

    <div class="modal" tabindex="-1" role="dialog" id="LoadItem">
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
              <Item v-if="preview" :item="preview" clazz="item-edit"></Item>
            </div>
            <label for="Item">Item</label>
            <multiselect v-model="previewModel" :options="itempack" label="key" valueProp="value" :searchable="true" @update:model-value="previewItem"/>
          </div>
          <div class="modal-footer">
            <input style="display:none;" type="file" name="d2iFile" @change="onItemFileChange" id="d2iFile">
            <label for="d2iFile" class="mb-0 btn btn-primary">Load From File</label>
            <button type="button" class="btn btn-primary" @click="loadBase64Item" data-dismiss="modal">Load From String</button>
            <button type="button" class="btn btn-primary" @click="loadItem" data-dismiss="modal">Load</button>
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
                This editor is still a work in progress. Some things may not work. Found a bug? <a
                  href="https://github.com/dschu012/d2s-editor/issues/new">Report it.</a>
              </div>
              <form id="d2sForm">
                <fieldset>
                  <div class="form-group">
                    <div class="input-group">
                      <select name="open-mod" id="open-mod">
                        <option value="vanilla">Vanilla</option>
                        <option value="remodded" selected="selected">ReMoDDeD</option>
                      </select>
                      <div class="custom-file">
                        <input type="file" name="d2sFile" @change="onFileChange" id="d2sFile" accept=".d2s">
                        <label class="custom-file-label" for="d2sFile">*.d2s</label>
                      </div>
                      <div>
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown">Create
                          New</button>
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
                      <div class="input-group-append"><span>&nbsp;</span></div>
                    </div>
                  </div>
                  <div v-if="save != null">
                    <ul class="nav nav-tabs" id="tabs">
                      <li class="nav-item">
                        <a class="nav-link active" id="stats-tab" data-toggle="tab" data-target="#stats-content" role="tab"
                          type="button">Stats</a>
                      </li>
                      <li class="nav-item" role="presentation">
                        <a class="nav-link" id="waypoints-tab" data-toggle="tab" data-target="#waypoints-content" role="tab"
                          type="button">Waypoints</a>
                      </li>
                      <li class="nav-item" role="presentation">
                        <a class="nav-link" id="quests-tab" data-toggle="tab" data-target="#quests-content" role="tab"
                          type="button">Quests</a>
                      </li>
                      <li class="nav-item" role="presentation">
                        <a class="nav-link" id="skills-tab" data-toggle="tab" data-target="#skills-content" role="tab"
                          type="button">Skills</a>
                      </li>
                      <li class="nav-item" role="presentation">
                        <a class="nav-link" id="items-tab" data-toggle="tab" data-target="#items-content" role="tab"
                          type="button">Items</a>
                      </li>

                    </ul>
                    <div class="tab-content" id="tabs-content">
                      <div class="tab-pane show active" id="stats-content" role="tabpanel">
                        <Stats v-bind:save.sync="save" />
                      </div>
                      <div class="tab-pane" id="waypoints-content" role="tabpanel">
                        <Waypoints :waypoints="save.header.waypoints" v-on:update:waypoints="save.header.waypoints = $event" />
                      </div>
                      <div class="tab-pane" id="quests-content" role="tabpanel">
                        <Quests :save="save" v-on:update:save="save = $event" />
                      </div>
                      <div class="tab-pane" id="skills-content" role="tabpanel">
                        <Skills v-bind:save.sync="save" />
                      </div>
                      <div class="tab-pane" id="items-content" role="tabpanel">
                        <div v-for="(notification, idx) in notifications" :key="idx" :class="notification.alert" role="alert">
                          {{ notification.message }}
                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="row mt-3">
                          <div class="btn-group overflow-auto offset-md-3 col-md-6" role="group">
                            <button type="button" class="btn btn-secondary" :class="{ active: activeTab == 1 }"
                              @click="changeTab(1)">Equipped</button>
                            <button type="button" class="btn btn-secondary" :class="{ active: activeTab == 3 }"
                              @click="changeTab(3)">Stash</button>
                            <button type="button" class="btn btn-secondary" :class="{ active: activeTab == 4 }"
                              @click="changeTab(4)">Cube</button>
                            <button type="button" class="btn btn-secondary" :class="{ active: activeTab == 5 }"
                              @click="changeTab(5)">Mercenary</button>
                            <button type="button" class="btn btn-secondary" :class="{ active: activeTab == 6 }"
                              @click="changeTab(6)">All</button>
                          </div>
                          <div class="col-md-3">
                            <div class="float-right">
                              <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown"></button>
                              <div class="dropdown-menu dropdown-menu-right">
                                <div class="p-3 form-group">
                                  <div class="form-row">
                                    <div class="col-md-12">
                                      <label>Inventory</label>
                                      <div class="input-group">
                                        <input type="number" min="1" max="20" class="form-control" v-model.number="grid.inv.w"
                                          @input="gridChange">
                                        <div class="input-group-prepend input-group-append">
                                          <div class="input-group-text">,</div>
                                        </div>
                                        <input type="number" min="1" max="20" class="form-control" v-model.number="grid.inv.h"
                                          @input="gridChange">
                                      </div>
                                    </div>
                                  </div>
                                  <div class="form-row">
                                    <div class="col-md-12">
                                      <label>Stash</label>
                                      <div class="input-group">
                                        <input type="number" min="1" max="20" class="form-control" v-model.number="grid.stash.w"
                                          @input="gridChange">
                                        <div class="input-group-prepend input-group-append">
                                          <div class="input-group-text">,</div>
                                        </div>
                                        <input type="number" min="1" max="20" class="form-control" v-model.number="grid.stash.h"
                                          @input="gridChange">
                                      </div>
                                    </div>
                                  </div>
                                  <div class="form-row">
                                    <div class="col-md-12">
                                      <label>Cube</label>
                                      <div class="input-group">
                                        <input type="number" min="1" max="20" class="form-control" v-model.number="grid.cube.w"
                                          @input="gridChange">
                                        <div class="input-group-prepend input-group-append">
                                          <div class="input-group-text">,</div>
                                        </div>
                                        <input type="number" min="1" max="20" class="form-control" v-model.number="grid.cube.h"
                                          @input="gridChange">
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <button type="button" class="btn btn-primary" :disabled="!clipboard"
                                @click="paste()">Paste</button>
                              <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#LoadItem">Load
                                Item</button>
                            </div>
                          </div>
                        </div>
                        <Equipped v-if="activeTab == 1 || activeTab == 6" :items.sync="equipped" @item-selected="onSelect" @item-event="onEvent" :id="'Equipped'" :contextMenu="$refs.contextMenu">
                        </Equipped>
                        <Grid v-if="activeTab == 1 || activeTab == 6" :width="grid.inv.w" :height="grid.inv.h" :page="1"
                          :items.sync="inventory" @item-selected="onSelect" @item-event="onEvent" :id="'InventoryGrid'" :contextMenu="$refs.contextMenu"></Grid>
                        <Grid v-if="activeTab == 3 || activeTab == 6" :width="grid.stash.w" :height="grid.stash.h" :page="5"
                          :items.sync="stash" @item-selected="onSelect" @item-event="onEvent" :id="'StashGrid'" :contextMenu="$refs.contextMenu"></Grid>
                        <Grid v-if="activeTab == 4 || activeTab == 6" :width="grid.cube.w" :height="grid.cube.h" :page="4"
                          :items.sync="cube" @item-selected="onSelect" @item-event="onEvent" :id="'CubeGrid'" :contextMenu="$refs.contextMenu">
                        </Grid>
                        <Mercenary v-if="activeTab == 5 || activeTab == 6" :items.sync="mercenary" @item-selected="onSelect" :contextMenu="$refs.contextMenu">
                        </Mercenary>
                        <ItemEditor v-if="selected" :id="'Selected'" :item.sync="selected" :location="location" ref="editor" @item-event="onEvent"></ItemEditor>
                      </div>
                    </div>
                  </div>
                </fieldset>
                <div id="errors">
                </div>
                <br />
                <div v-if="save != null">
                  <button type="button" @click="unlockHell" class="btn btn-primary">Unlock Hell</button>
                  <button type="button" @click="unlockAllWPs" class="btn btn-primary">Unlock All WPs</button>
                  <button type="button" @click="setLvl99" class="btn btn-primary">Set Level 99</button>
                  <button type="button" @click="unlockAllQuests" class="btn btn-primary">Complete all Qs</button>
                  <button type="button" @click="unlockSkillStatQs" class="btn btn-secondary">Complete Skill/Stat Qs</button>
                  <button type="button" @click="maxGold" class="btn btn-primary">Max Gold</button>
                  <br /><br />
                  <button type="button" @click="setAllSkills20" class="btn btn-danger">Set All Skills 20</button>
                  <br /><br />
                  <button type="button" id="d2" class="btn btn-primary" @click="saveFile('vanilla', 0x60)">Save D2</button>
                  <button type="button" id="d2r" class="btn btn-primary" @click="saveFile('vanilla', 0x63)">Save D2R</button>
                  <button type="button" id="d2r" class="btn btn-primary" @click="saveFile('remodded', 0x63)">Save ReMoDDeD</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div v-if="theme == 'd2'" class="text-center mt-3">
      Credits to Dimka-DJZLO at <a href="https://discord.gg/NvfftHY">Phrozen Keep</a> for the theme!
    </div>
  </div>
</template>

<script>
  import Item from './inventory/Item.vue';
  import ContextMenu from "./ContextMenu.vue";
  import Stats from './Stats.vue';
  import Waypoints from './Waypoints.vue';
  import Quests from './Quests.vue';
  import Skills from './Skills.vue';
  import Equipped from './inventory/Equipped.vue';
  import Grid from './inventory/Grid.vue';
  import Mercenary from './Mercenary.vue';
  import ItemEditor from './inventory/ItemEditor.vue';

  import ItemPack from '../d2/ItemPack.js';
  import CharPack from '../d2/CharPack.js';
  import utils from '../utils.js';
  
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
      ContextMenu
    },
    data() {
      return {
        save: null,
        activeTab: 1,
        selected: null,
        itempack: ItemPack,
        item_options: [],
        previewModel: null,
        preview: null,
        clipboard: null,
        load: null,
        notifications: [],
        grid: { inv: { w: 10, h: 8 }, stash: { w: 16, h: 13 }, cube: { w: 16, h: 13 } },
        location: {},
        theme: localStorage.getItem('theme')
      };
    },
    async mounted() {
      if (window.palettes == undefined) {
        window.palettes = {};
        window.palettes["ACT1"] = [];
        let response = await fetch(`d2/game_data/remodded/version_99/global/palette/ACT1/pal.dat`);
        let buffer = new Uint8Array(await response.arrayBuffer());
        for (let i = 0; i < 256; i += 1) {
          window.palettes["ACT1"].push([buffer[i * 3 + 2], buffer[i * 3 + 1], buffer[i * 3]]);
        }
        for (const [k, v] of Object.entries(utils.colormaps)) {
          response = await fetch(v);
          buffer = new Uint8Array(await response.arrayBuffer());
          window.palettes[k] = [];
          for (let i = 0; i < Object.keys(utils.colors).length; i += 1) {
            window.palettes[k].push(buffer.slice(0 + (i * 256), 256 + (i * 256)));
          }
        }
      }
      if (localStorage.grid) {
        this.grid = JSON.parse(localStorage.getItem('grid'));
      }

      // Set the const data
      // d2s.setConstantData("vanilla", 96, window.vanilla_constants_96);
      // d2s.setConstantData("vanilla", 97, window.vanilla_constants_96);
      // d2s.setConstantData("vanilla", 98, window.vanilla_constants_96);
      // d2s.setConstantData("vanilla", 99, window.vanilla_constants_99);
      // d2s.setConstantData("remodded", 99, window.remodded_constants_99);

      // window.work_mod = "remodded";
      // window.work_version = 99;

      // Add all the base weapons & armors to the insertable items list
      this.addItemsPackBases("weapon_items", "Weapons");
      this.addItemsPackBases("armor_items", "Armors");
    },
    filters: {
    },
    computed: {
      equipped() {
        return this.save.items.filter(
          item => item.location_id === 1,
        );
      },
      inventory() {
        return this.save.items.filter(
          item => item.location_id === 0 && item.alt_position_id === 1,
        );
      },
      stash() {
        return this.save.items.filter(
          item => item.location_id === 0 && item.alt_position_id === 5,
        );
      },
      cube() {
        return this.save.items.filter(
          item => item.location_id === 0 && item.alt_position_id === 4,
        );
      },
      mercenary() {
        return this.save.merc_items || [];
      },
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
      optionClicked(event) {
        switch (event.option.text) {
          case "Delete":
            this.onEvent({
              type: 'delete',
              item: event.obj
            });
            break;
          case "Copy":
            this.onEvent({
              type: 'copy',
              item: event.obj
            });
            break;
          case "Share":
            this.onEvent({
              type: 'share',
              item: event.obj
            });
            break;
          case "Paste At":
            if(event.obj?.length !== 2 || this.clipboard == null) {
              break;
            }
            this.onEvent({
              type: 'pasteAt',
              item: this.clipboard,
              grid: event.obj
            });
            break;
          case "Select":
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
      updateLocation(val) {
        this.location = {
          location: val.location_id,
          equipped_location: val.equipped_id,
          x: val.position_x,
          y: val.position_y,
          storage_page: val.alt_position_id
        }
      },
      onSelect(e) {
        this.selected = e;
        this.updateLocation(this.selected);
      },
      findIndex(list, i) {
        return list.findIndex(item => 
          item.location_id == i.location_id
          && item.equipped_id == i.equipped_id
          && item.position_x == i.position_x
          && item.position_y == i.position_y
          && item.alt_position_id == i.alt_position_id
        );
      },
      deleteItem(list, idx) {
        list.splice(idx, 1);
        this.selected = null;
        this.location = null;
      },
      // Method to share an item (through clipboard). By default we share as a vanilla 99 item.
      async shareItem(item) {
        let bytes = await d2s.writeItem(item, window.work_mod, window.work_version);
        let base64 = utils.arrayBufferToBase64String(bytes);
        let hex = utils.arrayBufferToHexString(bytes);
        let sharedContent = {
          "mod": window.work_mod,
          "version": window.work_version,
          "base64": base64,
          "hex": hex
        };
        navigator.clipboard.writeText(JSON.stringify(sharedContent));
        this.notifications.push({ alert: "alert alert-info", message: `Item data copied to clipboard. Use load from string to share it with someone.` });
      },
      onEvent(e) {
        if(e.type == 'share') {
          this.shareItem(e.item);
        } else if(e.type == 'copy') {
          this.clipboard = JSON.parse(JSON.stringify(e.item));
        } else if(e.type == 'update') {
          d2s.enhanceItems([e.item], window.work_mod, window.work_version);
          this.setPropertiesOnItem(e.item);
        } else if(e.type == 'delete') {
          let idx = this.findIndex(this.save.items, e.item);
          if(idx != -1) {
            this.deleteItem(this.save.items, idx);
            return;
          }
          idx = this.findIndex(this.save.merc_items, e.item);
          if(idx != -1) {
            this.deleteItem(this.save.merc_items, idx);
            return;
          }
        } else if(e.type == 'move') {
          let element = document.getElementById(e.id);
          element.style.backgroundColor = ""; element.style.width = ""; element.style.height = "";
          if(window.uuid == e.uuid) {
            let idx = this.findIndex(this.save.items, e.item);
            this.onMove(this.save.items[idx], e);
          } else {
            //copy to another tab
            if(this.onMove(e.item, e)) {
              this.save.items.push(e.item);
            }
          }
        } else if(e.type == 'dragenter') {
          let item = e.item;
          if(this.canPlaceItem(item, e.location.storage_page, e.location.x, e.location.y)) {
            let element = document.getElementById(e.id);
            element.style.backgroundColor = "green"; element.style.width = `calc(var(--grid-size) * ${item.inv_width})`; element.style.height = `calc(var(--grid-size) * ${item.inv_height})`;
          }
        } else if(e.type == 'dragleave') {
          let element = document.getElementById(e.id);
          element.style.backgroundColor = ""; element.style.width = ""; element.style.height = "";
        }  else if(e.type === "pasteAt") {
          const location_id = this.activeTab === 1 ? 1 : 0; // Equipped
          const storage_page = this.activeTab === 1 ? 1 :  // Equipped
              this.activeTab === 3 ? 5 : // Stash
              this.activeTab === 4 ? 4 : // Cube
                  1; // Inventory
          if(this.canPlaceItem(e.item, storage_page, e.grid[0], e.grid[1])) {
            this.paste(e.item, [location_id, this.location?.equipped_location, e.grid[0], e.grid[1], storage_page]);

          } else {
            this.paste(e.item);
          }
        } 
      },
      onMove(item, e) {
        if(!this.canPlaceItem(item, e.location.storage_page, e.location.x, e.location.y)) {
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
          item.alt_position_id = e.location.storage_page;
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
        this.preview = await d2s.readItem(bytes, mod, version);
        await this.setPropertiesOnItem(this.preview);
        utils.removeMaxDurabilityFromRunwords(this.preview);
      },
      // Callback to read the input-select value and fill the preview thumbnail
      async previewItem(e) {
        if (this.previewModel) {
          let bytes = utils.b64StringToArrayBuffer(this.previewModel.base64);
          this.readItem(bytes, this.previewModel.mod, this.previewModel.version);
        }
      },
      // Method to load an item from its a JSON {mod, version, base64 or hex} or simply a base64 string (mod & version will be set to vanilla 99 by default).
      async loadFromString() {
        let input = prompt("Please enter a JSON with mod, version and base64 or hex.");
        try {
          let obj = JSON.parse(input);
          let bytes = null;
          if (!obj.mod || !obj.version) {
            throw new Error('No mod and version specified.')
          }
          if (obj.b64)
            bytes = utils.b64StringToArrayBuffer(obj.b64);
          else if (obj.hex) {
            bytes = utils.hexStringToArrayBuffer(obj.hex);
          }
          else {
            throw new Error('No item code in the input.')
          }
          await this.readItem(bytes, obj.mod, obj.version);
          this.paste(this.preview);
        } catch(e) {
          alert("Failed to load the item.");
        }
      },
      // Method to load a chosen item
      loadItem() {
        this.paste(this.preview);
      },
      paste(item, position) {
        let copy = JSON.parse(JSON.stringify(item != null ? item : this.clipboard));
        let pos = position ?? this.findSafeLocation(copy);
        copy.location_id = pos[0];
        copy.equipped_id = pos[1];
        copy.position_x = pos[2];
        copy.position_y = pos[3];
        copy.alt_position_id = pos[4];
        this.notifications = [];
        if (copy.location_id == 4) {
          this.notifications.push({ alert: "alert alert-warning", message: `Could not find safe location to place item. Placed in mouse buffer.` });
        } else {
          let loc = copy.alt_position_id == 1 ? 'inventory' : (copy.alt_position_id == 5 ? 'stash' : 'cube');
          this.notifications.push({ alert: "alert alert-info", message: `Loaded item in ${loc} at ${copy.position_x}, ${copy.position_y}` });
        }
        this.save.items.push(copy);
        this.selected = copy;
        this.updateLocation(this.selected);
      },
      findSafeLocation(item) {
        //inv = 1, cube = 4, stash = 5
        for (var i = 0; i < this.grid.inv.w; i++) {
          for (var j = 0; j < this.grid.inv.h; j++) {
            if (this.canPlaceItem(item, 1, i, j)) {
              return [0, 0, i, j, 1];
            }
          }
        }
        for (var i = 0; i < this.grid.stash.w; i++) {
          for (var j = 0; j < this.grid.stash.h; j++) {
            if (this.canPlaceItem(item, 5, i, j)) {
              return [0, 0, i, j, 5];
            }
          }
        }
        for (var i = 0; i < this.grid.cube.w; i++) {
          for (var j = 0; j < this.grid.cube.h; j++) {
            if (this.canPlaceItem(item, 4, i, j)) {
              return [0, 0, i, j, 4];
            }
          }
        }
        return [4, 0, 4, 0, 0];
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
        if ((x + item.inv_width) > bounds.w) {
          return false;
        }
        if ((y + item.inv_height) > bounds.h) {
          return false;
        }
        var rect = [x, y, x + item.inv_width, y + item.inv_height];
        let closeItems = this.save.items.filter(
          item => item.location_id === 0 && item.alt_position_id === loc,
        );
        for (var closeItem of closeItems) {
          var r = [closeItem.position_x, closeItem.position_y, closeItem.position_x + closeItem.inv_width, closeItem.position_y + closeItem.inv_height];
          if (this.contains(rect, r) || this.overlaps(rect, r)) {
            return false;
          }
        }
        return true;
      },
      contains(a, b) {
        return !(
          b[0] < a[0] ||
          b[1] < a[1] ||
          b[2] > a[2] ||
          b[3] > a[3]
        );
      },
      overlaps(a, b) {
        if (a[0] >= b[2] || b[0] >= a[2]) return false;
        if (a[1] >= b[3] || b[1] >= a[3]) return false;
        return true;
      },
      async setPropertiesOnSave() {
        let that = this;
        for (const item of [... this.save.items, ... this.save.merc_items, ... this.save.corpse_items, this.save.golem_item]) {
          await that.setPropertiesOnItem(item);
        }
      },
      async setPropertiesOnItem(item) {
        if (!item) {
          return;
        }
        if (!item.magic_attributes) item.magic_attributes = [];  
        item.src = await utils.getInventoryImageSrc(item);
        if (!item.socketed_items) {
          return;
        }
        item.socketed_attributes = [];
        for(let i = 0; i < item.socketed_items.length; i++) {
          item.socketed_items[i].src = await utils.getInventoryImageSrc(item.socketed_items[i]);
          item.socketed_items[i].magic_attributes.forEach((it, idx) => { if (item.socketed_attributes.findIndex(x => x.id == it.id) == -1) item.socketed_attributes.push(it) });
        }
      },
      newChar(index) {
        let char = CharPack[index];
        let bytes = utils.b64StringToArrayBuffer(char.base64);
        this.readBuffer(bytes, char.mod);
      },
      onFileLoad(event) {
        let mod = document.getElementById("open-mod").value;
        try {
          // If failed, in a 2nd time try parsing it as a remodded 99 file
          this.readBuffer(event.target.result, mod, event.target.filename);
        } catch (e) {
          alert("Failed to parse file.")
        }
      },
      readBuffer(bytes, mod, filename) {
        let that = this;
        this.save = null;
        this.selected = null;
        d2s.read(bytes, mod).then(response => {
          console.log("Attributes: " + JSON.stringify(response.attributes))
          that.save = response;
          if(filename) {
            that.save.header.name = filename.split('.')[0];
          }
          that.setPropertiesOnSave();
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
        this.save.attributes.gold = this.save.header.level * 10000;
        this.save.attributes.goldbank = 2500000
      },
      unlockAllQuests() {
        for (const diff of ["quests_normal", "quests_nm", "quests_hell"]) {
          this.completeQuest(diff, "act_i", "den_of_evil", ["newskills"], 1);
          this.completeQuest(diff, "act_i", "sisters_burial_grounds");
          this.completeQuest(diff, "act_i", "the_search_for_cain");
          this.completeQuest(diff, "act_i", "the_forgotten_tower");
          this.completeQuest(diff, "act_i", "tools_of_the_trade");
          this.completeQuest(diff, "act_i", "sisters_to_the_slaughter");

          this.completeQuest(diff, "act_ii", "radaments_lair", ["newskills"], 1);
          this.completeQuest(diff, "act_ii", "the_horadric_staff");
          this.completeQuest(diff, "act_ii", "tainted_sun");
          this.completeQuest(diff, "act_ii", "arcane_sanctuary");
          this.completeQuest(diff, "act_ii", "the_summoner");
          this.completeQuest(diff, "act_ii", "the_seven_tombs");

          
          this.completeQuest(diff, "act_iii", "the_golden_bird", ["maxhp", "hitpoints"], 20);
          this.completeQuest(diff, "act_iii", "blade_of_the_old_religion");
          this.completeQuest(diff, "act_iii", "khalims_will");
          this.completeQuest(diff, "act_iii", "lam_esens_tome", ["statpts"], 5);
          this.completeQuest(diff, "act_iii", "the_blackened_temple");
          this.completeQuest(diff, "act_iii", "the_guardian");

          this.completeQuest(diff, "act_iv", "the_fallen_angel", ["newskills"], 2);
          this.completeQuest(diff, "act_iv", "hellforge");
          this.completeQuest(diff, "act_iv", "terrors_end");

          this.completeQuest(diff, "act_v", "siege_on_harrogath");
          this.completeQuest(diff, "act_v", "rescue_on_mount_arreat");
          this.completeQuest(diff, "act_v", "prison_of_ice", null, null);
          this.completeQuest(diff, "act_v", "betrayal_of_harrogath");
          this.completeQuest(diff, "act_v", "rite_of_passage");
          this.completeQuest(diff, "act_v", "eve_of_destruction");
        }
      },
      completeQuest(difficulty, act, quest, attributes, amount) {
        if (this.save.header[difficulty][act][quest].b0_is_completed === false){
          this.save.header[difficulty][act][quest].b0_is_completed = true;
          if (quest === "prison_of_ice"){
            this.save.header[difficulty][act][quest].b7_custom3 = true; // Consumed scroll
          } else if (attributes) {
            for(let attribute of attributes) {
              this.save.attributes[attribute] = (this.save.attributes[attribute] ?? 0) + amount;
            }
          } else {
            // Simple quest without stat/skill rewards
          }
        }
      },
      unlockSkillStatQs() {
        for (const diff of ["quests_normal", "quests_nm", "quests_hell"]) {
          this.completeQuest(diff, "act_i", "den_of_evil", ["newskills"], 1);
          this.completeQuest(diff, "act_ii", "radaments_lair", ["newskills"], 1);
          this.completeQuest(diff, "act_iii", "lam_esens_tome", ["statpts"], 5);
          this.completeQuest(diff, "act_iii", "the_golden_bird", ["maxhp", "hitpoints"], 20);
          this.completeQuest(diff, "act_iv", "the_fallen_angel", ["newskills"], 2);
          this.completeQuest(diff, "act_v", "prison_of_ice", null, null);
        }
      },
      unlockHell() {
        for (var i of ["quests_normal", "quests_nm", "quests_hell"]) {
          for (var j of ["act_i", "act_ii", "act_iii", "act_iv", "act_v"]) {
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
        for (var i of ["normal", "nm", "hell"]) {
          this.save.header.waypoints[i].act_i.rogue_encampement = true;
          this.save.header.waypoints[i].act_ii.lut_gholein = true;
          this.save.header.waypoints[i].act_iii.kurast_docks = true;
          this.save.header.waypoints[i].act_iv.the_pandemonium_fortress = true;
          this.save.header.waypoints[i].act_v.harrogath = true;
        }
        this.save.header.progression = 15;
      },
      unlockAllWPs() {
        for (var i of ["normal", "nm", "hell"]) {
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
      setAllSkills20() {
        for (var s of this.save.skills) {
          s.points = 20;
        }
      },
      saveFile(mod, version) {
        let link = document.createElement('a');
        let that = this;
        link.style.display = 'none';
        document.body.appendChild(link);
        d2s.write(this.save, mod, version).then(function (response) {
          let blob = new Blob([response], { type: "octet/stream" });
          link.href = window.URL.createObjectURL(blob);
          link.download = that.save.header.name + '.d2s';
          link.click();
          link.remove();
        });
      },
      async addItemsPackBases(categoryKey, categoryDisplayName) {
        let newItems = [];
        const constants = window[`${window.work_mod}_constants_${window.work_version}`]
        for (const item of Object.entries(constants[categoryKey])) {
          if (item[1].n) {
            const newItem = Object();
            const value = item[1];
            newItem.type = item[0];
            newItem.quality = 2;
            newItem.level = 41;
            newItem.inv_width = value.iw;
            newItem.inv_height = value.ih;
            newItem.categories = value.c;
            newItem.identified = 1;
            if (newItem.categories.indexOf('Weapon') > -1) {
              newItem.base_damage = {
                'mindam': value.mind,
                'maxdam': value.maxd,
                'twohandmindam': value.min2d,
                'twohandmaxdam': value.max2d
              }
            }
            if (newItem.categories.indexOf('Any Armor') > -1) {
              newItem.defense_rating = value.maxac;
            }
            newItem.current_durability = value.durability;
            newItem.max_durability = value.durability;
            newItems.push(newItem);
          }
        }
        d2s.enhanceItems(newItems, window.work_mod, window.work_version);
        for (const item of newItems) {      
          let bytes = await d2s.writeItem(item, window.work_mod, window.work_version);
          let base64 = utils.arrayBufferToBase64String(bytes);
          let hex = utils.arrayBufferToHexString(bytes);
          let category = item.categories[0];
          this.itempack.push({
            key: "./Bases/"+ categoryDisplayName +"/" + category + "/" + item.type_name + '.d2i',
            value: {
              mod: window.work_mod,
              version: window.work_version,
              base64: base64,
              hex: hex
            }
          });
        }

        this.item_options = this.itempack.map(item => ({id: item.key, text: item.key, value: item.value}));
      },
    },
  };
</script>
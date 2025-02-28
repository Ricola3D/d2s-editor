<template>
  <div class="item-editor">
    <div class="form-row item-action-bar">
      <div class="col-md-12">
        <button type="button" class="btn btn-primary" @click="onEvent('export')">Export</button>
        <button type="button" class="btn btn-primary" @click="onEvent('copy')">Copy</button>
        <button type="button" class="btn btn-primary" @click="onEvent('cut')">Cut</button>
        <span v-if="item.location_id != 6">
          <button type="button" class="btn btn-danger" @click="onEvent('delete')">Delete</button>
        </span>
      </div>
    </div>

    <div class="form-row item-definition">
      <div>
        <!-- <Item v-model:item="item" clazz="item-edit" /> -->
        <Item :item="item" clazz="item-edit" @update:item="item = $event" @contextmenu.prevent.stop="itemRC($event, item)" />
      </div>

      <ul className="ItemOptions">
        <div class="settings">
          <!-- Id -->
          <label>Id</label>
          <input v-model.number="item.id" class="edit-box" type="number" min="0" @input="onEvent('update')" />

          <!-- Version -->
          <label>Version</label>
          <input v-model="item.version" class="edit-box" type="text" pattern="^\d{2,10}$" @change="onEvent('update')" />
          <!-- iLevel -->
          <label>Item Level</label>
          <input v-model.number="item.level" class="edit-box" type="number" min="1" max="99" @input="onEvent('update')" />
          <!-- Base -->
          <template v-if="!item.is_ear">
            <label>Base</label>
            <div>
              <multiselect
                v-model="item.type"
                :options="getBaseOptions()"
                :searchable="true"
                :can-deselect="false"
                :can-clear="false"
                :required="true"
                @update:model-value="onEvent('update')"
              />
            </div>
          </template>

          <!-- Class Specific -->
          <!-- <label>&#187;&#187;Class Specific</label>
          <label class="form-check-label"
            ><input v-model="item.class_specific" class="form-check-input" type="checkbox" @change="onEvent('update')"
          /></label> -->

          <template v-if="item.class_specific">
            <!-- Auto Affix ID -->
            <label>&#187;&#187; Staff Mod ID</label>
            <input v-model.number="item.auto_affix_id" class="edit-box" type="number" min="1" max="999" @input="onEvent('update')" />
          </template>

          <!-- Time & Timestamp -->
          <!-- <label>Timestamp</label>
          <input
              v-model="item.timestamp"
              class="edit-box"
              type="number"
              min="0"
              @input="onEvent('update')"
            />
          <label>Time</label>
          <input
              v-model.number="item.time"
              class="edit-box"
              type="number"
              min="0"
              @input="onEvent('update')"
            /> -->
          <template v-if="isStackable()">
            <label>Quantity</label>
            <input
              v-model.number="item.quantity"
              class="edit-box"
              type="number"
              min="1"
              :max="getMaxQuantity()"
              @input="onEvent('update')"
            />
          </template>

          <!-- Defense -->
          <template v-if="item.defense_rating">
            <label>&#187;&#187; Defense</label>
            <input
              v-model.number="item.defense_rating"
              class="edit-box"
              type="number"
              min="1"
              max="1000"
              disabled
              @input="onEvent('update')"
            />
          </template>

          <!-- Skin -->
          <template v-if="countSkinsChoices()">
            <label>Skin</label>
            <div>
              <multiselect
                v-model.number="item.picture_id"
                :options="
                  Array.from(Array(countSkinsChoices()).keys()).map((n) => ({
                    value: n,
                    label: skin_names[item.type] && skin_names[item.type][n] ? skin_names[item.type][n] : `${n}`,
                  }))
                "
                :searchable="true"
                :can-deselect="false"
                :can-clear="false"
                :required="true"
                @update:model-value="onEvent('update')"
              />
            </div>
          </template>

          <template v-if="!item.simple_item">
            <!-- Quality -->
            <label>Quality</label>
            <div>
              <multiselect
                v-model.number="item.quality"
                :class="getQualitySelectClass()"
                :options="rarities_options"
                :searchable="true"
                :can-deselect="false"
                :can-clear="false"
                :required="true"
                @update:model-value="onEvent('update')"
              />
            </div>

            <!-- Inferior, Normal, Superior -->
            <template v-if="item.quality <= 3">
              <label>Runeword</label>
              <div>
                <multiselect
                  v-model.number="item.runeword_id"
                  :options="runewords_options"
                  :searchable="true"
                  :can-deselect="false"
                  :can-clear="false"
                  :required="true"
                  @update:model-value="onEvent('update')"
                />
              </div>
            </template>

            <!-- Magic prefix & suffix -->
            <template v-if="item.quality == 4">
              <label>&#187;&#187; Prefix</label>
              <div>
                <multiselect
                  v-model.number="item.magic_prefix"
                  :options="magic_prefixes_options"
                  :searchable="true"
                  :can-deselect="false"
                  :can-clear="false"
                  :required="true"
                  @update:model-value="onEvent('update')"
                />
              </div>
              <label>&#187;&#187; Suffix</label>
              <div>
                <multiselect
                  v-model.number="item.magic_suffix"
                  :options="magic_suffixes_options"
                  :searchable="true"
                  :can-deselect="false"
                  :can-clear="false"
                  :required="true"
                  @update:model-value="onEvent('update')"
                />
              </div>
            </template>

            <!-- Rare or crafted -->
            <template v-if="item.quality == 6 || item.quality == 8">
              <label>&#187;&#187; Name 1</label>
              <div>
                <multiselect
                  v-model.number="item.rare_name_id"
                  :options="rare_names_options"
                  :searchable="true"
                  :can-deselect="false"
                  :can-clear="false"
                  :required="true"
                  @update:model-value="onEvent('update')"
                />
              </div>
              <label>&#187;&#187; Name 2</label>
              <div>
                <multiselect
                  v-model.number="item.rare_name_id2"
                  :options="rare_names_options"
                  :searchable="true"
                  :can-deselect="false"
                  :can-clear="false"
                  :required="true"
                  @update:model-value="onEvent('update')"
                />
              </div>
              <label>&#187;&#187; Prefix 1</label>
              <div>
                <multiselect
                  v-model.number="item.magical_name_ids[0]"
                  :options="magic_prefixes_options"
                  :searchable="true"
                  :can-deselect="false"
                  :can-clear="false"
                  :required="true"
                  @update:model-value="onEvent('update')"
                />
              </div>
              <label>&#187;&#187; Suffix 1</label>
              <div>
                <multiselect
                  v-model.number="item.magical_name_ids[1]"
                  :options="magic_suffixes_options"
                  :searchable="true"
                  :can-deselect="false"
                  :can-clear="false"
                  :required="true"
                  @update:model-value="onEvent('update')"
                />
              </div>
              <label>&#187;&#187; Prefix 2</label>
              <div>
                <multiselect
                  v-model.number="item.magical_name_ids[2]"
                  :options="magic_prefixes_options"
                  :searchable="true"
                  :can-deselect="false"
                  :can-clear="false"
                  :required="true"
                  @update:model-value="onEvent('update')"
                />
              </div>
              <label>&#187;&#187; Suffix 2</label>
              <div>
                <multiselect
                  v-model.number="item.magical_name_ids[3]"
                  :options="magic_suffixes_options"
                  :searchable="true"
                  :can-deselect="false"
                  :can-clear="false"
                  :required="true"
                  @update:model-value="onEvent('update')"
                />
              </div>
              <label>&#187;&#187; Prefix 3</label>
              <div>
                <multiselect
                  v-model.number="item.magical_name_ids[4]"
                  :options="magic_prefixes_options"
                  :searchable="true"
                  :can-deselect="false"
                  :can-clear="false"
                  :required="true"
                  @update:model-value="onEvent('update')"
                />
              </div>
              <label>&#187;&#187; Suffix 3</label>
              <div>
                <multiselect
                  v-model.number="item.magical_name_ids[5]"
                  :options="magic_suffixes_options"
                  :searchable="true"
                  :can-deselect="false"
                  :can-clear="false"
                  :required="true"
                  @update:model-value="onEvent('update')"
                />
              </div>
            </template>

            <!-- Set name -->
            <template v-if="item.quality == 5">
              <label>&#187;&#187; Set item ID</label>
              <multiselect
                v-model.number="item.set_id"
                :options="set_items_options"
                :searchable="true"
                :can-deselect="false"
                :can-clear="false"
                :required="true"
                @update:model-value="onEvent('update')"
              />
            </template>

            <!-- Unique name -->
            <template v-if="item.quality == 7">
              <label>&#187;&#187; Unique item ID</label>
              <multiselect
                v-model.number="item.unique_id"
                :options="unq_items_options"
                :searchable="true"
                :can-deselect="false"
                :can-clear="false"
                :required="true"
                @update:model-value="onEvent('update')"
              />
            </template>

            <!-- Other than runewords: personalized name -->
            <!-- <template v-if="!item.given_runeword"> -->
            <label>&#187;&#187; Personalized Name</label>
            <input
              v-model="item.personalized_name"
              class="edit-box"
              type="text"
              pattern="^[A-Za-z](?=.{0,14}$)[A-Za-z]*[A-Za-z\-_][A-Za-z]+$"
              @change="onEvent('update')"
            />
            <!-- </template> -->

            <!-- Ethereal -->
            <template v-if="item.type_id != 4">
              <!-- Misc can't be eth -->
              <label>Ethereal</label>
              <label class="form-check-label"
                ><input
                  v-model="item.ethereal"
                  class="form-check-input"
                  type="checkbox"
                  @change="onEvent('update')"
              /></label>
            </template>

            <template v-if="item.max_sockets">
              <!-- Sockets -->
              <label>Sockets</label>
              <input v-model.number="item.total_nr_of_sockets" class="edit-box" type="number" min="0" max="8" @input="onEvent('update')" />
            </template>
          </template>
        </div>
      </ul>
    </div>

    <div v-if="!item.simple_item" class="item-stats">
      <div v-if="item.magic_attributes" class="item-magic-stats">
        <div>Item Stats</div>
        <ItemStatsEditor :id="id + 'Magic'" v-model:item-stats="item.magic_attributes" @stat-change="onEvent('update')" />
      </div>
      <div v-if="item.given_runeword" class="item-runeword-stats">
        <div>Runeword Stats</div>
        <ItemStatsEditor :id="id + 'Runeword'" v-model:item-stats="item.runeword_attributes" @stat-change="onEvent('update')" />
      </div>
      <!-- <div v-if="item.quality == 5" class="item-set-stats"> -->
      <div v-for="(set_attribute, idx) in item.set_attributes">
        <div>Set Stats {{ idx }}</div>
        <ItemStatsEditor :id="id + 'Set' + idx" v-model:item-stats="item.set_attributes[idx]" @stat-change="onEvent('update')" />
      </div>
      <!-- </div> -->
      <div v-if="item.socketed_items.length" class="item-socketed-stats">
        <div>Sockets Stats</div>
        <div>
          <div v-for="(stat, idx) in item.displayed_socketed_attributes" :key="idx" class="blue" v-html="statDescription(stat)" />
        </div>
      </div>
      <div v-if="item.socketed_items.length" class="item-socketed-items">
        <button type="button" class="btn btn-danger" @click="unsocket()">Unsocket All</button>
        <div v-for="(socketed_item, idx) in item.socketed_items">
          <button type="button" class="btn btn-danger" @click="unsocket(idx)">Unsocket</button>
          <ItemEditor
            :id="id + 'Socketed' + idx"
            ref="itemEditor"
            v-model:item="item.socketed_items[idx]"
            :context-menu="contextMenu"
            :location="{ location: 6 }"
            @item-event="onChildEvent"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isEqual } from 'lodash';

import Item from './Item.vue';
import ItemStatsEditor from './ItemStatsEditor.vue';

export default {
  name: 'ItemEditor',
  components: {
    Item,
    ItemStatsEditor,
  },
  props: {
    id: String,
    item: Object,
    contextMenu: Object,
    // location: Object,
  },
  data() {
    return {
      rarities_options: [
        { value: 1, label: 'Low' },
        { value: 2, label: 'Normal' },
        { value: 3, label: 'Superior' },
        { value: 4, label: 'Magic' },
        { value: 5, label: 'Set' },
        { value: 6, label: 'Rare' },
        { value: 7, label: 'Unique' },
        { value: 8, label: 'Crafted' },
        { value: 9, label: 'Demon Tempered' },
      ],
      locations: [
        { key: 0, value: 'Stored' },
        { key: 1, value: 'Equipped' },
        { key: 4, value: 'Cursor' },
      ],
      equipped_locations: [
        { key: 1, value: 'Head' },
        { key: 2, value: 'Neck' },
        { key: 3, value: 'Torso' },
        { key: 4, value: 'Right Hand' },
        { key: 5, value: 'Left Hand' },
        { key: 6, value: 'Right Finger' },
        { key: 7, value: 'Left Finger' },
        { key: 8, value: 'Waist' },
        { key: 9, value: 'Boots' },
        { key: 10, value: 'Gloves' },
        { key: 11, value: 'Alternate Right Hand' },
        { key: 12, value: 'Alternate Left Hand' },
      ],
      storage_pages: [
        { key: 1, value: 'Inventory' },
        { key: 4, value: 'Cube' },
        { key: 5, value: 'Stash' },
      ],
      runewords_options: this.$getWorkConstantData()
        .runewords.fill({ id: 0, n: 'None' }, 0, 1)
        .filter((runeword) => runeword && runeword.n)
        .map((runeword) => ({
          value: runeword.id,
          label: `${runeword.id.toString().padStart(3, '0')} - ${runeword.n}`,
        })),
      magic_prefixes_options: this.$getWorkConstantData()
        .magic_prefixes.fill({ id: 0, n: 'None' }, 0, 1)
        //.filter((affix) => affix && affix.n) // In case some names are missing in the constants data
        .map((affix) => ({
          value: affix.id,
          label: `${affix.id.toString().padStart(3, '0')} - ${affix.n || '???'}`,
        })),
      magic_suffixes_options: this.$getWorkConstantData()
        .magic_suffixes.fill({ id: 0, n: 'None' }, 0, 1)
        .fill({ id: 0, n: 'None' }, 0, 1)
        //.filter((affix) => affix && affix.n) // In case some names are missing in the constants data
        .map((affix) => ({
          value: affix.id,
          label: `${affix.id.toString().padStart(3, '0')} - ${affix.n || '???'}`,
        })),
      rare_names_options: this.$getWorkConstantData()
        .rare_names.fill({ id: 0, n: 'None' }, 0, 1)
        //.filter((name) => name && name.n) // In case some names are missing in the constants data
        .map((name) => ({
          value: name.id,
          label: `${name.id.toString().padStart(3, '0')} - ${name.n || '???'}`,
        })),
      unq_items_options: this.$getWorkConstantData()
        .unq_items.filter((item) => !!item) // In case some unique ids are null "Evil Token"
        //.filter((item) => item.n) // In case some names are missing in the constants data
        .map((item) => ({
          value: item.id,
          label: `${item.id.toString().padStart(3, '0')} - ${item.n || '???'}`,
        })),
      set_items_options: this.$getWorkConstantData()
        .set_items //.filter((item) => item.n) // In case some names are missing in the constants data
        .map((item) => ({
          value: item.id,
          label: `${item.id.toString().padStart(3, '0')} - ${item.n || '???'}`,
        })),
      skin_names: {
        amu: ['Dot', 'Sun', 'Penta'],
        rin: ['Coral', 'Small Blue', 'Big Blue', 'Orange', 'Crown'],
        cm1: ['Brown', 'Bear-foot', 'M-skin'],
        cm2: ['Paw', 'Horn', 'Tower'],
        cm3: ['Eye', 'Spaghetti/DNA', 'Dragon/Monster'],
        m32: ['Brown', 'Bear-foot', 'M-skin'],
        m34: ['Eye', 'Spaghetti/DNA', 'Dragon/Monster'],
        m36: ['Brown', 'Bear-foot', 'M-skin'],
        jew: ['Pink', 'Blue', 'Orange', 'Green', 'Red', 'White'],
        D10: ['Paw', 'Horn', 'Tower'],
        D32: ['Brown', 'Bear-foot', 'M-skin'],
      },
    };
  },
  methods: {
    getQualitySelectClass() {
      return `quality-select quality-${this.item.quality}`;
    },
    statDescription(stat) {
      if (!stat.description || stat.visible === false) {
        return null;
      }
      const ds = stat.description.split('\\n');
      return ds
        .map((d) => {
          const s = d.replace(/\\(.*?);/gi, (result, match) => `</div><div class="${match}">`);
          return `<div>${s}</div>`;
        })
        .reverse()
        .join('');
    },
    itemRC($evt, item) {
      this.contextMenu.showContextMenu($evt, item, [{ text: 'Copy' }, { text: 'Export' }]);
    },
    getMaxQuantity() {
      if (this.isStackable()) {
        const constants = this.$getWorkConstantData();
        const itemType =
          constants.armor_items[this.item.type] || constants.weapon_items[this.item.type] || constants.other_items[this.item.type];
        return itemType.smax || 500;
      }
      return 1; // Just in case
    },
    unsocket(idx = -1) {
      if (idx < 0) {
        // Unsocket all
        this.item.nr_of_items_in_sockets = 0;
        this.$emit('item-event', { item: this.item, type: 'update' });
      } else {
        // Unsocket one
        this.item.nr_of_items_in_sockets--;
        this.item.socketed_items.splice(idx, 1);
        if (this.item.given_runeword) {
          this.item.given_runeword = false;
          this.item.runeword_id = 0;
          this.item.runeword_name = '';
          this.item.runeword_attributes = [];
        }
        this.$emit('item-event', { item: this.item, type: 'update' });
      }
    },
    onUpdate(variable, value) {
      const path = variable.split('.');
      path.shift(); // Should be "item"
      const edited = path.reduceRight(
        (accumulator, currentValue) => ({
          [currentValue]: accumulator,
        }),
        value,
      );
      const newItem = Object.assign(this.item, edited);
      this.$emit('item-event', { item: newItem, type: 'update' });
    },
    onEvent(type, variable, value) {
      this.$emit('item-event', { item: this.item, type: type });
    },
    onChildEvent(e) {
      this.$emit('item-event', { item: e.item, type: e.type });
    },
    // onMove() {
    //   this.$emit('item-event', { item: this.item, location: this.location, type: 'move' });
    // },
    isStackable() {
      const constants = this.$getWorkConstantData();
      return constants.stackables[this.item.type];
    },
    countSkinsChoices() {
      const constants = this.$getWorkConstantData();
      const details = this.$d2s.utils.getItemTypeDef(this.item, constants);
      if (this.item.unique_id) {
        if (details.ui) return 0;
        const unq = constants.unq_items[this.item.unique_id];
        if (unq) {
          if (unq.i) return 0;
          if (unq.hdi) return 0;
        }
      }
      if (this.item.set_id) {
        if (details.si) return 0;
        const set = constants.set_items[this.item.set_id];
        if (set) {
          if (set.i) return 0;
          if (set.hdi) return 0;
        }
      }
      const gfx_list = details.ig || details.hdig;
      return gfx_list ? gfx_list.length : 0;
    },
    findBasesInConstants(type_id, items) {
      let bases = [];
      const base = items[this.item.type];
      if (base) {
        if (
          this.item.quality == 5 || // set
          // this.item.quality == 6 || // rare
          this.item.quality == 7 /*||*/ // unique
          // this.item.quality == 8 // crafted
        ) {
          bases = [base.nc, base.exc, base.elc].filter((id) => items[id]);
          //items.filter(e => e[1].nc == code || e[1].exc == code || e[1].elc == code)
        } else {
          bases = Object.keys(items)
            .filter((id) => {
              const item = items[id];
              if (type_id == 0 && item.n != base.n) return false; // Undef
              if ((type_id == 1 || type_id == 2) && item.eq1n != base.eq1n) return false; // Armor & Shield
              //if (type_id == 3 && false) return false // Weapon
              if (type_id == 4 && isEqual(item.c, base.c)) return false; // Misc

              if (this.item.given_runeword == 1 && item.gemsockets < this.item.total_nr_of_sockets) {
                return false;
              }

              return true;
            })
            .sort((a, b) => items[a].level < items[b].level);
        }
        bases = Object.entries(items)
          .filter((entry) => bases.includes(entry[0]))
          .map((entry) => ({
            value: entry[0],
            label: /*"(" + entry[0] + ") " +*/ entry[1].n,
          }));
      }
      return bases;
    },
    getBaseOptions() {
      // let options
      const constants = this.$getWorkConstantData();

      // switch (this.item.type_id) {
      //   case 0: // Unknown
      //   default: // Out-of-bounds
      //     options = []
      //     break;
      //   case 1: // Armor
      //   case 2: // Shield
      //     break;
      //   case 3:
      //     break;
      //   case 4: // Other/misc
      //     const type = constants.other_items[this.item.type]
      //     options = Object.keys(constants.other_items) // Dictionary to array
      //       .filter(function(key) {
      //         if (!constants.other_items[key]) return false // Not null/undefined
      //         if (!constants.other_items[key].n) return false // Not nameless
      //         if (constants.other_items[key].n == "Reserved") return false // Not reserved
      //         if (type.c[0] != constants.other_items[key][0]) return false // Same category exist or not
      //         return true;
      //       }).map(key => ({
      //         value: key,
      //         label: /*"(" + key + ") " +*/ constants.other_items[key].n
      //       }))

      //     break;
      // }

      // return options

      let lookupBases = [];
      if (this.item.type_id == 1 || this.item.type_id == 2) lookupBases = constants.armor_items;
      else if (this.item.type_id == 3) lookupBases = constants.weapon_items;
      else if (this.item.type_id == 4) lookupBases = constants.other_items;

      let baseIds = [this.item.type]; // Min is self
      const currBase = lookupBases[this.item.type];
      if (currBase) {
        let currType = currBase.eq1n;
        if (currType == 'Any Armor' && currBase.c) {
          // In that case eq2n value has no meaning, and type comes from categories
          currType = currBase.c[0];
        }

        if (
          this.item.quality == 5 || // set
          this.item.quality == 7 /*||*/ // unique
          // this.item.quality == 8 // crafted
        ) {
          baseIds = [currBase.nc, currBase.exc, currBase.elc].filter((id) => lookupBases[id]);
          //items.filter(e => e[1].nc == code || e[1].exc == code || e[1].elc == code)
        } else {
          baseIds = Object.keys(lookupBases).filter((id) => {
            const testBase = lookupBases[id];

            if (this.item.type_id == 0 && testBase.n != currBase.n) return false; // Undef

            if (this.item.type_id == 1 || this.item.type_id == 2) {
              // Armor
              let testType = testBase.eq1n;
              if (testType == 'Any Armor' && testBase.c) {
                // For eq1n "Any Armor", eq2n is omitted
                // Type comes from categories
                testType = testBase.c[0];
              }
              if (currType != testType) return false; // Armor & Shield: eq1n are equal
            }

            //if (type_id == 3 && false) return false // Weapon: all

            if (this.item.type_id == 4 && !isEqual(testBase.c, currBase.c)) return false; // Misc: categories are equal

            if (
              this.item.type_id > 0 &&
              this.item.type_id < 4 &&
              this.item.given_runeword == 1 &&
              testBase.gemsockets < this.item.total_nr_of_sockets
            ) {
              return false; // Not enough sockets for the runeword
            }

            return true;
          });
          // .sort((a, b) => lookupBases[a].level < lookupBases[b].level)
        }
      }
      return baseIds.map((id) => ({
        value: id,
        label: `${lookupBases[id].n} (${id})`,
      }));

      // if (this.item.type_id == 3) {
      //   return this.findBasesInConstants(this.item.type_id, constants.weapon_items)
      // } else if (this.item.type_id == 1 || this.item.type_id == 2) {
      //   return this.findBasesInConstants(this.item.type_id, constants.armor_items)
      // } else if (this.item.type_id == 4) {
      //   return Object.entries(constants.other_items)
      //     .filter((entry) => entry[1].n)
      //     .map((entry) => ({ value: entry[0], label: /*"(" + entry[0] + ") " +*/ entry[1].n }))
      // } else {
      //   return []
      // }
    },
  },
};
</script>

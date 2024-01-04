<template>
  <div>
    <div class="form-row">
      <div class="col-md-12">
        <button type="button" class="btn btn-primary" @click="onEvent('share')">
          Share
        </button>
        <button type="button" class="btn btn-primary" @click="onEvent('copy')">
          Copy
        </button>
        <span v-if="item.location_id != 6">
          <button
            type="button"
            class="btn btn-danger"
            @click="onEvent('delete')"
          >
            Delete
          </button>
        </span>
      </div>
    </div>

    <div class="form-row">
      <div>
        <!-- <Item v-model:item="item" clazz="item-edit" /> -->
        <Item :item="item" clazz="item-edit" @update:item="item = $event" />
      </div>

      <ul className="ItemOptions">
        <div class="settings">
          <!-- Base -->
          <template v-if="!item.is_ear">
            <label>Base</label>
            <div>
              <multiselect
                v-model="item.type"
                :options="getBasesOptions(item.type)"
                :searchable="true"
                :can-deselect="false"
                :can-clear="false"
                :required="true"
                @update:model-value="onEvent('update')"
              />
            </div>
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

          <!-- iLevel -->
          <label>Item Level</label>
          <input
            v-model.number="item.level"
            class="edit-box"
            type="number"
            min="1"
            max="99"
            @input="onEvent('update')"
          />

          <!-- Skin -->
          <template v-if="countSkinsChoices()">
            <label>Skin</label>
            <div>
              <multiselect
                v-model.number="item.picture_id"
                :options="
                  Array.from(Array(countSkinsChoices()).keys()).map((n) => ({
                    value: n,
                    label: `${n}- ${skin_names[item.type][n] || ''}`,
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
                :options="rarities_options"
                :searchable="true"
                :can-deselect="false"
                :can-clear="false"
                :required="true"
                @update:model-value="onEvent('update')"
              />
            </div>

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

            <!-- Rare prefix & suffix -->
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

              <!-- <label>Personalized Name</label>
              <input class="edit-box" type="text" v-model="item.personalized_name" @change="onEvent('update')" pattern="^[A-Za-z]{0,15}$" maxlength="16"/> -->
            </template>

            <!-- Ethereal -->
            <label>Ethereal</label>
            <label class="form-check-label"
              ><input
                v-model.number="item.ethereal"
                class="form-check-input"
                type="checkbox"
                :true-value="1"
                :false-value="0"
                @change="onEvent('update')"
            /></label>

            <!-- Sockets -->
            <label>Sockets</label>
            <input
              v-model.number="item.total_nr_of_sockets"
              class="edit-box"
              type="number"
              min="0"
              max="8"
              @input="onEvent('update')"
            />
          </template>
        </div>
      </ul>
    </div>

    <span v-if="!item.simple_item">
      <div v-if="item.magic_attributes">
        <div>Item Stats</div>
        <ItemStatsEditor
          :id="id + 'Magic'"
          v-model:item-stats="item.magic_attributes"
          @stat-change="onEvent('update')"
        />
      </div>
      <div v-if="item.runeword_attributes">
        <div>Runeword Stats</div>
        <ItemStatsEditor
          :id="id + 'Runeword'"
          v-model:item-stats="item.runeword_attributes"
          @stat-change="onEvent('update')"
        />
      </div>
      <div v-if="item.set_attributes">
        <div v-for="(set_attribute, idx) in item.set_attributes">
          <div>Set Stats {{ idx }}</div>
          <ItemStatsEditor
            :id="id + 'Set' + idx"
            v-model:item-stats="item.set_attributes[idx]"
            @stat-change="onEvent('update')"
          />
        </div>
      </div>
      <div v-if="item.socketed_items">
        <div>Sockets Stats</div>
        <ItemStatsEditor
          :id="id + 'Socketed stats'"
          v-model:item-stats="item.socketed_attributes"
          @stat-change="onEvent('update')"
        />
      </div>
      <div v-if="item.socketed_items">
        <div v-for="(socketed_item, idx) in item.socketed_items">
          <ItemEditor
            :id="id + 'Socketed' + idx"
            ref="itemEditor"
            v-model:item="item.socketed_items[idx]"
            :location="{ location: 6 }"
            @item-event="onChildEvent"
          />
        </div>
      </div>
    </span>
  </div>
</template>

<script>
import Item from './Item.vue'
import ItemStatsEditor from './ItemStatsEditor.vue'
import utils from '../../utils.js'

export default {
  name: 'ItemEditor',
  components: {
    Item,
    ItemStatsEditor,
  },
  props: {
    id: String,
    item: Object,
    location: Object,
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
      magic_prefixes_options: window[
        `${window.work_mod}_constants_${window.work_version}`
      ].magic_prefixes
        .fill({ id: 0, n: 'None' }, 0, 1)
        .filter((affix) => affix && affix.n)
        .map((affix) => ({
          value: affix.id,
          label: `${affix.id.toString().padStart(3, '0')} - ${affix.n}`,
        })),
      magic_suffixes_options: window[
        `${window.work_mod}_constants_${window.work_version}`
      ].magic_suffixes
        .fill({ id: 0, n: 'None' }, 0, 1)
        .filter((affix) => affix && affix.n)
        .map((affix) => ({
          value: affix.id,
          label: `${affix.id.toString().padStart(3, '0')} - ${affix.n}`,
        })),
      rare_names_options: window[
        `${window.work_mod}_constants_${window.work_version}`
      ].rare_names
        .fill({ id: 0, n: 'None' }, 0, 1)
        .filter((name) => name && name.n)
        .map((name) => ({
          value: name.id,
          label: `${name.id.toString().padStart(3, '0')} - ${name.n}`,
        })),
      unq_items_options: window[
        `${window.work_mod}_constants_${window.work_version}`
      ].unq_items
        .filter((item) => item.n != null)
        .map((item) => ({
          value: item.id,
          label: `${item.id.toString().padStart(3, '0')} - ${item.n}`,
        })),
      set_items_options: window[
        `${window.work_mod}_constants_${window.work_version}`
      ].set_items
        .filter((item) => item.n != null)
        .map((item) => ({
          value: item.id,
          label: `${item.id.toString().padStart(3, '0')} - ${item.n}`,
        })),
      skin_names: {
        amu: ['Dot', 'Sun', 'Penta'],
        rin: ['Coral', 'Small Blue', 'Big Blue', 'Orange', 'Crown'],
        cm1: ['Brown', 'Bear-foot', 'M-skin'],
        cm2: ['Paw', 'Horn', 'Tower'],
        cm3: ['Eye', 'Spaghetti/DNA', 'Dragon/Monster'],
        jew: ['Pink', 'Blue', 'Orange', 'Green', 'Red', 'White'],
      },
    }
  },
  methods: {
    onUpdate(variable, value) {
      const path = variable.split('.')
      path.shift() // Should be "item"
      const edited = path.reduceRight(
        (accumulator, currentValue) => ({
          [currentValue]: accumulator,
        }),
        value
      )
      const newItem = Object.assign(this.item, edited)
      this.$emit('item-event', { item: newItem, type: 'update' })
    },
    onEvent(type, variable, value) {
      this.$emit('item-event', { item: this.item, type: type })
    },
    onChildEvent(e) {
      this.$emit('item-event', { item: e.item, type: e.type })
    },
    // onMove() {
    //   this.$emit('item-event', { item: this.item, location: this.location, type: 'move' });
    // },
    countSkinsChoices() {
      const constants =
        window[`${window.work_mod}_constants_${window.work_version}`]
      const details = utils.getItemDetails(this.item)
      if (this.item.unique_id) {
        if (details.ui) return 0
        const unq = constants.unq_items[this.item.unique_id]
        if (unq) {
          if (unq.i) return 0
          if (unq.hdi) return 0
        }
      }
      if (this.item.set_id) {
        if (details.si) return 0
        const set = constants.set_items[this.item.set_id]
        if (set) {
          if (set.i) return 0
          if (set.hdi) return 0
        }
      }
      const gfx_list = details.ig || details.hdig
      return gfx_list ? gfx_list.length : 0
    },
    findBasesInConstants(code, items) {
      let bases = []
      const base = items[code]
      if (base) {
        //NORMAL SET UNIQUE CRAFTED
        if (
          this.item.quality == 5 ||
          this.item.quality == 6 ||
          this.item.quality == 7 ||
          this.item.quality == 8
        ) {
          bases = [base.nc, base.exc, base.elc].filter((id) => items[id])
          //items.filter(e => e[1].nc == code || e[1].exc == code || e[1].elc == code)
        } else {
          bases = Object.keys(items)
            .filter((id) => {
              const item = items[id]
              if (
                this.item.given_runeword == 1 &&
                item.gemsockets < this.item.total_nr_of_sockets
              )
                return false
              if (base.c.length > 2) return item.eq1n == base.eq1n
              else return item.type === base.type
            })
            .sort((a, b) => items[a].level < items[b].level)
        }
        bases = Object.entries(items)
          .filter((entry) => bases.includes(entry[0]))
          .map((entry) => ({ value: entry[0], label: entry[1].n }))
      }
      return bases
    },
    getBasesOptions(code) {
      const constants =
        window[`${window.work_mod}_constants_${window.work_version}`]
      if (this.item.type_id == 3) {
        return this.findBasesInConstants(code, constants.weapon_items)
      } else if (this.item.type_id == 1) {
        return this.findBasesInConstants(code, constants.armor_items)
      } else if (this.item.type_id == 4) {
        return Object.entries(constants.other_items)
          .filter((entry) => entry[1].n)
          .map((entry) => ({ value: entry[0], label: entry[1].n }))
      } else {
        return []
      }
    },
  },
}
</script>

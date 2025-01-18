<template>
  <div class="inventory">
    <span class="head" @drop="drop($event, 1)" @dragover="dragover" @dragenter="dragenter($event, 1)" @dragleave="dragleave($event, 1)"
      ><div :id="id + '-1'" class="layer" />
      <Item v-if="head" v-model:item="head" @click.native="onSelect(head)" @contextmenu.prevent.stop="itemRC($event, head)"
    /></span>
    <span class="neck" @drop="drop($event, 2)" @dragover="dragover" @dragenter="dragenter($event, 2)" @dragleave="dragleave($event, 2)"
      ><div :id="id + '-2'" class="layer" />
      <Item v-if="neck" v-model:item="neck" @click.native="onSelect(neck)" @contextmenu.prevent.stop="itemRC($event, neck)"
    /></span>
    <span class="torso" @drop="drop($event, 3)" @dragover="dragover" @dragenter="dragenter($event, 3)" @dragleave="dragleave($event, 3)"
      ><div :id="id + '-3'" class="layer" />
      <Item v-if="torso" v-model:item="torso" @click.native="onSelect(torso)" @contextmenu.prevent.stop="itemRC($event, torso)"
    /></span>
    <span class="right-tab tabs">
      <div class="btn-group" role="group">
        <button type="button" class="tab btn btn-secondary" :class="{ active: !alt_displayed }" @click="setAltDisplayed(false)">I</button>
        <button type="button" class="tab btn btn-secondary" :class="{ active: alt_displayed }" @click="setAltDisplayed(true)">II</button>
      </div>
    </span>
    <span
      v-show="!alt_displayed"
      class="right-hand weapon"
      @drop="drop($event, 4)"
      @dragover="dragover"
      @dragenter="dragenter($event, 4)"
      @dragleave="dragleave($event, 4)"
      ><div :id="id + '-4'" class="layer" />
      <Item
        v-if="right_hand"
        v-model:item="right_hand"
        @click.native="onSelect(right_hand)"
        @contextmenu.prevent.stop="itemRC($event, right_hand)"
      />
    </span>
    <span
      v-show="alt_displayed"
      class="alt-right-hand weapon"
      @drop="drop($event, 11)"
      @dragover="dragover"
      @dragenter="dragenter($event, 11)"
      @dragleave="dragleave($event, 11)"
      ><div :id="id + '-11'" class="layer" />
      <Item
        v-if="alt_right_hand"
        v-model:item="alt_right_hand"
        @click.native="onSelect(alt_right_hand)"
        @contextmenu.prevent.stop="itemRC($event, alt_right_hand)"
      />
    </span>
    <span class="left-tab tabs">
      <div class="btn-group" role="group">
        <button type="button" class="tab btn btn-secondary" :class="{ active: !alt_displayed }" @click="setAltDisplayed(false)">I</button>
        <button type="button" class="tab btn btn-secondary" :class="{ active: alt_displayed }" @click="setAltDisplayed(true)">II</button>
      </div>
    </span>
    <span
      v-show="!alt_displayed"
      class="left-hand weapon"
      @drop="drop($event, 5)"
      @dragover="dragover"
      @dragenter="dragenter($event, 5)"
      @dragleave="dragleave($event, 5)"
      ><div :id="id + '-5'" class="layer" />
      <Item
        v-if="left_hand"
        v-model:item="left_hand"
        @click.native="onSelect(left_hand)"
        @contextmenu.prevent.stop="itemRC($event, left_hand)"
      />
    </span>
    <span
      v-show="alt_displayed"
      class="alt-left-hand weapon"
      @drop="drop($event, 12)"
      @dragover="dragover"
      @dragenter="dragenter($event, 12)"
      @dragleave="dragleave($event, 12)"
      ><div :id="id + '-12'" class="layer" />
      <Item
        v-if="alt_left_hand"
        v-model:item="alt_left_hand"
        @click.native="onSelect(alt_left_hand)"
        @contextmenu.prevent.stop="itemRC($event, alt_left_hand)"
      />
    </span>
    <span
      class="right-finger ring"
      @drop="drop($event, 6)"
      @dragover="dragover"
      @dragenter="dragenter($event, 6)"
      @dragleave="dragleave($event, 6)"
      ><div :id="id + '-6'" class="layer" />
      <Item
        v-if="right_finger"
        v-model:item="right_finger"
        @click.native="onSelect(right_finger)"
        @contextmenu.prevent.stop="itemRC($event, right_finger)"
    /></span>
    <span
      class="left-finger ring"
      @drop="drop($event, 7)"
      @dragover="dragover"
      @dragenter="dragenter($event, 7)"
      @dragleave="dragleave($event, 7)"
      ><div :id="id + '-7'" class="layer" />
      <Item
        v-if="left_finger"
        v-model:item="left_finger"
        @click.native="onSelect(left_finger)"
        @contextmenu.prevent.stop="itemRC($event, left_finger)"
    /></span>
    <span class="waist" @drop="drop($event, 8)" @dragover="dragover" @dragenter="dragenter($event, 8)" @dragleave="dragleave($event, 8)"
      ><div :id="id + '-8'" class="layer" />
      <Item v-if="waist" v-model:item="waist" @click.native="onSelect(waist)" @contextmenu.prevent.stop="itemRC($event, waist)"
    /></span>
    <span class="feet" @drop="drop($event, 9)" @dragover="dragover" @dragenter="dragenter($event, 9)" @dragleave="dragleave($event, 9)"
      ><div :id="id + '-9'" class="layer" />
      <Item v-if="feet" v-model:item="feet" @click.native="onSelect(feet)" @contextmenu.prevent.stop="itemRC($event, feet)"
    /></span>
    <span
      class="hands"
      @drop="drop($event, 10)"
      @dragover="dragover"
      @dragenter="dragenter($event, 10)"
      @dragleave="dragleave($event, 10)"
      @contextmenu.prevent.stop="equippedRC($event, EEquippedId.Gloves)"
      ><div :id="id + '-10'" class="layer" />
      <Item v-if="hands" v-model:item="hands" @click.native="onSelect(hands)" @contextmenu.prevent.stop="itemRC($event, hands)"
    /></span>
  </div>
</template>

<script>
import Item from './Item.vue';
export default {
  name: 'CharEquipement',
  components: {
    Item,
  },
  props: {
    items: Array,
    id: String,
    contextMenu: Object,
  },
  data() {
    return {
      alt_displayed: false,
      EEquippedId: this.$d2s.types.EEquippedId,
    };
  },
  computed: {
    head() {
      return this.items.find((e) => e.equipped_id === 1);
    },
    neck() {
      return this.items.find((e) => e.equipped_id === 2);
    },
    torso() {
      return this.items.find((e) => e.equipped_id === 3);
    },
    right_hand() {
      return this.items.find((e) => e.equipped_id === 4);
    },
    left_hand() {
      return this.items.find((e) => e.equipped_id === 5);
    },
    right_finger() {
      return this.items.find((e) => e.equipped_id === 6);
    },
    left_finger() {
      return this.items.find((e) => e.equipped_id === 7);
    },
    waist() {
      return this.items.find((e) => e.equipped_id === 8);
    },
    feet() {
      return this.items.find((e) => e.equipped_id === 9);
    },
    hands() {
      return this.items.find((e) => e.equipped_id === 10);
    },
    alt_right_hand() {
      return this.items.find((e) => e.equipped_id === 11);
    },
    alt_left_hand() {
      return this.items.find((e) => e.equipped_id === 12);
    },
  },
  methods: {
    setAltDisplayed(value) {
      this.alt_displayed = value;
    },
    onSelect(item) {
      this.$emit('item-selected', item);
    },
    itemRC($evt, item) {
      if (item != null) {
        this.contextMenu.showContextMenu($evt, item, [
          { text: 'Select' },
          { text: 'Copy' },
          { text: 'Cut' },
          { text: 'Export' },
          { text: 'Delete' },
        ]);
      }
    },
    equippedRC($evt, equipped_id) {
      // this.contextMenu.showContextMenu(
      //   $evt,
      //   {
      //     owner: 'character',
      //     location_id: 1, // Equipped
      //     equipped_id: equipped_id, // 0: stored, 1: helm, 2: amulet, 3: armor, 4: right-hand, 5: left-hand, 6: right ring, 7: left ring, 8: belt, 9: boots, 10: gloves, 11: right-hand switch, 12: left-hand switch
      //     position_x: 0,
      //     position_y: 0,
      //     alt_position_id: 0,
      //   },
      //   [{ text: 'Paste At' }, { text: 'Import At' }]
      // )
    },
    dragover(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      return false;
    },
    dragenter(event, equipped_location) {
      event.preventDefault();
      let data = JSON.parse(localStorage.getItem('dragElement'));
      this.$emit('item-event', {
        uuid: data.uuid,
        item: data.item,
        id: `${this.id}-${equipped_location}`,
        location: {
          location: 1,
          equipped_location: equipped_location,
        },
        type: 'dragenter',
      });
    },
    dragleave(event, equipped_location) {
      event.preventDefault();
      let data = JSON.parse(localStorage.getItem('dragElement'));
      this.$emit('item-event', {
        uuid: data.uuid,
        item: data.item,
        id: `${this.id}-${equipped_location}`,
        location: {
          location: 1,
          equipped_location: equipped_location,
        },
        type: 'dragleave',
      });
    },
    drop(event, equipped_location) {
      event.preventDefault();
      let data = JSON.parse(localStorage.getItem('dragElement'));
      this.$emit('item-event', {
        uuid: data.uuid,
        item: data.item,
        id: `${this.id}-${equipped_location}`,
        location: {
          location: 1,
          equipped_location: equipped_location,
        },
        type: 'move',
      });
    },
  },
};
</script>

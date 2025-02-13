<template>
  <div class="inventory">
    <span class="head">
      <Item v-if="head" v-model:item="head" @click.native="onSelect(head)" @contextmenu.prevent.stop="itemRC($event, head)"
    /></span>
    <span class="neck">
      <Item v-if="neck" v-model:item="neck" @click.native="onSelect(neck)" @contextmenu.prevent.stop="itemRC($event, neck)"
    /></span>
    <span class="torso">
      <Item v-if="torso" v-model:item="torso" @click.native="onSelect(torso)" @contextmenu.prevent.stop="itemRC($event, torso)"
    /></span>
    <span class="right-hand weapon">
      <Item
        v-if="right_hand"
        v-model:item="right_hand"
        @click.native="onSelect(right_hand)"
        @contextmenu.prevent.stop="itemRC($event, right_hand)"
    /></span>
    <span class="left-hand weapon">
      <Item
        v-if="left_hand"
        v-model:item="left_hand"
        @click.native="onSelect(left_hand)"
        @contextmenu.prevent.stop="itemRC($event, left_hand)"
    /></span>
    <span class="right-finger ring">
      <Item
        v-if="right_finger"
        v-model:item="right_finger"
        @click.native="onSelect(right_finger)"
        @contextmenu.prevent.stop="itemRC($event, right_finger)"
    /></span>
    <span class="left-finger ring">
      <Item
        v-if="left_finger"
        v-model:item="left_finger"
        @click.native="onSelect(left_finger)"
        @contextmenu.prevent.stop="itemRC($event, left_finger)"
    /></span>
    <span class="waist">
      <Item v-if="waist" v-model:item="waist" @click.native="onSelect(waist)" @contextmenu.prevent.stop="itemRC($event, waist)"
    /></span>
    <span class="feet">
      <Item v-if="feet" v-model:item="feet" @click.native="onSelect(feet)" @contextmenu.prevent.stop="itemRC($event, feet)"
    /></span>
    <span class="hands">
      <Item v-if="hands" v-model:item="hands" @click.native="onSelect(hands)" @contextmenu.prevent.stop="itemRC($event, hands)"
    /></span>
  </div>
</template>

<script>
import Item from './inventory/Item.vue';

export default {
  name: 'MercenaryEquipement',
  components: {
    Item,
  },
  props: {
    items: Array,
    contextMenu: Object,
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
    // equippedRC($evt, equipped_id) {
    //   this.contextMenu.showContextMenu(
    //     $evt,
    //     {
    //       owner: 'mercenary',
    //       location_id: 1, // Equipped
    //       equipped_id: equipped_id, // 0: stored, 1: helm, 2: amulet, 3: armor, 4: right-hand, 5: left-hand, 6: right ring, 7: left ring, 8: belt, 9: boots, 10: gloves, 11: right-hand switch, 12: left-hand switch
    //       position_x: 0,
    //       position_y: 0,
    //       alt_position_id: 0,
    //     },
    //     [{ text: 'Paste At' }, { text: 'Import At' }],
    //   );
    // },
  },
};
</script>

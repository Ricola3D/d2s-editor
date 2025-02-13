<template>
  <div id="grid" class="grid" :class="gridClass">
    <div v-for="h in height" class="h-1 cell" :class="'y-' + (h - 1)">
      <div
        v-for="w in width"
        :id="id + '-' + w + '-' + h"
        class="w-1 h-1 y-0 cell"
        :class="'x-' + (w - 1)"
        @drop="drop($event, w, h)"
        @dragover="dragover"
        @dragenter="dragenter($event, w, h)"
        @dragleave="dragleave($event, w, h)"
        @contextmenu.prevent.stop="gridRC($event, w, h)"
      />
    </div>
    <Item
      v-for="(item, idx) in items"
      :key="idx"
      v-model:item="items[idx]"
      @click.native="onSelect(item)"
      @contextmenu.prevent.stop="itemRC($event, item)"
    />
  </div>
</template>

<script>
import Item from './Item.vue';

export default {
  name: 'GridView',
  components: {
    Item,
  },
  props: {
    items: Array,
    width: Number,
    height: Number,
    alt_position_id: Number,
    id: String,
    contextMenu: Object,
  },
  computed: {
    gridClass() {
      return `w-${this.width} h-${this.height}`;
    },
  },
  methods: {
    onSelect(item) {
      this.$emit('item-selected', item);
    },
    dragover(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      return false;
    },
    dragenter(event, x, y) {
      event.preventDefault();
      let data = JSON.parse(localStorage.getItem('dragElement'));
      this.$emit('item-event', {
        uuid: data.uuid,
        item: data.item,
        id: `${this.id}-${x}-${y}`,
        location: {
          location: 0,
          x: x - 1,
          y: y - 1,
          alt_position_id: this.alt_position_id,
        },
        type: 'dragenter',
      });
    },
    dragleave(event, x, y) {
      event.preventDefault();
      let data = JSON.parse(localStorage.getItem('dragElement'));
      this.$emit('item-event', {
        uuid: data.uuid,
        item: data.item,
        id: `${this.id}-${x}-${y}`,
        location: {
          location: 0,
          x: x - 1,
          y: y - 1,
          alt_position_id: this.alt_position_id,
        },
        type: 'dragleave',
      });
    },
    itemRC($evt, item) {
      this.contextMenu.showContextMenu($evt, item, [
        { text: 'Select' },
        { text: 'Copy' },
        { text: 'Cut' },
        { text: 'Export' },
        { text: 'Delete' },
      ]);
    },
    async gridRC($evt, w, h) {
      this.contextMenu.showContextMenu(
        $evt,
        {
          owner: 'character',
          location_id: 0, // Stored
          equipped_id: 0, // Stored
          position_x: w - 1,
          position_y: h - 1,
          alt_position_id: this.alt_position_id, // 1: inventory, 4: cube, 5: stash
        },
        [{ text: 'Paste At', disabled: !this.$clipboard.value }, { text: 'Import At' }],
      );
    },
    drop(event, x, y) {
      event.preventDefault();
      let data = JSON.parse(localStorage.getItem('dragElement'));
      this.$emit('item-event', {
        uuid: data.uuid,
        item: data.item,
        id: `${this.id}-${x}-${y}`,
        location: {
          location: 0,
          x: x - 1,
          y: y - 1,
          alt_position_id: this.alt_position_id,
        },
        type: 'move',
      });
    },
  },
};
</script>

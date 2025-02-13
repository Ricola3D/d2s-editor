<template>
  <div
    class="dropdown-menu"
    role="menu"
    :class="options != null ? 'show' : ''"
    :style="{ top: evt.clientY + 'px', left: evt.clientX + 'px' }"
  >
    <button
      v-for="(option, i) in options"
      :key="i"
      class="dropdown-item"
      :class="[option.type === 'divider' ? 'dropdown-divider' : '']"
      :disabled="!!option.disabled"
      @click.stop="onClick($event, option)"
      v-html="option.text"
    />
  </div>
</template>

<script>
export default {
  name: 'ContextMenu',
  data: function () {
    return {
      options: null,
      evt: {},
    };
  },
  methods: {
    showContextMenu($event, obj, options) {
      this.options = options;
      this.obj = obj;
      this.evt = {
        clientX: $event.clientX,
        clientY: $event.clientY + document.documentElement.scrollTop,
      };
    },
    onClick($event, option) {
      $event.preventDefault();
      this.$emit('option-clicked', {
        obj: this.obj,
        option: option,
      });
    },
    close() {
      this.options = null;
    },
  },
};
</script>

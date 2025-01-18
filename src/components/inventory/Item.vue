<template>
  <div>
    <div ref="itemRef" tabindex="0" :class="itemClass" @dragstart="dragStart">
      <div :class="innerClass">
        <img v-if="item.src" :src="item.src" :class="{ ethereal: item.ethereal }" />
        <img v-else src="/img/loading.gif" class="loading" />
        <div v-if="item.total_nr_of_sockets && tooltipShown" class="sockets" @dragstart="dragStart">
          <div
            v-for="idx in item.total_nr_of_sockets"
            :key="idx"
            :style="socketStyle(idx)"
            class="socket"
            :class="{
              'empty-socket': !item.socketed_items || !item.socketed_items[idx - 1],
            }"
            @dragstart="dragStart"
          >
            <template v-if="item.socketed_items && item.socketed_items[idx - 1]">
              <img
                v-if="item.socketed_items[idx - 1].src"
                :src="item.socketed_items[idx - 1].src"
                title="To drag&drop, first click once to hide sockets and tooltip"
              />
              <img v-else src="/img/loading.gif" class="loading" />
            </template>
          </div>
        </div>
      </div>
    </div>
    <div ref="tooltipRef">
      <div :class="itemNameClass(item)" v-html="itemName(item)" />
      <div v-if="item.defense_rating">Defense: {{ item.defense_rating }}</div>
      <div v-if="item.base_damage">
        <div v-if="item.base_damage.mindam && item.base_damage.maxdam">
          One Hand Damage: {{ item.base_damage.mindam }}-{{ item.base_damage.maxdam }}
        </div>
        <div v-if="item.base_damage.twohandmindam && item.base_damage.twohandmaxdam">
          Two Hand Damage: {{ item.base_damage.twohandmindam }}-{{ item.base_damage.twohandmaxdam }}
        </div>
      </div>
      <div v-if="item.max_durability">
        Durability: {{ item.current_durability }} of
        {{ item.max_durability }}
      </div>
      <div>
        <div v-for="(stat, idx) in item.displayed_combined_magic_attributes" :key="idx" class="blue" v-html="statDescription(stat)" />
      </div>
      <div v-if="item.ethereal" class="blue">Ethereal</div>
      <div v-if="item.total_nr_of_sockets" class="blue">Socketed ({{ item.total_nr_of_sockets }})</div>
    </div>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core';
import tippy from 'tippy.js';

export default {
  name: 'ItemView',
  props: {
    item: Object,
    clazz: String,
  },
  data() {
    return {
      tooltipShown: false,
      tooltip: null,
    };
  },
  computed: {
    itemClass() {
      let clazz = `${this.clazz ? this.clazz : 'item'} w-${this.item.inv_width} h-${this.item.inv_height}`;
      if (this.item.location_id !== 1 && !this.clazz) {
        clazz += ` x-${this.item.position_x} y-${this.item.position_y}`;
      }
      return clazz;
    },
    innerClass() {
      let clazz = `${this.clazz ? this.clazz : 'inner'} w-${this.item.inv_width} h-${this.item.inv_height}`;
      return clazz;
    },
  },
  async mounted() {
    this.createPopper();
  },
  unmounted() {
    if (this.tooltip) {
      this.tooltip.destroy();
    }
  },
  methods: {
    socketStyle(idx) {
      const cellSize = 32;
      const countX = Math.max(1, Math.ceil(this.item.total_nr_of_sockets / this.item.inv_height)); // Number of columns
      const countY = Math.ceil(this.item.total_nr_of_sockets / countX); // Number of lines
      let i = 0; // Horizontal socket index (0-indexed)
      let j = 0; // Vertical socket index (0-indexed)
      if (this.item.total_nr_of_sockets == 5) {
        // Exception, draw like the 5 of a dice
        if (idx < 3) {
          i = (idx - 1) % countX;
          j = Math.floor((idx - 1) / countX);
        } else if (idx == 3) {
          i = (countX - 1) / 2;
          j = (countY - 1) / 2;
        } else {
          i = idx % countX;
          j = Math.floor(idx / countX);
        }
      } else {
        // Columns & rows
        i = (idx - 1) % countX;
        j = Math.floor((idx - 1) / countX);

        // Special case when the last row is incomplete
        if (countX > 1 && this.item.total_nr_of_sockets % countX) {
          if (idx > countX * (countY - 1)) {
            // Center the last row
            let lineCount = this.item.total_nr_of_sockets % countX; // Number of sockets in this lane
            i += (countX - lineCount) / 2;
          }
        }
      }
      // Special case with a small offset because item height is superior to countX
      if (this.item.inv_height > countY && countY > 1) {
        if (j == 0) j = 0.1;
        else if (j == countY - 1) j = countY - 1.1;
      }
      return {
        transform: `translateX(${cellSize * (((i + 0.5) * this.item.inv_width) / countX - 0.5)}px) translateY(${
          cellSize * (((j + 0.5) * this.item.inv_height) / countY - 0.5)
        }px)`,
        top: `0`,
        left: `0`,
      };
    },
    itemName(item) {
      let name = '(' + item.type + ') ' + item.type_name;
      const constants = this.$getWorkConstantData();
      /* Inferior <type_name> */
      if (item.quality === this.$d2s.types.EQuality.Inferior) {
        name = `Inferior ${name}`;
      }
      /* Superior <type_name> */
      if (item.quality === this.$d2s.types.EQuality.Superior) {
        name = `Superior ${name}`;
      }
      /* <Prefix>(<pId>) <type_name> <suffix>(<sId>)
        <type_name>*/
      if (item.quality === this.$d2s.types.EQuality.Magic && item.magic_prefix) {
        let magic_prefix_name = constants.magic_prefixes[item.magic_prefix] ? constants.magic_prefixes[item.magic_prefix].n : null;
        if (!magic_prefix_name) {
          magic_prefix_name = 'unknown';
        }
        name = `${name}\\n${magic_prefix_name}(${item.magic_prefix}) ${name}`;
      }
      if (item.quality === this.$d2s.types.EQuality.Magic && item.magic_suffix) {
        let magic_suffix_name = constants.magic_suffixes[item.magic_suffix] ? constants.magic_suffixes[item.magic_suffix].n : null;
        if (!magic_suffix_name) {
          magic_suffix_name = 'of unknown';
        }
        name = `${name} ${magic_suffix_name}(${item.magic_suffix})`;
      }
      /* <Prefix>(<pId>) <type_name> <suffix>(<sId>)
        <type_name>*/
      if (item.quality === this.$d2s.types.EQuality.Rare && item.rare_name_id) {
        let rare_name = constants.rare_names[item.rare_name_id] ? constants.rare_names[item.rare_name_id].n : null;
        if (!rare_name) {
          rare_name = 'unknown';
        }
        name = `${name}\\n${rare_name}(${item.rare_name_id})`;
      }
      if (item.quality === this.$d2s.types.EQuality.Rare && item.rare_name_id2) {
        let rare_name2 = constants.rare_names[item.rare_name_id2] ? constants.rare_names[item.rare_name_id2].n : null;
        if (!rare_name2) {
          rare_name2 = 'of unknown';
        }
        name = `${name} ${rare_name2}(${item.rare_name_id2})`;
      }
      const personalizedName = item.personalized_name ? `${item.personalized_name}'s ` : '';
      if (item.quality === this.$d2s.types.EQuality.Set && item.set_id) {
        let set_name = constants.set_items[item.set_id] ? constants.set_items[item.set_id].n : null;
        if (!set_name) {
          set_name = 'unknown';
        }
        name = `${name}\\n${personalizedName}${set_name}(${item.set_id})`;
      }
      if (item.quality === this.$d2s.types.EQuality.Unique && item.unique_id) {
        let unique_name = constants.unq_items[item.unique_id] ? constants.unq_items[item.unique_id].n : null;
        if (!unique_name) {
          unique_name = 'unknown';
        }
        name = `${name}\\n${personalizedName}${unique_name}(${item.unique_id})`;
      }
      if (item.quality <= 3 && item.given_runeword && item.runeword_id) {
        const runes = item.socketed_items.map((e) => e.type_name.split(' ')[0]).join('');
        let runeword_name = constants.runewords[item.runeword_id] ? constants.runewords[item.runeword_id].n : null;
        if (!runeword_name) {
          runeword_name = 'unknown';
        }
        name = `\\gold;'${runes}'\\n${name}\\n\\gold;${personalizedName}${runeword_name}(${item.runeword_id})`;
      }
      if (item.quantity) name += ` (${item.quantity})`;
      return name
        .split('\\n')
        .map((d) => {
          const s = d.replace(/\\(.*?);/gi, (result, match) => `</div><div class="${match}">`);
          return `<div>${s}</div>`;
        })
        .reverse()
        .join('');
    },
    itemNameClass(item) {
      if (item.given_runeword) {
        return 'white';
      }
      switch (item.quality) {
        case 1:
        case 3:
          return 'grey';
        case 2:
          return 'white';
        case 4:
          return 'blue';
        case 5:
          return 'green';
        case 6:
          return 'yellow';
        case 7:
          return 'gold';
        case 8:
          return 'orange';
        default:
          return 'white';
      }
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
    createPopper() {
      const vm = this;
      this.tooltip = tippy(this.$refs.itemRef, {
        content: this.$refs.tooltipRef,
        hideOnClick: true,
        duration: [0, 0],
        distance: 0,
        arrow: false,
        popperOptions: {
          strategy: 'fixed',
          modifiers: [
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['bottom', 'right'],
              },
            },
            {
              name: 'preventOverflow',
              options: {
                altAxis: true,
                tether: false,
              },
            },
          ],
        },
        onShown: () => {
          vm.tooltipShown = true;
        },
        onHidden: () => {
          vm.tooltipShown = false;
        },
      });
    },
    dragStart(event) {
      console.log('dragStart');
      localStorage.setItem(
        'dragElement',
        JSON.stringify({
          uuid: this.$uuid,
          item: this.item,
        }),
      );
    },
  },
};
</script>

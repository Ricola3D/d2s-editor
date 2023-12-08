<template>
  <div>
    <div ref="itemRef" tabindex="0" :class="itemClass" v-on:dragstart="dragStart">
      <img v-if="item.src" :src="item.src" :class="{ ethereal: item.ethereal}"/>
      <img v-else src="/images/loading.gif" :style="{ opacity: 0.5 }">
      <div v-if="item.total_nr_of_sockets && tooltipShown" class="sockets">
        <div :style="socketStyle(idx)" class="socket"
          :class="{ 'empty-socket': !item.socketed_items || !item.socketed_items[idx-1]}"
          v-for="idx in item.total_nr_of_sockets" :key="idx">
          <img v-if="item.socketed_items && item.socketed_items[idx-1]" :src="item.socketed_items[idx-1].src" />
        </div>
      </div>
    </div>
    <div ref="tooltipRef">
      <div :class="itemNameClass(item)" v-html="itemName(item)"></div>
      <div v-if="item.defense_rating">Defense: {{item.defense_rating}}</div>
      <div v-if="item.base_damage">
        <div v-if="item.base_damage.mindam && item.base_damage.maxdam">
          One Hand Damage: {{item.base_damage.mindam}}-{{item.base_damage.maxdam}}
        </div>
        <div v-if="item.base_damage.twohandmindam && item.base_damage.twohandmaxdam">
          Two Hand Damage: {{item.base_damage.twohandmindam}}-{{item.base_damage.twohandmaxdam}}
        </div>
      </div>
      <div v-if="item.max_durability">
        Durability: {{item.current_durability}} of {{item.max_durability}}
      </div>
      <div>
        <div class="blue" v-html="statDescription(stat)" v-for="(stat, idx) in item.displayed_combined_magic_attributes"
          :key="idx" />
      </div>
      <div class="blue" v-if="item.ethereal">
        Ethereal
      </div>
      <div class="blue" v-if="item.total_nr_of_sockets">
        Socketed ({{item.total_nr_of_sockets}})
      </div>
    </div>
  </div>
</template>

<script>
  import { createPopper } from '@popperjs/core';
  import tippy from 'tippy.js';

  export default {
    name: 'Item',
    data() {
      return {
        tooltipShown: false,
        tooltip: null,
        edit: false,
        contextMenuShown: false,
      };
    },
    props: {
      item: Object,
      clazz: String
    },
    async mounted() {
      this.createPopper();
    },
    computed: {
      itemClass() {
        let clazz = `${this.clazz ? this.clazz : 'item'} w-${this.item.inv_width} h-${this.item.inv_height}`;
        if (this.item.location_id !== 1 && !this.clazz) {
          clazz += ` x-${this.item.position_x} y-${this.item.position_y}`;
        }
        return clazz;
      }
    },
    unmounted() {
      if (this.tooltip) {
        this.tooltip.destroy();
      }
    },
    methods: {
      socketStyle(idx) {
        const cellSize = 32.
        const countX = Math.max(1, Math.ceil(this.item.total_nr_of_sockets / this.item.inv_height))
        const countY = Math.ceil(this.item.total_nr_of_sockets / countX)
        let i = 0
        let j = 0
        if (this.item.total_nr_of_sockets == 5) {
          // Exception, draw like the 5 of a dice
          if (idx < 3) {
            i = (idx - 1) % countX
            j = Math.floor((idx - 1) / countX)
          } else if (idx == 3) {
            i = 1 / (this.item.inv_height - 1)
            j = 1 / (this.item.inv_width - 1)
          } else {
            i = (idx) % countX
            j = Math.floor((idx) / countX)
          }
        } else {
          // Columns & rows
          i = (idx - 1) % countX
          j = Math.floor((idx - 1) / countX)

          // Special case for 3
          if (countX > 1 && this.item.total_nr_of_sockets % 2) {
            if (idx == this.item.total_nr_of_sockets ) {
              // Center last socket
              i = 0.5
            }
          }
        }
        return {
            transform: `translateX(${cellSize * ( (i+0.5) * this.item.inv_width/countX - 0.5)}px) translateY(${cellSize * ( (j+0.5) * this.item.inv_height/countY - 0.5) }px)`,
            top: `0`,
            left: `0`,
          };
      },
      itemName(item) {
        let name = item.type_name;
        const constants = window[`${window.work_mod}_constants_${window.work_version}`]
        if (item.quality === d2s.Quality.Magic && item.magic_prefix) {
          let magic_prefix_name = constants.magic_prefixes[item.magic_prefix] ? constants.magic_prefixes[item.magic_prefix].n : null;
          if (!magic_prefix_name) {
            magic_prefix_name = `${item.magic_prefix}_unknown`;
          }
          name = `${magic_prefix_name}(${item.magic_prefix}) ${name}`;
        }
        if (item.quality === d2s.Quality.Magic && item.magic_suffix) {
          let magic_suffix_name = constants.magic_suffixes[item.magic_suffix] ? constants.magic_suffixes[item.magic_suffix].n : null;
          if (!magic_suffix_name) {
            magic_suffix_name = `${item.magic_suffix}_unknown`;
          }
          name = `${name} ${magic_suffix_name}(${item.magic_suffix})`;
        }
        if (item.quality === d2s.Quality.Rare && item.rare_name_id) {
          let rare_name = constants.rare_names[item.rare_name_id] ? constants.rare_names[item.rare_name_id].n : null;
          if (!rare_name) {
            rare_name = `${item.rare_name_id}_unknown`;
          }
          name = `${rare_name}(${item.rare_name_id}) ${name}`;
        }
        if (item.quality === d2s.Quality.Rare && item.rare_name_id2) {
          let rare_name2 = constants.rare_names[item.rare_name_id2] ? constants.rare_names[item.rare_name_id2].n : null;
          if (!rare_name2) {
            rare_name2 = `${item.rare_name_id2}_unknown`;
          }
          name = `${name} ${rare_name2}(${item.rare_name_id2})`;
        }
        const personalizedName = item.personalized_name ? `${item.personalized_name}'s ` : '';
        if (item.quality === d2s.Quality.Set && item.set_id) {
          let set_name = constants.set_items[item.set_id] ? constants.set_items[item.set_id].n : null;
          if (!set_name) {
            set_name = `${item.set_id}_unknown`;
          }
          name = `${name}\\n${personalizedName}${set_name}`;
        }
        if (item.quality === d2s.Quality.Unique && item.unique_id) {
          let unique_name = constants.unq_items[item.unique_id] ? constants.unq_items[item.unique_id].n : null;
          if (!unique_name) {
            unique_name = `${item.unique_id}_unknown`;
          }
          name = `${name}\\n${personalizedName}${unique_name}`;
        }
        if (item.quality <= 3 && item.given_runeword && item.runeword_id) {
          const runes = item.socketed_items.map(e => e.type_name.split(' ')[0]).join('');
          const runeword_name = constants.runewords[item.runeword_id] ? constants.runewords[item.runeword_id].n : null;
          if (!runeword_name) {
            runeword_name = `${item.runeword_id}_unknown`;
          }
          name = `\\gold;'${runes}'\\n${name}\\n\\gold;${personalizedName}${runeword_name}`;
        }
        return name.split('\\n').map((d) => {
          const s = d.replace(/\\(.*?);/gi, (result, match) => `</div><div class="${match}">`);
          return `<div>${s}</div>`;
        }).reverse().join('');
      },
      itemNameClass(item) {
        if (item.given_runeword) {
          return 'white';
        }
        switch (item.quality) {
          case 1:
            return 'grey';
          case 2:
          case 3:
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
        return ds.map((d) => {
          const s = d.replace(/\\(.*?);/gi, (result, match) => `</div><div class="${match}">`);
          return `<div>${s}</div>`;
        }).reverse().join('');
      },
      createPopper() {
        const vm = this;
        this.tooltip = tippy(this.$refs.itemRef, {
          content: this.$refs.tooltipRef,
          hideOnClick: true,
          duration: [0, 0],
          distance: 0,
          arrow: false,
          onShown: () => { vm.tooltipShown = true; },
          onHidden: () => { vm.tooltipShown = false; },
        });
      },
      dragStart(event) {
        localStorage.setItem('dragElement', JSON.stringify({
          uuid: window.uuid,
          item: this.item
        }));
      }
    }
  };  
</script>
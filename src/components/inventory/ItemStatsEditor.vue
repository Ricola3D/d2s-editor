<template>
  <div>
    <div v-for="(stat, statIdx) in itemStats" :key="statIdx" class="form-row">
      <div class="col-md-4">
        <div class="form-row">
          <div class="col-md-1">
            <template v-if="!disabled">
              <button
                type="button"
                class="btn btn-link red"
                @click="removeStat(statIdx)"
              >
                &times;
              </button>
            </template>
          </div>
          <div class="col-md-11">
            <multiselect
              v-model.number="stat.id"
              :options="stats_options"
              :searchable="true"
              :can-deselect="false"
              :can-clear="false"
              :required="true"
              @update:model-value="onItemModified"
            />
          </div>
        </div>
      </div>

      <div v-for="valIdx in numValues(stat.id)" class="col-md-2">
        <template v-if="isClass(stat.id, valIdx)">
          <multiselect
            title="Class"
            v-model.number="stat.values[valIdx - 1]"
            :options="
              classes.map((charClass) => ({
                value: charClass.id,
                label: charClass.co,
              }))
            "
            :searchable="true"
            :can-deselect="false"
            :can-clear="false"
            @update:model-value="onItemModified"
          />
        </template>
        <template v-else-if="isClassSkillTab(stat.id, valIdx)">
          <multiselect
            title="Skill Tab"
            v-model.number="stat.values[valIdx - 1]"
            :options="
              [0, 1, 2].map((idx2) => ({
                value: idx2,
                label: classes[stat.values[valIdx]].ts[idx2],
              }))
            "
            :searchable="true"
            :can-deselect="false"
            :can-clear="false"
            @update:model-value="onItemModified"
          />
        </template>
        <template v-else-if="isSkill(stat.id, valIdx)">
          <multiselect
            title="Skill"
            v-model.number="stat.values[valIdx - 1]"
            :options="skills_options"
            :searchable="true"
            :can-deselect="false"
            :can-clear="false"
            @update:model-value="onItemModified"
          />
        </template>
        <input
          v-else
          :title="getStatTitle(stat.id, valIdx)"
          :id="id + 'Stat' + statIdx + 'Index' + valIdx"
          v-model.number="stat.values[valIdx - 1]"
          type="number"
          class="edit-box"
          :min="getMinValue(stat.id, valIdx - 1)"
          :max="getMaxValue(stat.id, valIdx - 1)"
          @input="changeStatValue(stat.id, stat.values, valIdx - 1)"
        />
      </div>
    </div>

    <div class="form-row">
      <button type="button" class="btn btn-link" @click="addNewStat">
        Add Stat
      </button>
    </div>
  </div>
</template>

<script>
import utils from '../../utils.mjs'
import tippy from 'tippy.js'

export default {
  props: {
    id: String,
    itemStats: Array,
    disabled: Boolean,
  },
  data() {
    return {
      stats_options: window[
        `${window.work_mod}_constants_${window.work_version}`
      ].magical_properties
        .filter((stat) => stat && stat.s)
        .map((stat) => ({
          value: stat.id,
          label: `${stat.id.toString().padStart(3, '0')}_${stat.s}`,
          desc: stat.dP || '',
        })),
      skills_options: window[
        `${window.work_mod}_constants_${window.work_version}`
      ].skills
        .filter((skill) => skill && skill.s)
        .map((skill) => ({
          value: skill.id,
          label: `${skill.s}${skill.id > 5 && !skill.c ? ' (item)' : ''}`,
        }))
        .sort((a, b) => {
          return a.label.localeCompare(b.label)
        }),
      classes:
        window[`${window.work_mod}_constants_${window.work_version}`].classes,
    }
  },
  methods: {
    onItemModified() {
      for (let i = 0; i < this.itemStats.length; i++) {
        let numVal = this.numValues(this.itemStats[i].id)
        if (numVal != this.itemStats[i].values.length) {
          this.itemStats[i].values = [0, 0, 0, 0].slice(0, numVal)
        }
      }
      this.$emit('stat-change', this.itemStats)
    },
    getMaxValue(statId, valIdx) {
      let stat =
        window[`${window.work_mod}_constants_${window.work_version}`]
          .magical_properties[statId]
      if (valIdx > 0) {
        if (stat.np && valIdx < stat.np) {
          // Stat is a succession of np values (ex: coldmindam > coldmaxdam > coldlength)
          stat =
            window[`${window.work_mod}_constants_${window.work_version}`]
              .magical_properties[statId + valIdx]
        }
        // TODO: encode
      }
      let add = stat.sA ? stat.sA : 0
      return utils.shift(1, stat.sB) - 1 - add
      // let maxValue = stat.sS ? utils.shift(1, stat.sB - 1) - 1 - add : utils.shift(1, stat.sB) - 1 - add;
      // return maxValue
    },
    getMinValue(statId, valIdx) {
      //for the stat to be present need value > 0
      let stat =
        window[`${window.work_mod}_constants_${window.work_version}`]
          .magical_properties[statId]
      if (valIdx > 0) {
        if (stat.np && valIdx < stat.np) {
          // Stat is a succession of np values (ex: coldmindam > coldmaxdam > coldlength)
          stat =
            window[`${window.work_mod}_constants_${window.work_version}`]
              .magical_properties[statId + valIdx]
        }
        // TODO: encode
      }
      let add = stat.sA ? stat.sA : 0
      return -add
      // let minValue = stat.sS ? -1 * utils.shift(1, stat.sB - 1) - add : -add;
      // return minValue
    },
    changeStatValue(statId, statValues, valueIdx) {
      let maxValue = this.getMaxValue(statId, valueIdx),
        minValue = this.getMinValue(statId, valueIdx)
      if (statValues[valueIdx] > maxValue) {
        statValues[valueIdx] = maxValue
      } else if (statValues[valueIdx] < minValue) {
        statValues[valueIdx] = minValue
      }
      //"item_maxdamage_percent"
      if (statId == 17) statValues[valueIdx + 1] = statValues[valueIdx]

      this.onItemModified()
    },
    addNewStat() {
      this.itemStats.push({ id: 0, values: [0] })
      this.onItemModified()
    },
    removeStat(statIdx) {
      this.itemStats.splice(statIdx, 1)
      this.onItemModified()
    },
    isClass(statId, valueIdx) {
      // Is it a combobox with choice among 7 classes ?
      let stat =
        window[`${window.work_mod}_constants_${window.work_version}`]
          .magical_properties[statId]
      if (stat.dF == 14 && valueIdx == 2) {
        return true
      }
      if (stat.dF == 13 && valueIdx == 1) {
        return true
      }
      return false
    },
    isClassSkillTab(statId, valueIdx) {
      // Is it a combobox with choice among 3 tabs ?
      let stat =
        window[`${window.work_mod}_constants_${window.work_version}`]
          .magical_properties[statId]
      if (stat.dF == 14 && valueIdx == 1) {
        return true
      }
      return false
    },
    isSkill(statId, valueIdx) {
      let stat =
        window[`${window.work_mod}_constants_${window.work_version}`]
          .magical_properties[statId]
      if (stat.dF == 15 || stat.dF == 24) {
        // Similar to e=2 or 3
        return valueIdx == 2
      }
      if (stat.dF == 16) {
        return valueIdx == 1
      }
      if (stat.dF == 16 || stat.dF == 27 || stat.dF == 28) {
        // Aura when equipped or Similar to e=1
        return valueIdx == 1
      }

      return false
    },
    getStatTitle(statId, valueIdx) {
      let stat =
        window[`${window.work_mod}_constants_${window.work_version}`]
          .magical_properties[statId]
      if (stat.dF == 14) {
        if (valueIdx == 1) return 'Skill Tab'
        if (valueIdx == 2) return 'Class'
        if (valueIdx == 3) return 'Bonus Level'
      } else if (stat.dF == 13) {
        if (valueIdx == 1) return 'Class'
        if (valueIdx == 2) return 'Bonus Level'
      } else if (stat.sP) {
        if (stat.e == 3) {
          if (valueIdx == 1) return 'Skill Level'
          if (valueIdx == 2) return 'Skill'
          if (valueIdx == 3) return 'Current charges'
          if (valueIdx == 4) return 'Max charges'
          return valueIdx == 2
        } else if (stat.e == 2) {
          if (valueIdx == 1) return 'Skill Level'
          if (valueIdx == 2) return 'Skill'
          if (valueIdx == 3) return 'Chances to Cast'
          return valueIdx == 2
        } else {
          if (valueIdx == 1) return 'Skill'
          if (valueIdx == 2) return 'Skill Level'
        }
      } else if (stat.np > 1) {
        if (valueIdx == 1)
          return stat.s === 'poisonmindam' ? 'Min (xLength/256)' : 'Min'
        if (valueIdx == 2) return 'Max'
        if (valueIdx == 3) return 'Length in frames (25frames = 1s)'
      }
      return ''
    },
    numValues(id) {
      // 1 - +[value] [string1]
      // 2 - [value]% [string1]
      // 3 - [value] [string1]
      // 4 - +[value]% [string1]
      // 5 - [value*100/128]% [string1]
      // 6 - +[value] [string1] [string2]
      // 7 - [value]% [string1] [string2]
      // 8 - +[value]% [string1] [string2]
      // 9 - [value] [string1] [string2]
      // 10 - [value*100/128]% [string1] [string2]
      // 11 - Repairs 1 Durability In [100 / value] Seconds
      // 12 - +[value] [string1]
      // 13 - +[value] to [class] Skill Levels
      // 14 - +[value] to [skilltab] Skill Levels ([class] Only)
      // 15 - [chance]% to case [slvl] [skill] on [event]
      // 16 - Level [sLvl] [skill] Aura When Equipped
      // 17 - [value] [string1] (Increases near [time])
      // 18 - [value]% [string1] (Increases near [time])
      // 19 - this is used by stats that use Blizzard's sprintf implementation (if you don't know what that is, it won't be of interest to you eitherway I guess), look at how prismatic is setup, the string is the format that gets passed to their sprintf spinoff.
      // 20 - [value * -1]% [string1]
      // 21 - [value * -1] [string1]
      // 22 - [value]% [string1] [montype] (warning: this is bugged in vanilla and doesn't work properly, see CE forum)
      // 23 - [value]% [string1] [monster]
      // 24 - used for charges, we all know how that desc looks
      // 25 - not used by vanilla, present in the code but I didn't test it yet
      // 26 - not used by vanilla, present in the code but I didn't test it yet
      // 27 - +[value] to [skill] ([class] Only)
      // 28 - +[value] to [skill]
      let stat =
        window[`${window.work_mod}_constants_${window.work_version}`]
          .magical_properties[id]
      if (stat.np) {
        return stat.np
      }
      if (stat.dF == 24 || stat.e == 3) {
        return 4
      }
      if (stat.dF == 14 || stat.e == 2) {
        return 3
      }
      if (
        stat.dF == 13 ||
        stat.dF == 16 ||
        (stat.dF >= 22 && stat.dF <= 23) ||
        (stat.dF >= 27 && stat.dF <= 28) ||
        stat.sP
      ) {
        return 2
      }

      if (
        (stat.dF >= 1 && stat.dF <= 12) ||
        (stat.dF >= 17 && stat.dF <= 18) ||
        (stat.dF >= 20 && stat.dF <= 21)
      ) {
        return 1
      }

      // Mostly dF 19 (Blizzard's sprintf implementation)
      return 1
    },
    formatStateOption(state) {
      if (!state.id) {
        return state.text
      }
      const stat =
        window[`${window.work_mod}_constants_${window.work_version}`]
          .magical_properties[state.id]
      let tooltip = stat.dP || stat.dN
      const $state = $(`<span title="${tooltip}">${state.text}</span>`)
      return $state
    },
  },
}
</script>

<template>
  <div>
    <div class="form-row" v-for="(stat, statIdx) in itemStats" :key="statIdx">
      <div class="col-md-4">
        <div class="form-row">
          <div class="col-md-1"><button type="button" class="btn btn-link red" @click="removeStat(statIdx)">&times;</button>
          </div>
          <div class="col-md-11">
            <!-- <Select2 :id="id + 'Stat' + statIdx" v-model.number="stat.id" :options="" @change="onItemModified"/> -->
            <select2 :id="id + 'Stat' + statIdx" v-model.number="stat.id" @change="onItemModified">
              <option v-for="it in stats_map" :value="it.i" :key="it.i">{{it.i.toString().padStart(3, '0')}}_{{ it.v.s }}</option>
            </select2>
          </div>
        </div>
      </div>

      <div class="col-md-2" v-for="idx in numValues(stat.id)">
        <select2 class="edit-box" :id="id + 'Stat' + statIdx + 'Index'+ idx" v-model.number="stat.values[idx-1]"
          v-if="isClass(stat.id, idx)" @change="onItemModified">
          <option v-for="(it, i) in classes" :value="i" :key="i">{{it.co}}</option>
        </select2>
        <select2 class="edit-box" :id="id + 'Stat' + statIdx + 'Index'+ idx" v-model.number="stat.values[idx-1]"
          v-else-if="isClassSkill(stat.id, idx)" @change="onItemModified">
          <option v-for="(it, i) in classes[stat.values[idx]].ts" :value="i" :key="i">{{it}}</option>
        </select2>
        <select2 class="edit-box" :id="id + 'Stat' + statIdx + 'Index'+ idx" v-model.number="stat.values[idx-1]"
          v-else-if="isSkill(stat.id, idx)" @change="onItemModified">
          <option v-for="it in skills" :value="it.i" :key="it.i">{{it.v.s}}</option>
        </select2>
        <input type="number" class= "edit-box" :min="getMinValue(stat.id)" :max="getMaxValue(stat.id)" @input="changeStatValue(stat.id, stat.values, idx-1)"
          :id="id + 'Stat' + statIdx + 'Index'+ idx" v-model.number="stat.values[idx-1]" v-else>
      </div>
    </div>
    
    <div class="form-row">
      <button type="button" class="btn btn-link" @click="addNewStat">Add Stat</button>
    </div>
  </div>
</template>

<script>
import utils from '../../utils.js';

export default {
  props: {
    id: String,
    itemStats: Array
  },
  data() {
    return {
      stats_map: window[`${window.work_mod}_constants_${window.work_version}`].magical_properties.map((e, i) => { return { i: i, v: e } }).filter(e => e.v != null && e.v.s != null),
      skills: window[`${window.work_mod}_constants_${window.work_version}`].skills.map((e, i) => { return { i: i, v: e } }).filter(e => e.v != null && e.v.s != null).sort((a, b) => { return a.v.s.localeCompare(b.v.s) }),
      classes: window[`${window.work_mod}_constants_${window.work_version}`].classes,
    }
  },
  methods: {
    onItemModified() {
      for (let i = 0; i < this.itemStats.length; i++) {
        let numVal = this.numValues(this.itemStats[i].id)
        if (numVal != this.itemStats[i].values.length) {
          this.itemStats[i].values = [1, 0, 1].slice(0, numVal)
        }
      }
      this.$emit('stat-change', this.itemStats);
    },
    getMaxValue(statId) {
      let stat = window[`${window.work_mod}_constants_${window.work_version}`].magical_properties[statId];
      let add = stat.sA ? stat.sA : 0;
      return utils.shift(1, stat.sB) - 1 - stat.sA;
    },
    getMinValue(statId) {
      //for the stat to be present need value > 0
      let stat = window[`${window.work_mod}_constants_${window.work_version}`].magical_properties[statId];
      let add = stat.sA ? stat.sA : 0;
      return -add;
    },
    changeStatValue(statId, statValues, valueIdx) {
      let maxValue = this.getMaxValue(statId),
        minValue = this.getMinValue(statId);
      if (statValues[valueIdx] > maxValue) {
        statValues[valueIdx] = maxValue;
      } else if (statValues[valueIdx] < minValue) {
        statValues[valueIdx] = minValue;
      }
      //"item_maxdamage_percent"
      if (statId == 17)
        statValues[valueIdx + 1] = statValues[valueIdx];

      this.onItemModified();
    },
    addNewStat() {
      this.itemStats.push({ id: 0, values: [1, 0, 1] });
      this.onItemModified();
    },
    removeStat(statIdx) {
      this.itemStats.splice(statIdx, 1);
      this.onItemModified();
    },
    isClass(statId, valueIdx) {
      let stat = window[`${window.work_mod}_constants_${window.work_version}`].magical_properties[statId];
      if ((stat.dF == 14) && valueIdx == 2) {
        return true;
      }
      if ((stat.dF == 13) && valueIdx == 1) {
        return true;
      }
      return false;
    },
    isClassSkill(statId, valueIdx) {
      let stat = window[`${window.work_mod}_constants_${window.work_version}`].magical_properties[statId];
      if ((stat.dF == 14) && valueIdx == 1) {
        return true;
      }
      return false;
    },
    isSkill(statId, valueIdx) {
      let stat = window[`${window.work_mod}_constants_${window.work_version}`].magical_properties[statId];
      if (stat.dF == 14) {
        return false;
      }
      if (stat.sP) {
        if (stat.e == 3 || stat.e == 2) {
          return valueIdx == 2;
        } else {
          return valueIdx == 1;
        }
      }
      return false;
    },
    numValues(id) {
      let stat = window[`${window.work_mod}_constants_${window.work_version}`].magical_properties[id];
      if (stat.np) {
        return stat.np;
      }
      if (stat.dF == 14 || stat.e == 2) {
        return 3;
      }
      if (stat.e == 3) {
        return 4;
      }
      if (stat.sP) {
        return 2;
      }
      return 1;
    }
  }
};  
</script>
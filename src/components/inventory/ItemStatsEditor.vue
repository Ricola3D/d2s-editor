<template>
  <div>
    <div v-for="(stat, statIdx) in itemStats" :key="statIdx" class="form-row">
      <div class="col-md-4">
        <div class="form-row">
          <div class="col-md-1">
            <template v-if="!disabled">
              <button type="button" class="btn btn-link red" @click="removeStat(statIdx)">&times;</button>
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

      <div v-for="valIdx in numValues(stat.id)" :key="valIdx" class="col-md-2">
        <template v-if="isClass(stat.id, valIdx)">
          <multiselect
            v-model.number="stat.values[valIdx - 1]"
            title="Class"
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
            v-model.number="stat.values[valIdx - 1]"
            title="Skill Tab"
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
            v-model.number="stat.values[valIdx - 1]"
            title="Skill"
            :options="skills_options"
            :searchable="true"
            :can-deselect="false"
            :can-clear="false"
            @update:model-value="onItemModified"
          />
        </template>
        <input
          v-else
          :id="id + 'Stat' + statIdx + 'Index' + valIdx"
          v-model.number="stat.values[valIdx - 1]"
          :title="getValueTooltip(stat.id, valIdx)"
          type="number"
          class="edit-box"
          :min="getMinValue(stat.id, valIdx - 1)"
          :max="getMaxValue(stat.id, valIdx - 1)"
          @input="changeStatValue(stat.id, stat.values, valIdx - 1)"
        />
      </div>
    </div>

    <div class="form-row">
      <button type="button" class="btn btn-link" @click="addNewStat">Add Stat</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemStatEditor',
  props: {
    id: String,
    itemStats: Array,
    disabled: Boolean,
  },
  data() {
    return {
      stats_options: this.$getWorkConstantData()
        .magical_properties.filter((stat) => stat && stat.s)
        .map((stat) => ({
          value: stat.id,
          label: `${stat.id.toString().padStart(3, '0')}_${stat.s}`,
          desc: stat.dP || '',
        })),
      skills_options: this.$getWorkConstantData()
        .skills.filter((skill) => skill && skill.s)
        .map((skill) => ({
          value: skill.id,
          label: `${skill.s}${skill.id > 5 && !skill.c ? ' (item)' : ''}`,
        }))
        // .map((skill, idx) => ({
        //   value: skill ? skill.id : idx,
        //   label: `${skill && skill.s ? skill.s : "unk_" + idx}${skill && skill.id > 5 && !skill.c ? ' (item)' : ''}`,
        // }))
        .sort((a, b) => {
          return a.label.localeCompare(b.label);
        }),
      classes: this.$getWorkConstantData().classes,
    };
  },
  methods: {
    onItemModified() {
      for (let i = 0; i < this.itemStats.length; i++) {
        let numVal = this.numValues(this.itemStats[i].id);
        if (numVal != this.itemStats[i].values.length) {
          this.itemStats[i].values = [0, 0, 0, 0].slice(0, numVal);
        }
      }
      this.$emit('stat-change', this.itemStats);
    },
    getMaxValue(statId, valIdx) {
      return this.$d2s.utils.getMaxValue(statId, valIdx, this.$getWorkConstantData().magical_properties);
    },
    getMinValue(statId, valIdx) {
      return this.$d2s.utils.getMinValue(statId, valIdx, this.$getWorkConstantData().magical_properties);
    },
    isClass(statId, valueIdx) {
      return this.$d2s.utils.isClass(statId, valueIdx, this.$getWorkConstantData().magical_properties);
    },
    isClassSkillTab(statId, valueIdx) {
      return this.$d2s.utils.isClassSkillTab(statId, valueIdx, this.$getWorkConstantData().magical_properties);
    },
    isSkill(statId, valueIdx) {
      return this.$d2s.utils.isSkill(statId, valueIdx, this.$getWorkConstantData().magical_properties);
    },
    getValueTooltip(statId, valueIdx) {
      return this.$d2s.utils.getValueTooltip(statId, valueIdx, this.$getWorkConstantData().magical_properties);
    },
    numValues(id) {
      return this.$d2s.utils.numValues(id, this.$getWorkConstantData().magical_properties);
    },
    changeStatValue(statId, statValues, valueIdx) {
      let maxValue = this.getMaxValue(statId, valueIdx),
        minValue = this.getMinValue(statId, valueIdx);
      if (statValues[valueIdx] > maxValue) {
        statValues[valueIdx] = maxValue;
      } else if (statValues[valueIdx] < minValue) {
        statValues[valueIdx] = minValue;
      }
      //"item_maxdamage_percent"
      if (statId == 17) statValues[valueIdx + 1] = statValues[valueIdx];

      this.onItemModified();
    },
    addNewStat() {
      this.itemStats.push({ id: 0, values: [0] });
      this.onItemModified();
    },
    removeStat(statIdx) {
      this.itemStats.splice(statIdx, 1);
      this.onItemModified();
    },
  },
};
</script>

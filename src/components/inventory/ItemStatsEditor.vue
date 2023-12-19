<template>
    <div>
        <div
            v-for="(stat, statIdx) in itemStats"
            :key="statIdx"
            class="form-row"
        >
            <div class="col-md-4">
                <div class="form-row">
                    <div class="col-md-1">
                        <button
                            type="button"
                            class="btn btn-link red"
                            @click="removeStat(statIdx)"
                        >
                            &times;
                        </button>
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
                <template v-else-if="isClassSkill(stat.id, valIdx)">
                    <multiselect
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
                    :id="id + 'Stat' + statIdx + 'Index' + valIdx"
                    v-model.number="stat.values[valIdx - 1]"
                    type="number"
                    class="edit-box"
                    :min="getMinValue(stat.id)"
                    :max="getMaxValue(stat.id)"
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
import utils from '../../utils.js'
import tippy from 'tippy.js'

export default {
    props: {
        id: String,
        itemStats: Array,
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
                .map((skill) => ({ value: skill.id, label: skill.s }))
                .sort((a, b) => {
                    return a.label.localeCompare(b.label)
                }),
            classes:
                window[`${window.work_mod}_constants_${window.work_version}`]
                    .classes,
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
            this.$emit('stat-change', this.itemStats)
        },
        getMaxValue(statId) {
            let stat =
                window[`${window.work_mod}_constants_${window.work_version}`]
                    .magical_properties[statId]
            let add = stat.sA ? stat.sA : 0
            return utils.shift(1, stat.sB) - 1 - stat.sA
        },
        getMinValue(statId) {
            //for the stat to be present need value > 0
            let stat =
                window[`${window.work_mod}_constants_${window.work_version}`]
                    .magical_properties[statId]
            let add = stat.sA ? stat.sA : 0
            return -add
        },
        changeStatValue(statId, statValues, valueIdx) {
            let maxValue = this.getMaxValue(statId),
                minValue = this.getMinValue(statId)
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
            this.itemStats.push({ id: 0, values: [1, 0, 1] })
            this.onItemModified()
        },
        removeStat(statIdx) {
            this.itemStats.splice(statIdx, 1)
            this.onItemModified()
        },
        isClass(statId, valueIdx) {
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
        isClassSkill(statId, valueIdx) {
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
            if (stat.dF == 14) {
                return false
            }
            if (stat.sP) {
                if (stat.e == 3 || stat.e == 2) {
                    return valueIdx == 2
                } else {
                    return valueIdx == 1
                }
            }
            return false
        },
        numValues(id) {
            let stat =
                window[`${window.work_mod}_constants_${window.work_version}`]
                    .magical_properties[id]
            if (stat.np) {
                return stat.np
            }
            if (stat.dF == 14 || stat.e == 2) {
                return 3
            }
            if (stat.e == 3) {
                return 4
            }
            if (stat.sP) {
                return 2
            }
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

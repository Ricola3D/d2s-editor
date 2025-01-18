<template>
  <div class="form-row">
    <div v-for="(difficulty, i) in difficulties" :key="i" class="col-md-4">
      <ul>
        <li>
          <label
            ><input
              :key="difficulty.key"
              class="form-check-input"
              type="checkbox"
              :checked="difficulty.all"
              @input="updateDiff(difficulty, $event.target.checked)"
            />{{ difficulty.label }}</label
          >
        </li>
        <ul v-for="(act, j) in difficulty.acts" :key="j" class="col-md-offset-1">
          <li>
            <label
              ><input
                :key="act.key"
                class="form-check-input"
                type="checkbox"
                :checked="act.all"
                @input="updateAct(difficulty, act, $event.target.checked)"
              />{{ act.label }}</label
            >
          </li>
          <ul v-for="(waypoint, k) in act.waypoints" :key="k" class="col-md-offset-2">
            <li>
              <label
                ><input
                  :key="waypoint.key"
                  class="form-check-input"
                  type="checkbox"
                  :checked="waypoints[difficulty.key][act.key][waypoint.key]"
                  @input="updateWP(difficulty, act, waypoint, $event.target.checked)"
                />{{ waypoint.label }}</label
              >
            </li>
          </ul>
        </ul>
      </ul>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';

const waypointsDefinition = [
  {
    key: 'act_i',
    label: 'Act I',
    all: false,
    waypoints: [
      { key: 'rogue_encampement', label: 'Rogue Encampement' },
      { key: 'cold_plains', label: 'Cold Plains' },
      { key: 'stony_field', label: 'Stoney Field' },
      { key: 'dark_woods', label: 'Dark Woods' },
      { key: 'black_marsh', label: 'Black Marsh' },
      { key: 'outer_cloister', label: 'Outer Cloister' },
      { key: 'jail_lvl_1', label: 'Jail Lvl 1' },
      { key: 'inner_cloister', label: 'Inner Cloister' },
      { key: 'catacombs_lvl_2', label: 'Catacombs Lvl 2' },
    ],
  },
  {
    key: 'act_ii',
    label: 'Act II',
    all: false,
    waypoints: [
      { key: 'lut_gholein', label: 'Lut Gholein' },
      { key: 'sewers_lvl_2', label: 'Sewers Lvl 2' },
      { key: 'dry_hills', label: 'Dry Hills' },
      {
        key: 'halls_of_the_dead_lvl_2',
        label: 'Halls of the Dead Lvl 2',
      },
      { key: 'far_oasis', label: 'Far Oasis' },
      { key: 'lost_city', label: 'Lost City' },
      { key: 'palace_cellar_lvl_1', label: 'Palace Cellar Lvl 1' },
      { key: 'arcane_sanctuary', label: 'Arcane Sanctuary' },
      { key: 'canyon_of_the_magi', label: 'Canyon of the Magi' },
    ],
  },
  {
    key: 'act_iii',
    label: 'Act III',
    all: false,
    waypoints: [
      { key: 'kurast_docks', label: 'Kurast Docks' },
      { key: 'spider_forest', label: 'Spider Forest' },
      { key: 'great_marsh', label: 'Great Marsh' },
      { key: 'flayer_jungle', label: 'Flayer Jungle' },
      { key: 'lower_kurast', label: 'Lower Kurast' },
      { key: 'kurast_bazaar', label: 'Kurast Bazaar' },
      { key: 'upper_kurast', label: 'Upper Kurast' },
      { key: 'travincal', label: 'Travincal' },
      { key: 'durance_of_hate_lvl_2', label: 'Durance of Hate Lvl 2' },
    ],
  },
  {
    key: 'act_iv',
    label: 'Act IV',
    all: false,
    waypoints: [
      { key: 'the_pandemonium_fortress', label: 'Pandemonium Fortress' },
      { key: 'city_of_the_damned', label: 'City of the Damned' },
      { key: 'river_of_flame', label: 'River of Flame' },
    ],
  },
  {
    key: 'act_v',
    label: 'Act V',
    all: false,
    waypoints: [
      { key: 'harrogath', label: 'Harrogath' },
      { key: 'frigid_highlands', label: 'Frigid Highlands' },
      { key: 'arreat_plateau', label: 'Arreat Plateau' },
      { key: 'crystalline_passage', label: 'Crystalline Passage' },
      { key: 'halls_of_pain', label: 'Halls of Pain' },
      { key: 'glacial_trail', label: 'Glacial Trail' },
      { key: 'frozen_tundra', label: 'Frozen Tundra' },
      { key: 'the_ancients_way', label: "The Ancients' Way" },
      { key: 'worldstone_keep_lvl_2', label: 'Worldstone Keep Lvl 2' },
    ],
  },
];
export default {
  name: 'WaypointsTab',
  props: {
    waypoints: Object,
  },
  data() {
    return {
      difficulties: [
        {
          key: 'normal',
          all: false,
          label: 'Normal',
          acts: cloneDeep(waypointsDefinition),
        },
        {
          key: 'nm',
          all: false,
          label: 'Nightmare',
          acts: cloneDeep(waypointsDefinition),
        },
        {
          key: 'hell',
          all: false,
          label: 'Hell',
          acts: cloneDeep(waypointsDefinition),
        },
      ],
    };
  },
  watch: {
    waypoints: {
      handler: function (newWp, oldWp) {
        // Update difficulty all & act all checkboxes
        for (const [i, difficulty] of this.difficulties.entries()) {
          let isDifficultyAll = true;
          for (const [j, act] of difficulty.acts.entries()) {
            let isActAll = true;
            for (const wp of act.waypoints) {
              if (!newWp[difficulty.key][act.key][wp.key]) {
                isActAll = false;
                isDifficultyAll = false;
              }
            }
            this.difficulties[i].acts[j].all = isActAll;
          }
          this.difficulties[i].all = isDifficultyAll;
        }
      },
      deep: true,
    },
  },
  methods: {
    updateWP(difficulty, act, wp, value) {
      // Uncheck act checkbock if necessary
      if (value !== act.all && act.all) {
        act.all = false;
      }
      // Uncheck difficulty checkbock if necessary
      if (value !== difficulty.all && difficulty.all) {
        difficulty.all = false;
      }

      const newWaypoints = cloneDeep(this.waypoints);
      newWaypoints[difficulty.key][act.key][wp.key] = value;

      // Emit the modification
      this.$emit('update:waypoints', newWaypoints);
    },
    updateAct(difficulty, act, value, emitNow = true) {
      const newWaypoints = cloneDeep(this.waypoints);

      for (const wp of act.waypoints) {
        newWaypoints[difficulty.key][act.key][wp.key] = value;
      }

      // Emit the modification
      this.$emit('update:waypoints', newWaypoints);
    },
    updateDiff(difficulty, value) {
      const newWaypoints = cloneDeep(this.waypoints);
      for (const act of difficulty.acts) {
        // Update act checkbox
        act.all = value;

        for (const wp of act.waypoints) {
          newWaypoints[difficulty.key][act.key][wp.key] = value;
        }
      }

      // Emit the modification
      this.$emit('update:waypoints', newWaypoints);
    },
  },
};
</script>

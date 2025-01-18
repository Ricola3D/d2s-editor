<template>
  <div>
    <div class="form-row">
      <div v-for="i in 3" class="col-md-4">
        <div class="row">
          <div v-for="j in 10" class="col-md-6">
            <label :for="'Skill' + i + '_' + j">{{ save.skills[(i - 1) * 10 + (j - 1)].name }}</label>
            <input
              :id="'Skill' + i + '_' + j"
              v-model.number="save.skills[(i - 1) * 10 + (j - 1)].points"
              type="number"
              class="form-control"
              min="0"
              max="20"
              @input="spentPointsChange()"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="form-row">
      <div class="col-md-2">
        <label for="UnusedSkillPoints">Unused Skill Points</label>
        <input
          id="UnusedSkillPoints"
          v-model.number="save.attributes.newskills"
          type="number"
          class="form-control"
          :min="0"
          :max="255"
          @input="change(5, save.attributes, 'newskills')"
        />
      </div>
    </div>
    <br />
    <button type="button" class="btn btn-danger" @click="setAllSkills(0)">Reset All</button>
    <div class="input-group" style="display: inline-block; width: auto; vertical-align: middle">
      <div class="input-group-prepend">
        <button type="button" class="btn btn-secondary" @click="setAll()">Set All To:</button>
        <input v-model="allSkills" type="number" min="0" max="20" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkillsTab',
  props: {
    save: Object,
  },
  data() {
    return {
      allSkills: null,
      stats: this.$getWorkConstantData().magical_properties,
    };
  },
  methods: {
    getMaxAvailablePoints() {
      let maxAvailablePoints = this.save.header.level - 1;
      for (const difficulty of ['quests_normal', 'quests_nm', 'quests_hell']) {
        if (this.save.header[difficulty].act_i.den_of_evil.b0_is_completed) maxAvailablePoints++;
        if (this.save.header[difficulty].act_ii.radaments_lair.b0_is_completed) maxAvailablePoints++;
        if (this.save.header[difficulty].act_iv.the_fallen_angel.b0_is_completed) maxAvailablePoints += 2;
      }
      return maxAvailablePoints;
    },
    getSpentPoints() {
      let spentPoints = 0;
      for (var s of this.save.skills) {
        spentPoints += s.points;
      }
      return spentPoints;
    },
    spentPointsChange() {
      const totalSpentPoints = this.getSpentPoints();
      const maxAvailablePoints = this.getMaxAvailablePoints();

      // Recompute unspent points
      if (totalSpentPoints <= maxAvailablePoints) {
        // Legit
        this.save.attributes.newskills = maxAvailablePoints - totalSpentPoints;
      } else {
        // Cheat
        this.save.attributes.newskills = 0;
      }
    },
    setAllSkills(level) {
      const totalSpentPoints = this.save.skills.length * level;
      const maxAvailablePoints = this.getMaxAvailablePoints();

      // Recompute unspent points
      if (totalSpentPoints <= maxAvailablePoints) {
        // Legit
        this.save.attributes.newskills = maxAvailablePoints - totalSpentPoints;
      } else {
        // Cheat
        this.save.attributes.newskills = 0;
      }

      // this.save.attributes.newskills

      const isNec = this.save.header.class == 'Necromancer';
      for (var s of this.save.skills) {
        if (level == 0 && isNec && s.name == 'Iron Golem' && s.points > 0 && !!this.save.golem_item) {
          s.points = 1; // Keep at least 1 point not to loose the iron golem
          this.save.attributes.newskills--;
        } else if (s.points != level) {
          s.points = level;
        }
      }
    },
    setAll() {
      if (this.allSkills == null || this.allSkills == undefined) return;
      this.setAllSkills(this.allSkills);
      this.allSkills = null;
    },
    max(id) {
      let stat = this.stats[id];
      let s = this.$d2s.utils.shift(1, stat.cB) - 1;
      if (stat.vS) {
        s = Math.floor(this.$d2s.utils.shift(s, -stat.vS));
      }
      return s;
    },
    min(id) {
      return 0;
    },
    change(id, values, idx) {
      let maxValue = this.max(id),
        minValue = this.min(id);
      if (values[idx] > maxValue) {
        values[idx] = maxValue;
      } else if (values[idx] < minValue) {
        values[idx] = minValue;
      }
      if (id == 12) {
        this.save.header.level = values[idx];
        this.save.attributes.experience = xp[values[idx] - 1];
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="form-group mt-2">
      <label for="name">Name</label>
      <input
        id="name"
        v-model="save.header.name"
        type="text"
        class="form-control"
        placeholder="Character Name (3 to 14 letters, allows one - or _ except at start & end)"
        pattern="^[A-Za-z](?=.{0,14}$)[A-Za-z]*[A-Za-z\-_][A-Za-z]+$"
        required
        @change="rename()"
      />
    </div>
    <div class="form-row">
      <div class="col-md-12">
        <div class="form-check form-check-inline">
          <label class="form-check-label"
            ><input v-model="save.header.status.expansion" class="form-check-input" type="checkbox" />Expansion</label
          >
        </div>
        <div class="form-check form-check-inline">
          <label class="form-check-label"
            ><input v-model="save.header.status.ladder" class="form-check-input" type="checkbox" />Ladder</label
          >
        </div>
        <div class="form-check form-check-inline">
          <label class="form-check-label"
            ><input v-model="save.header.status.hardcore" class="form-check-input" type="checkbox" />Hardcore</label
          >
        </div>
        <div class="form-check form-check-inline">
          <label class="form-check-label"><input v-model="save.header.status.died" class="form-check-input" type="checkbox" />Dead</label>
        </div>
      </div>
    </div>
    <div class="form-row">
      <div class="col-md-2">
        <label for="Level">Level</label>
        <input
          id="Level"
          v-model.number="save.attributes.level"
          type="number"
          class="form-control"
          :min="min(12)"
          :max="max(12)"
          @input="change(12, save.attributes, 'level')"
        />
      </div>
      <div class="col-md-2">
        <label for="Experience">Experience</label>
        <input id="Experience" v-model.number="save.attributes.experience" type="number" class="form-control" />
      </div>
    </div>
    <div class="form-row">
      <div class="col-md-4">
        <label for="Life">Life</label>
        <div class="input-group">
          <input
            id="Life"
            v-model.number="save.attributes.hitpoints"
            class="form-control"
            type="number"
            :min="min(6)"
            :max="max(6)"
            @input="change(6, save.attributes, 'hitpoints')"
          />
          <div class="input-group-prepend input-group-append">
            <div class="input-group-text">/</div>
          </div>
          <input
            id="MaxLife"
            v-model.number="save.attributes.maxhp"
            class="form-control"
            type="number"
            :min="min(7)"
            :max="max(7)"
            @input="change(7, save.attributes, 'maxhp')"
          />
        </div>
      </div>
      <div class="col-md-4">
        <label for="Mana">Mana</label>
        <div class="input-group">
          <input
            id="Mana"
            v-model.number="save.attributes.mana"
            class="form-control"
            type="number"
            :min="min(8)"
            :max="max(8)"
            @input="change(8, save.attributes, 'mana')"
          />
          <div class="input-group-prepend input-group-append">
            <div class="input-group-text">/</div>
          </div>
          <input
            id="MaxMana"
            v-model.number="save.attributes.maxmana"
            class="form-control"
            type="number"
            :min="min(9)"
            :max="max(9)"
            @input="change(9, save.attributes, 'maxmana')"
          />
        </div>
      </div>
      <div class="col-md-4">
        <label for="Stamina">Stamina</label>
        <div class="input-group">
          <input
            id="Stamina"
            v-model.number="save.attributes.stamina"
            class="form-control"
            type="number"
            :min="min(6)"
            :max="max(6)"
            @input="change(6, save.attributes, 'stamina')"
          />
          <div class="input-group-prepend input-group-append">
            <div class="input-group-text">/</div>
          </div>
          <input
            id="MaxStamina"
            v-model.number="save.attributes.maxstamina"
            class="form-control"
            type="number"
            :min="min(7)"
            :max="max(7)"
            @input="change(7, save.attributes, 'maxstamina')"
          />
        </div>
      </div>
    </div>
    <hr class="dotted" />
    <div class="form-row">
      <div class="col-md-2">
        <label for="Strength">Strength</label>
        <input
          id="Strength"
          v-model.number="save.attributes.strength"
          type="number"
          class="form-control"
          :min="min(0)"
          :max="max(0)"
          @input="change(0, save.attributes, 'strength')"
        />
      </div>
      <div class="col-md-2">
        <label for="Dexterity">Dexterity</label>
        <input
          id="Dexterity"
          v-model.number="save.attributes.dexterity"
          type="number"
          class="form-control"
          :min="min(2)"
          :max="max(2)"
          @input="change(2, save.attributes, 'dexterity')"
        />
      </div>
      <div class="col-md-2">
        <label for="Vitality">Vitality</label>
        <input
          id="Vitality"
          v-model.number="save.attributes.vitality"
          type="number"
          class="form-control"
          :min="min(3)"
          :max="max(3)"
          @input="change(3, save.attributes, 'vitality')"
        />
      </div>
      <div class="col-md-2">
        <label for="Energy">Energy</label>
        <input
          id="Energy"
          v-model.number="save.attributes.energy"
          type="number"
          class="form-control"
          :min="min(1)"
          :max="max(1)"
          @input="change(1, save.attributes, 'energy')"
        />
      </div>
      <div class="col-md-2">
        <label for="UnusedStatPoints">Stat Points</label>
        <input
          id="UnusedStatPoints"
          v-model.number="save.attributes.statpts"
          type="number"
          class="form-control"
          :min="min(4)"
          :max="max(4)"
          @input="change(4, save.attributes, 'statpts')"
        />
      </div>
    </div>
    <hr class="dotted" />
    <div class="form-row">
      <div class="col-md-2">
        <label for="Gold">Gold</label>
        <input
          id="Gold"
          v-model.number="save.attributes.gold"
          type="number"
          class="form-control"
          :min="min(14)"
          :max="max(14)"
          @input="change(14, save.attributes, 'gold')"
        />
      </div>
      <div class="col-md-2">
        <label for="StashedGold">Stashed Gold</label>
        <input
          id="StashedGold"
          v-model.number="save.attributes.goldbank"
          type="number"
          class="form-control"
          :min="min(15)"
          :max="max(15)"
          @input="change(15, save.attributes, 'goldbank')"
        />
      </div>
    </div>
    <template v-if="$work_mod.value == 'remodded'">
      <div class="form-row">
        <div class="col-md-2">
          <label for="killtrack">Kills</label>
          <input
            id="killtrack"
            v-model.number="save.attributes.killtrack"
            type="number"
            class="form-control"
            :min="min(14)"
            :max="max(14)"
            @input="change(14, save.attributes, 'killtrack')"
          />
        </div>
        <div class="col-md-2">
          <label for="deathtrack">Deaths</label>
          <input
            id="deathtrack"
            v-model.number="save.attributes.deathtrack"
            type="number"
            :class="{ 'form-control': true, warn: save.attributes.deathtrack > 0 }"
            :min="min(15)"
            :max="max(15)"
            @input="change(15, save.attributes, 'deathtrack')"
          />
        </div>
        <div class="col-md-2">
          <label for="unknown_183">Unknown 183</label>
          <input
            id="unknown_183"
            v-model.number="save.attributes.unknown_183"
            type="number"
            class="form-control"
            title="Increases with each block ? In itemstatscost.txt named 'killtrack'"
            :min="min(14)"
            :max="max(14)"
            @input="change(14, save.attributes, 'unknown_183')"
          />
        </div>
        <div class="col-md-2">
          <label for="unknown_183">Unknown 184</label>
          <input
            id="unknown_184"
            v-model.number="save.attributes.unknown_184"
            type="number"
            class="form-control"
            title="Always 0 ? In itemstatscost.txt named 'deathtrack'"
            :min="min(14)"
            :max="max(14)"
            @input="change(14, save.attributes, 'unknown_184')"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const xp = [
  0, 500, 1500, 3750, 7875, 14175, 22680, 32886, 44396, 57715, 72144, 90180, 112725, 140906, 176132, 220165, 275207, 344008, 430010, 537513,
  671891, 839864, 1049830, 1312287, 1640359, 2050449, 2563061, 3203826, 3902260, 4663553, 5493363, 6397855, 7383752, 8458379, 9629723,
  10906488, 12298162, 13815086, 15468534, 17270791, 19235252, 21376515, 23710491, 26254525, 29027522, 32050088, 35344686, 38935798,
  42850109, 47116709, 51767302, 56836449, 62361819, 68384473, 74949165, 82104680, 89904191, 98405658, 107672256, 117772849, 128782495,
  140783010, 153863570, 168121381, 183662396, 200602101, 219066380, 239192444, 261129853, 285041630, 311105466, 339515048, 370481492,
  404234916, 441026148, 481128591, 524840254, 572485967, 624419793, 681027665, 742730244, 809986056, 883294891, 963201521, 1050299747,
  1145236814, 1248718217, 1361512946, 1484459201, 1618470619, 1764543065, 1923762030, 2097310703, 2286478756, 2492671933, 2717422497,
  2962400612, 3229426756, 3520485254, 3837739017,
];

export default {
  name: 'StatsTab',
  props: {
    save: Object,
  },
  data() {
    return {
      stats: this.$getWorkConstantData().magical_properties,
    };
  },
  watch: {
    'save.header.level': function (level, s) {
      const constants = this.$getWorkConstantData();
      this.save.attributes.level = level;
      this.save.attributes.experience = xp[level - 1];

      const newLevel = level - s;
      this.save.attributes.statpts = (this.save.attributes.statpts ?? 0) + newLevel * 5;
      this.save.attributes.newskills = (this.save.attributes.newskills ?? 0) + newLevel;
      for (const cCode in constants.classes) {
        const stat = constants.classes[cCode];
        if (stat.n === this.save.header.class) {
          this.save.attributes.maxhp += (newLevel * stat.s.lpl) / 4;
          this.save.attributes.hitpoints += (newLevel * stat.s.lpl) / 4;

          this.save.attributes.maxstamina += (newLevel * stat.s.spl) / 4;
          this.save.attributes.stamina += (newLevel * stat.s.spl) / 4;

          this.save.attributes.maxmana += (newLevel * stat.s.mpl) / 4;
          this.save.attributes.mana += (newLevel * stat.s.mpl) / 4;
          break;
        }
      }
    },
    'save.attributes.vitality': function (val, old) {
      const constants = this.$getWorkConstantData();
      const change = val - old;
      for (const cCode in constants.classes) {
        const stat = constants.classes[cCode];
        if (stat.n === this.save.header.class) {
          this.save.attributes.maxhp += (change * stat.s.lpv) / 4;
          this.save.attributes.hitpoints += (change * stat.s.lpv) / 4;

          this.save.attributes.maxstamina += (change * stat.s.spv) / 4;
          this.save.attributes.stamina += (change * stat.s.spv) / 4;
          break;
        }
      }
    },
    'save.attributes.energy': function (val, old) {
      const constants = this.$getWorkConstantData();
      const change = val - old;
      for (const cCode in constants.classes) {
        const stat = constants.classes[cCode];
        if (stat.n === this.save.header.class) {
          this.save.attributes.maxmana += (change * stat.s.mpe) / 4;
          this.save.attributes.mana += (change * stat.s.mpe) / 4;
          break;
        }
      }
    },
  },
  methods: {
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
    rename() {
      const valid = this.$d2s.utils.nameRegex.test(this.save.header.name);
      if (!valid) {
        this.save.header.name = 'InvalidName';
      }
    },
  },
};
</script>

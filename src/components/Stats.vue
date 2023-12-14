<template>
  <div>
    <div class="form-group mt-2">
      <label for="name">Name</label>
      <input type="text" class="form-control" id="name" placeholder="Character Name" v-model="save.header.name" required>
    </div>
    <div class="form-row">
      <div class="col-md-12">
        <div class="form-check form-check-inline">
          <label class="form-check-label"><input class="form-check-input" type="checkbox"
              v-model="save.header.status.expansion">Expansion</label>
        </div>
        <div class="form-check form-check-inline">
          <label class="form-check-label"><input class="form-check-input" type="checkbox"
              v-model="save.header.status.ladder">Ladder</label>
        </div>
        <div class="form-check form-check-inline">
          <label class="form-check-label"><input class="form-check-input" type="checkbox"
              v-model="save.header.status.hardcore">Hardcore</label>
        </div>
        <div class="form-check form-check-inline">
          <label class="form-check-label"><input class="form-check-input" type="checkbox"
              v-model="save.header.status.died">Dead</label>
        </div>
      </div>
    </div>
    <div class="form-row">
      <div class="col-md-2">
        <label for="Level">Level</label>
        <input type="number" class="form-control" id="Level" v-model.number="save.attributes.level" :min="min(12)"
          :max="max(12)" @input="change(12, save.attributes, 'level')">
      </div>
      <div class="col-md-2">
        <label for="Experience">Experience</label>
        <input type="number" class="form-control" id="Experience" v-model.number="save.attributes.experience">
      </div>
    </div>
    <div class="form-row">
      <div class="col-md-4">
        <label for="Life">Life</label>
        <div class="input-group">
          <input class="form-control" type="number" id="Life" v-model.number="save.attributes.hitpoints" :min="min(6)"
            :max="max(6)" @input="change(6, save.attributes, 'hitpoints')">
          <div class="input-group-prepend input-group-append">
            <div class="input-group-text">/</div>
          </div>
          <input class="form-control" type="number" id="MaxLife" v-model.number="save.attributes.maxhp" :min="min(7)"
            :max="max(7)" @input="change(7, save.attributes, 'maxhp')">
        </div>
      </div>
      <div class="col-md-4">
        <label for="Mana">Mana</label>
        <div class="input-group">
          <input class="form-control" type="number" id="Mana" v-model.number="save.attributes.mana" :min="min(8)"
            :max="max(8)" @input="change(8, save.attributes, 'mana')">
          <div class="input-group-prepend input-group-append">
            <div class="input-group-text">/</div>
          </div>
          <input class="form-control" type="number" id="MaxMana" v-model.number="save.attributes.maxmana" :min="min(9)"
            :max="max(9)" @input="change(9, save.attributes, 'maxmana')">
        </div>
      </div>
      <div class="col-md-4">
        <label for="Stamina">Stamina</label>
        <div class="input-group">
          <input class="form-control" type="number" id="Stamina" v-model.number="save.attributes.stamina" :min="min(6)"
                :max="max(6)" @input="change(6, save.attributes, 'stamina')">
          <div class="input-group-prepend input-group-append">
            <div class="input-group-text">/</div>
          </div>
          <input class="form-control" type="number" id="MaxStamina" v-model.number="save.attributes.maxstamina" :min="min(7)"
                :max="max(7)" @input="change(7, save.attributes, 'maxstamina')">
        </div>
      </div>
    </div>
    <div class="form-row">
      <div class="col-md-2">
        <label for="Strength">Strength</label>
        <input type="number" class="form-control" id="Strength" v-model.number="save.attributes.strength" :min="min(0)"
          :max="max(0)" @input="change(0, save.attributes, 'strength')">
      </div>
      <div class="col-md-2">
        <label for="Dexterity">Dexterity</label>
        <input type="number" class="form-control" id="Dexterity" v-model.number="save.attributes.dexterity" :min="min(2)"
          :max="max(2)" @input="change(2, save.attributes, 'dexterity')">
      </div>
      <div class="col-md-2">
        <label for="Vitality">Vitality</label>
        <input type="number" class="form-control" id="Vitality" v-model.number="save.attributes.vitality" :min="min(3)"
          :max="max(3)" @input="change(3, save.attributes, 'vitality')">
      </div>
      <div class="col-md-2">
        <label for="Energy">Energy</label>
        <input type="number" class="form-control" id="Energy" v-model.number="save.attributes.energy" :min="min(1)"
          :max="max(1)" @input="change(1, save.attributes, 'energy')">
      </div>
    </div>
    <div class="form-row">
      <div class="col-md-2">
        <label for="UnusedStatPoints">Unused Stat Points</label>
        <input type="number" class="form-control" id="UnusedStatPoints" v-model.number="save.attributes.statpts"
          :min="min(4)" :max="max(4)" @input="change(4, save.attributes, 'statpts')">
      </div>
      <div class="col-md-2">
        <label for="UnusedSkillPoints">Unused Skill Points</label>
        <input type="number" class="form-control" id="UnusedSkillPoints"
          v-model.number="save.attributes.newskills" :min="min(5)" :max="max(5)"
          @input="change(5, save.attributes, 'newskills')">
      </div>
    </div>
    <div class="form-row">
      <div class="col-md-2">
        <label for="Gold">Gold</label>
        <input type="number" class="form-control" id="Gold" v-model.number="save.attributes.gold" :min="min(14)"
          :max="max(14)" @input="change(14, save.attributes, 'gold')">
      </div>
      <div class="col-md-2">
        <label for="StashedGold">Stashed Gold</label>
        <input type="number" class="form-control" id="StashedGold" v-model.number="save.attributes.goldbank"
          :min="min(15)" :max="max(15)" @input="change(15, save.attributes, 'goldbank')">
      </div>
    </div>
    <div class="form-row">
      <div class="col-md-2">
        <label for="unused210">Kills</label>
        <input type="number" class="form-control" id="unused210" v-model.number="save.attributes.unused210" :min="min(14)"
          :max="max(14)" @input="change(14, save.attributes, 'unused210')">
      </div>
      <div class="col-md-2">
        <label for="pali_killtrack">Paladin Aura Kills ?</label>
        <input type="number" class="form-control" id="pali_killtrack" v-model.number="save.attributes.pali_killtrack" :min="min(14)"
          :max="max(14)" @input="change(14, save.attributes, 'unused210')">
      </div>
      <div class="col-md-2">
        <label for="unused211">Deaths</label>
        <input type="number" class="form-control" id="unused211" v-model.number="save.attributes.unused211"
          :min="min(15)" :max="max(15)" @input="change(15, save.attributes, 'unused211')">
      </div>
    </div>
  </div>
</template>

<script>
  import utils from '../utils.js';

  const xp = [0,500,1500,3750,7875,14175,22680,32886,44396,57715,72144,90180,112725,140906,176132,220165,275207,344008,430010,537513,671891,839864,1049830,1312287,1640359,2050449,2563061,3203826,3902260,4663553,5493363,6397855,7383752,8458379,9629723,10906488,12298162,13815086,15468534,17270791,19235252,21376515,23710491,26254525,29027522,32050088,35344686,38935798,42850109,47116709,51767302,56836449,62361819,68384473,74949165,82104680,89904191,98405658,107672256,117772849,128782495,140783010,153863570,168121381,183662396,200602101,219066380,239192444,261129853,285041630,311105466,339515048,370481492,404234916,441026148,481128591,524840254,572485967,624419793,681027665,742730244,809986056,883294891,963201521,1050299747,1145236814,1248718217,1361512946,1484459201,1618470619,1764543065,1923762030,2097310703,2286478756,2492671933,2717422497,2962400612,3229426756,3520485254,3837739017];

  export default {
    props: {
      save: Object,
    },
    data() {
      return {
        stats: window[`${window.work_mod}_constants_${window.work_version}`].magical_properties,
      }
    },
    watch: {
      "save.header.level": function(level, s) {
        const constants = window[`${window.work_mod}_constants_${window.work_version}`]
        this.save.attributes.level = level;
        this.save.attributes.experience = xp[level-1];

        const newLevel = level - s;
        this.save.attributes.statpts = (this.save.attributes.statpts ?? 0) + (newLevel * 5);
        this.save.attributes.newskills = (this.save.attributes.newskills ?? 0) + newLevel;
        for(const cCode in constants.classes) {
          const stat = constants.classes[cCode];
          if(stat.n === this.save.header.class) {
            this.save.attributes.maxhp += newLevel * stat.s.lpl / 4;
            this.save.attributes.hitpoints += newLevel * stat.s.lpl / 4;

            this.save.attributes.maxstamina += newLevel * stat.s.spl / 4;
            this.save.attributes.stamina += newLevel * stat.s.spl / 4;

            this.save.attributes.maxmana += newLevel * stat.s.mpl / 4;
            this.save.attributes.mana += newLevel * stat.s.mpl / 4;
            break;
          }
        }
      },
      "save.attributes.vitality": function(val, old) {
        const constants = window[`${window.work_mod}_constants_${window.work_version}`]
        const change = val-old;
        for (const cCode in constants.classes) {
          const stat = constants.classes[cCode];
          if (stat.n === this.save.header.class) {
            this.save.attributes.maxhp += change * stat.s.lpv / 4;
            this.save.attributes.hitpoints += change * stat.s.lpv / 4;

            this.save.attributes.maxstamina += change * stat.s.spv / 4;
            this.save.attributes.stamina += change * stat.s.spv / 4;
            break;
          }
        }
      },
      "save.attributes.energy": function(val, old) {
        const constants = window[`${window.work_mod}_constants_${window.work_version}`]
        const change = val-old;
        for (const cCode in constants.classes) {
          const stat = constants.classes[cCode];
          if (stat.n === this.save.header.class) {
            this.save.attributes.maxmana += change * stat.s.mpe / 4;
            this.save.attributes.mana += change * stat.s.mpe / 4;
            break;
          }
        }
      },
    },
    methods: {
      max(id) {
        let stat = this.stats[id];
        let s = utils.shift(1, stat.cB) - 1;
        if (stat.vS) {
          s = Math.floor(utils.shift(s, -stat.vS))
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
    }
  };  
</script>
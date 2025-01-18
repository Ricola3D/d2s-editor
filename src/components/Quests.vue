<template>
  <div class="form-row">
    <div v-for="(difficulty, i) in difficulties" :key="i" class="col-md-4">
      <ul>
        <li>
          <label
            ><input
              v-model="difficulty.completed"
              class="form-check-input"
              type="checkbox"
              @input="updateDifficulty(difficulty, $event.target.checked)"
            />{{ difficulty.label }}</label
          >
          <button
            type="button"
            class="btn btn-link btn-sm"
            title="Reset all flags for this Difficulty"
            @click="updateDifficulty(difficulty, false)"
          >
            <i class="fa fa-undo"></i>
          </button>
        </li>
        <ul v-for="(act, j) in difficulty.acts" :key="j">
          <li>
            <label
              ><input
                v-model="act.completed"
                class="form-check-input"
                type="checkbox"
                @input="updateAct(difficulty, act, $event.target.checked)"
              />{{ act.label }}</label
            >
            <button
              type="button"
              class="btn btn-link btn-sm"
              title="Reset all flags for this Act"
              @click="updateAct(difficulty, act, false)"
            >
              <i class="fa fa-undo"></i>
            </button>
          </li>
          <ul v-for="(quest, k) in act.quests" :key="k">
            <li>
              <!-- <label>{{ quest.label }}</label> -->
              <label
                ><input
                  v-model="quest.checked"
                  class="form-check-input"
                  type="checkbox"
                  @input="updateQuest(difficulty, act, quest, $event.target.checked)"
                />{{ quest.label }}</label
              >
              <button
                type="button"
                class="btn btn-link"
                title="Reset all flags for this Quest"
                @click="updateQuest(difficulty, act, quest, false)"
              >
                <i class="fa fa-undo"></i>
              </button>
            </li>
            <ul>
              <li v-for="(flag, l) in quest.flags" :key="l">
                <label class="figure-caption"
                  ><input
                    class="form-check-input"
                    type="checkbox"
                    :checked="save.header[difficulty.key][act.key][quest.key][flag.key]"
                    @click="updateFlag(difficulty, act, quest, flag, $event.target.checked)"
                  />{{ flag.label }}</label
                >
              </li>
            </ul>
          </ul>
          <ul v-if="j == 4">
            <li>
              <label
                ><input
                  v-model="act.reset_consumed"
                  class="form-check-input"
                  type="checkbox"
                  @input="updateResetConsumed(difficulty, $event.target.checked)"
                />Reset stat/skill consumed</label
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

const flagsDef = [
  'b0_is_completed',
  'b1_is_requirement_completed', // For ex for Shenk Q, Larzuk socket Q available
  'b2_is_received', // I received quest from PNJ
  'b3_left_town', // I left town with quest activated
  'b4_entered_area', // I enter quest area
  'b5_custom1',
  'b6_custom2',
  'b7_custom3', // For ex for "Prison of Ice" it is consumed scroll or not
  'b8_custom4',
  'b9_custom5',
  'b10_custom6',
  'b11_custom7',
  'b12_closed', // Box in the quest menu is greyed
  'b13_done_recently', // Cleared by this party in this game
  'b14_completed_now', // Another party completed the requirements in this game. if not 13, I cannot complete this quest in this game. If 13 (ex: Forgotten tower completed by a teamate), ignore
  'b15_completed_before', // I completed the quest requirements in a previous game & there was a reward & reward had not been used in the same game but later or not yet.
].map((str) => ({ key: str }));

const questsDefinition = [
  {
    key: 'act_i',
    label: 'Act I',
    complete: false,
    quests: [
      {
        key: 'den_of_evil',
        label: 'Den Of Evil',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'sisters_burial_grounds',
        label: "Sisters' Burial Grounds",
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'the_search_for_cain',
        label: 'Search for Cain',
        flags: [
          { key: 'b10_custom6', label: 'Cow King Killed' },
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'the_forgotten_tower',
        label: 'The Forgotten Tower',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'tools_of_the_trade',
        label: 'Tools of the Trade',
        flags: [
          { key: 'b0_is_completed', label: 'Consumed Imbue' },
          { key: 'b1_is_requirement_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'sisters_to_the_slaughter',
        label: 'Sisters to the Slaughter',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
    ],
  },
  {
    key: 'act_ii',
    label: 'Act II',
    completed: false,
    quests: [
      {
        key: 'radaments_lair',
        label: "Radament's Lair",
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'the_horadric_staff',
        label: 'The Horadric Staff',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'tainted_sun',
        label: 'Tainted Sun',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'arcane_sanctuary',
        label: 'Arcane Sanctuary',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'the_summoner',
        label: 'The Summoner',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'the_seven_tombs',
        label: 'The Seven Tombs',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
    ],
  },
  {
    key: 'act_iii',
    label: 'Act III',
    completed: false,
    quests: [
      {
        key: 'the_golden_bird',
        label: 'The Golden Bird',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'blade_of_the_old_religion',
        label: 'Blade of the Old Religion',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'khalims_will',
        label: "Khalim's Will",
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'lam_esens_tome',
        label: "Lam Esen's Tome",
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'the_blackened_temple',
        label: 'The Blackened Temple',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'the_guardian',
        label: 'The Guardian',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
    ],
  },
  {
    key: 'act_iv',
    label: 'Act IV',
    completed: false,
    quests: [
      {
        key: 'the_fallen_angel',
        label: 'Fallen Angel',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'hellforge',
        label: "Hell's Forge",
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'terrors_end',
        label: "Terror's End",
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
    ],
  },
  {
    key: 'act_v',
    label: 'Act V',
    completed: false,
    reset_consumed: false,
    quests: [
      {
        key: 'siege_on_harrogath',
        label: 'Siege on Harrogath',
        flags: [
          { key: 'b0_is_completed', label: 'Consumed Larzuk Q' },
          { key: 'b1_is_requirement_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'rescue_on_mount_arreat',
        label: 'Rescue on Mount Arreat',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'prison_of_ice',
        label: 'Prison of Ice',
        flags: [
          { key: 'b7_custom3', label: 'Consumed Scroll' },
          { key: 'b0_is_completed', label: 'Consumed Personalize' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'betrayal_of_harrogath',
        label: 'Betrayal of Harrogath',
        flags: [
          { key: 'b0_is_completed', label: 'Consumed Personalize' },
          { key: 'b1_is_requirement_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'rite_of_passage',
        label: 'Rite of Passage',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
      {
        key: 'eve_of_destruction',
        label: 'Eve of Destruction',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b12_closed', label: 'Closed' },
        ],
        checked: false,
      },
    ],
  },
];

export default {
  name: 'QuestTab',
  props: {
    save: Object,
  },
  data() {
    return {
      difficulties: [
        {
          key: 'quests_normal',
          completed: false,
          label: 'Normal',
          acts: cloneDeep(questsDefinition),
        },
        {
          key: 'quests_nm',
          completed: false,
          label: 'Nightmare',
          acts: cloneDeep(questsDefinition),
        },
        {
          key: 'quests_hell',
          completed: false,
          label: 'Hell',
          acts: cloneDeep(questsDefinition),
        },
      ],
    };
  },
  watch: {
    save: {
      handler: function (newSave /*, oldSave*/) {
        // Update difficulty all & act all checkboxes
        this.propagate(null, null, null, null, newSave);
      },
      deep: true,
    },
  },
  methods: {
    changeAttributes(save, applyOrReset, attributes, amount) {
      if (!applyOrReset) {
        amount *= -1;
      }
      for (const attribute of attributes) {
        save.attributes[attribute] = (save.attributes[attribute] == null ? 0 : save.attributes[attribute]) + amount;
      }
    },
    getQuestFlagsToUpdate(quest, value) {
      let toUpdateFlags = null;
      if (value) {
        toUpdateFlags = quest.flags;
        if (quest.key == 'the_search_for_cain') {
          toUpdateFlags = toUpdateFlags.filter((flag) => flag.key != 'b10_custom6'); // Not Cow King killed
        } else if (quest.key == 'tools_of_the_trade') {
          toUpdateFlags = toUpdateFlags.filter((flag) => flag.key == 'b1_is_requirement_completed'); // Just requirements met, let imbue available
        } else if (quest.key == 'hellforge') {
          toUpdateFlags = toUpdateFlags.filter((flag) => flag.key == 'b1_is_requirement_completed'); // Just requirements met, let imbue available
        } else if (quest.key == 'siege_on_harrogath') {
          toUpdateFlags = toUpdateFlags.filter((flag) => flag.key == 'b1_is_requirement_completed'); // Just requirements met, let socket Q available
        } else if (quest.key == 'betrayal_of_harrogath') {
          toUpdateFlags = toUpdateFlags.filter((flag) => flag.key == 'b1_is_requirement_completed'); // Just requirements met, let personalize available
        }
      } else {
        toUpdateFlags = flagsDef;
      }
      return toUpdateFlags;
    },
    checkRewards(save, quest, applyOrReset) {
      if (['den_of_evil', 'radaments_lair'].indexOf(quest.key) > -1) {
        this.changeAttributes(save, applyOrReset, ['newskills'], 1);
      } else if (quest.key === 'the_fallen_angel') {
        this.changeAttributes(save, applyOrReset, ['newskills'], 2);
      } else if (quest.key === 'lam_esens_tome') {
        this.changeAttributes(save, applyOrReset, ['statpts'], 5);
      } else if (quest.key === 'the_golden_bird') {
        this.changeAttributes(save, applyOrReset, ['hitpoints', 'maxhp'], 20);
      }
    },
    propagate(difficulty, act, quest, flag, newSave, direction) {
      // console.log("Propagate d=" + (difficulty ? difficulty.key : "none") + " a=" + (act ? act.key : "none") + " q=" + (quest ? quest.key : "none") + " f=" + (flag ? flag.key : "none") + " d=" + direction)
      if (difficulty) {
        if (act) {
          if (quest) {
            if (flag) {
              // Case 1 - Flag
              if (direction == 'down') {
                if (flag.key == 'b0_is_completed' && newSave.header[difficulty.key][act.key][quest.key][flag.key] != quest.checked) {
                  // If completed changes, add/remove rewards
                  this.checkRewards(newSave, quest, quest.checked);
                }
                newSave.header[difficulty.key][act.key][quest.key][flag.key] = quest.checked;
              }

              if (act.key == 'act_i' && quest.key == 'den_of_evil' && flag.key == 'b0_is_completed') {
                const completed = newSave.header[difficulty.key][act.key][quest.key][flag.key];
                difficulty.acts[4].reset_consumed = !completed;
                newSave.header[difficulty.key].act_v.reset_consumed = !completed;
              }

              // Recursion
              if (direction != 'down') {
                // Check for ending
                this.propagate(difficulty, act, quest, null, newSave, 'up');
              }
            } else {
              // Case 2 - Quest
              if (direction == 'up') {
                if (
                  newSave.header[difficulty.key][act.key][quest.key].b0_is_completed ||
                  newSave.header[difficulty.key][act.key][quest.key].b1_is_requirement_completed
                ) {
                  // Quest is checked
                  quest.checked = true;
                } else {
                  // Quest is unchecked
                  quest.checked = false;
                }
              } else if (direction == 'down') {
                if (!act.completed || quest.key != 'hellforge') {
                  // Keep hellforge available
                  quest.checked = act.completed;
                }
              }

              // Recursion
              if (direction != 'down') {
                // Check for ending
                this.propagate(difficulty, act, null, null, newSave, 'up');
              }
              if (direction != 'up') {
                // Check for ending
                if (!act.completed || quest.key != 'hellforge') {
                  // Keep hellforge available
                  const toUpdateFlags = this.getQuestFlagsToUpdate(quest, quest.checked);
                  for (const f of toUpdateFlags) {
                    this.propagate(difficulty, act, quest, f, newSave, 'down');
                  }
                }
              }
            }
          } else {
            // Case 3 - Act
            if (direction == 'up') {
              let actCompleted = true;
              for (const q of act.quests) {
                // Act is complete only if all quests are checked
                actCompleted &= q.checked;
              }
              act.completed = actCompleted;
              newSave.header[difficulty.key][act.key].completed = actCompleted;
            } else if (direction == 'down') {
              act.completed = difficulty.completed;
              newSave.header[difficulty.key][act.key].completed = difficulty.completed;
            }

            // Recursion
            if (direction != 'up') {
              // Check for ending
              for (const q of act.quests) {
                this.propagate(difficulty, act, q, null, newSave, 'down');
              }
            }
          }
        } else {
          // Case 4 - Difficulty
          if (direction == 'up') {
            let difficultyCompleted = true;
            for (const a of difficulty.acts) {
              // Act is complete only if all quests are checked
              difficultyCompleted &= a.completed;
            }
            difficulty.completed = difficultyCompleted;
            newSave.header[difficulty.key].completed = difficultyCompleted;
          }

          // Recursion
          if (direction != 'up') {
            for (const a of difficulty.acts) {
              this.propagate(difficulty, a, null, null, newSave, 'down');
            }
          }
        }
      } else {
        // Case 5 - whole save changed, just update the boxe
        for (const [i, difficulty] of this.difficulties.entries()) {
          let isDifficultyAll = true;
          for (const [j, act] of difficulty.acts.entries()) {
            let isActAll = true;
            for (const quest of act.quests) {
              // console.log(difficulty.key + " " + act.key + " " + quest.key)
              // console.log(newSave.header[difficulty.key][act.key][quest.key])
              if (
                newSave.header[difficulty.key][act.key][quest.key].b0_is_completed ||
                newSave.header[difficulty.key][act.key][quest.key].b1_is_requirement_completed
              ) {
                // console.log("Quest true")
                quest.checked = true;
              } else {
                // console.log("Quest false")
                quest.checked = false;
                isActAll = false;
                isDifficultyAll = false;
              }
            }
            this.difficulties[i].acts[j].completed = isActAll;
          }
          this.difficulties[i].completed = isDifficultyAll;
        }
      }
    },
    updateResetConsumed(difficulty, value) {
      const newSave = cloneDeep(this.save);

      // difficulty.act[4].reset_consumed = value
      newSave.header[difficulty.key].act_v.reset_consumed = value;

      if (!value) {
        // Reset stat/skill requires to have completed A1Q1
        newSave.header[difficulty.key].act_i.den_of_evil.b0_is_completed = true;
        newSave.header[difficulty.key].act_i.den_of_evil.b12_closed = true;

        this.propagate(
          difficulty,
          difficulty.acts[0],
          difficulty.acts[0].quests[0],
          difficulty.acts[0].quests[0].flags.find((f) => f.key == 'b0_is_completed'),
          newSave,
        );
      }

      // Emit the modification
      this.$emit('update:save', newSave);
    },
    updateFlag(difficulty, act, quest, flag, value) {
      const newSave = cloneDeep(this.save);

      if (flag.key == 'b0_is_completed' && newSave.header[difficulty.key][act.key][quest.key][flag.key] != value) {
        // Completed changes, add/remove rewards
        this.checkRewards(newSave, quest, value);
      }

      newSave.header[difficulty.key][act.key][quest.key][flag.key] = value;

      // Closed => completed
      if (flag.key == 'b12_closed' && value) {
        newSave.header[difficulty.key][act.key][quest.key].b0_is_completed = true;
      }

      // Not completed or requirements complete => not closed
      if (
        !newSave.header[difficulty.key][act.key][quest.key].b0_is_completed ||
        !newSave.header[difficulty.key][act.key][quest.key].b1_is_requirement_completed
      ) {
        newSave.header[difficulty.key][act.key][quest.key].b12_closed = false;
      }

      this.propagate(difficulty, act, quest, flag, newSave);

      // Emit the modification
      this.$emit('update:save', newSave);
    },
    updateQuest(difficulty, act, quest, value) {
      const newSave = cloneDeep(this.save);

      quest.checked = value;

      this.propagate(difficulty, act, quest, null, newSave);

      // Emit the modification
      this.$emit('update:save', newSave);
    },
    updateAct(difficulty, act, value) {
      const newSave = cloneDeep(this.save);

      act.completed = value;
      newSave.header[difficulty.key][act.key].completed = value;

      this.propagate(difficulty, act, null, null, newSave);

      // Emit the modification
      this.$emit('update:save', newSave);
    },
    updateDifficulty(difficulty, value) {
      const newSave = cloneDeep(this.save);

      difficulty.completed = value;

      this.propagate(difficulty, null, null, null, newSave);

      // Emit the modification
      this.$emit('update:save', newSave);
    },
  },
};
</script>

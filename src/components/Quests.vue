<template>
  <div class="form-row">
    <div v-for="(difficulty, i) in difficulties" :key="i" class="col-md-4">
      <ul>
        <li>
          <label
            ><input
              v-model="difficulty.all"
              class="form-check-input"
              type="checkbox"
              @input="updateDifficulty(difficulty, $event.target.checked)"
            />{{ difficulty.label }}</label
          >
          <button
            type="button"
            class="btn btn-link btn-sm"
            title="Reset all flags for this Difficulty"
            @click="updateDifficulty(difficulty, false, false)"
          >
            <i class="fa fa-undo"></i>
          </button>
        </li>
        <ul v-for="(act, j) in difficulty.acts" :key="j">
          <li>
            <label
              ><input
                v-model="act.all"
                class="form-check-input"
                type="checkbox"
                @input="updateAct(difficulty, act, $event.target.checked)"
              />{{ act.label }}</label
            >
            <button
              type="button"
              class="btn btn-link btn-sm"
              title="Reset all flags for this Act"
              @click="updateAct(difficulty, act, false, false)"
            >
              <i class="fa fa-undo"></i>
            </button>
          </li>
          <ul v-for="(quest, k) in act.quests" :key="k">
            <li>
              <label>{{ quest.label }}</label>
              <button
                type="button"
                class="btn btn-link"
                title="Reset all flags for this Quest"
                @click="updateQuest(difficulty, act, quest, false, false)"
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
                    :checked="
                      save.header[difficulty.key][act.key][quest.key][flag.key]
                    "
                    @click="
                      updateFlag(
                        difficulty,
                        act,
                        quest,
                        flag,
                        $event.target.checked
                      )
                    "
                  />{{ flag.label }}</label
                >
              </li>
            </ul>
          </ul>
        </ul>
      </ul>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'

const flagsDef = [
  'b0_is_completed',
  'b1_is_requirement_completed',
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
].map((str) => ({ key: str }))

const questsDefinition = [
  {
    key: 'act_i',
    label: 'Act I',
    all: false,
    quests: [
      {
        key: 'den_of_evil',
        label: 'Den Of Evil',
        flags: [
          { key: 'b0_is_completed', label: 'Completed' },
          { key: 'b13_done_recently', label: 'Done Rencently' },
        ],
      },
      {
        key: 'sisters_burial_grounds',
        label: "Sisters' Burial Grounds",
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'the_search_for_cain',
        label: 'Search for Cain',
        flags: [
          { key: 'b10_custom6', label: 'Cow King Killed' },
          { key: 'b0_is_completed', label: 'Completed' },
        ],
      },
      {
        key: 'the_forgotten_tower',
        label: 'The Forgotten Tower',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'tools_of_the_trade',
        label: 'Tools of the Trade',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'sisters_to_the_slaughter',
        label: 'Sisters to the Slaughter',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
    ],
  },
  {
    key: 'act_ii',
    label: 'Act II',
    all: false,
    quests: [
      {
        key: 'radaments_lair',
        label: "Radament's Lair",
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'the_horadric_staff',
        label: 'The Horadric Staff',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'tainted_sun',
        label: 'Tainted Sun',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'arcane_sanctuary',
        label: 'Arcane Sanctuary',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'the_summoner',
        label: 'The Summoner',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'the_seven_tombs',
        label: 'The Seven Tombs',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
    ],
  },
  {
    key: 'act_iii',
    label: 'Act III',
    all: false,
    quests: [
      {
        key: 'the_golden_bird',
        label: 'The Golden Bird',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'blade_of_the_old_religion',
        label: 'Blade of the Old Religion',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'khalims_will',
        label: "Khalim's Will",
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'lam_esens_tome',
        label: "Lam Esen's Tome",
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'the_blackened_temple',
        label: 'The Blackened Temple',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'the_guardian',
        label: 'The Guardian',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
    ],
  },
  {
    key: 'act_iv',
    label: 'Act IV',
    all: false,
    quests: [
      {
        key: 'the_fallen_angel',
        label: 'Fallen Angel',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'hellforge',
        label: "Hell's Forge",
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'terrors_end',
        label: "Terror's End",
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
    ],
  },
  {
    key: 'act_v',
    label: 'Act V',
    all: false,
    quests: [
      {
        key: 'siege_on_harrogath',
        label: 'Siege on Harrogath',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'rescue_on_mount_arreat',
        label: 'Rescue on Mount Arreat',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'prison_of_ice',
        label: 'Prison of Ice',
        flags: [
          { key: 'b7_custom3 ', label: 'Consumed Scroll' },
          { key: 'b0_is_completed', label: 'Completed' },
        ],
      },
      {
        key: 'betrayal_of_harrogath',
        label: 'Betrayal of Harrogath',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'rite_of_passage',
        label: 'Rite of Passage',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
      {
        key: 'eve_of_destruction',
        label: 'Eve of Destruction',
        flags: [{ key: 'b0_is_completed', label: 'Completed' }],
      },
    ],
  },
]

export default {
  props: {
    save: Object,
  },
  data() {
    return {
      difficulties: [
        {
          key: 'quests_normal',
          all: false,
          label: 'Normal',
          acts: cloneDeep(questsDefinition),
        },
        {
          key: 'quests_nm',
          all: false,
          label: 'Nightmare',
          acts: cloneDeep(questsDefinition),
        },
        {
          key: 'quests_hell',
          all: false,
          label: 'Hell',
          acts: cloneDeep(questsDefinition),
        },
      ],
    }
  },
  watch: {
    save: {
      handler: function (newSave /*, oldSave*/) {
        // Update difficulty all & act all checkboxes
        for (const [i, difficulty] of this.difficulties.entries()) {
          let isDifficultyAll = true
          for (const [j, act] of difficulty.acts.entries()) {
            let isActAll = true
            for (const quest of act.quests) {
              if (
                !newSave.header[difficulty.key][act.key][quest.key]
                  .b0_is_completed
              ) {
                isActAll = false
                isDifficultyAll = false
              }
            }
            this.difficulties[i].acts[j].all = isActAll
          }
          this.difficulties[i].all = isDifficultyAll
        }
      },
      deep: true,
    },
  },
  methods: {
    changeAttributes(save, applyOrReset, attributes, amount) {
      if (!applyOrReset) {
        amount *= -1
      }
      for (const attribute of attributes) {
        save.attributes[attribute] =
          (save.attributes[attribute] == null
            ? 0
            : save.attributes[attribute]) + amount
      }
    },
    checkRewards(save, quest, applyOrReset) {
      if (['den_of_evil', 'radaments_lair'].indexOf(quest.key) > -1) {
        this.changeAttributes(save, applyOrReset, ['newskills'], 1)
      } else if (quest.key === 'the_fallen_angel') {
        this.changeAttributes(save, applyOrReset, ['newskills'], 2)
      } else if (quest.key === 'lam_esens_tome') {
        this.changeAttributes(save, applyOrReset, ['statpts'], 5)
      } else if (quest.key === 'the_golden_bird') {
        this.changeAttributes(save, applyOrReset, ['hitpoints', 'maxhp'], 20)
      }
    },
    updateFlag(difficulty, act, quest, flag, value) {
      const newSave = cloneDeep(this.save)

      // Uncheck Act checkbox if needed
      if (act.all !== value && act.all) {
        act.all = false
      }
      // Uncheck difficulty checkbox if needed
      if (difficulty.all !== value && difficulty.all) {
        difficulty.all = false
      }

      // If "completed" state changes, apply or remove the quest rewards.
      if (
        flag.key === 'b0_is_completed' &&
        value !== newSave.header[difficulty.key][act.key][quest.key][flag.key]
      ) {
        this.checkRewards(newSave, quest, value)
      }

      newSave.header[difficulty.key][act.key][quest.key][flag.key] = value

      // Emit the modification
      this.$emit('update:save', newSave)
    },
    updateQuest(difficulty, act, quest, value, onlyVisible = true) {
      const newSave = cloneDeep(this.save)

      // Uncheck Act checkbox if needed
      if (act.all !== value && act.all) {
        act.all = false
      }
      // Uncheck difficulty checkbox if needed
      if (difficulty.all !== value && difficulty.all) {
        difficulty.all = false
      }

      // If "completed" state changes, apply or remove the quest rewards.
      if (
        value !==
        newSave.header[difficulty.key][act.key][quest.key].b0_is_completed
      ) {
        this.checkRewards(newSave, quest, value)
      }

      const toUpdateFlags = onlyVisible ? quest.flags : flagsDef
      for (const flag of toUpdateFlags) {
        newSave.header[difficulty.key][act.key][quest.key][flag.key] = value
      }

      // Emit the modification
      this.$emit('update:save', newSave)
    },
    updateAct(difficulty, act, value, onlyVisible = true) {
      const newSave = cloneDeep(this.save)

      for (const quest of act.quests) {
        // If "completed" state changes, apply or remove the quest rewards.
        if (
          value !==
          newSave.header[difficulty.key][act.key][quest.key].b0_is_completed
        ) {
          this.checkRewards(newSave, quest, value)
        }
        const toUpdateFlags = onlyVisible ? quest.flags : flagsDef
        for (const flag of toUpdateFlags) {
          newSave.header[difficulty.key][act.key][quest.key][flag.key] = value
        }
      }

      // Emit the modification
      this.$emit('update:save', newSave)
    },
    updateDifficulty(difficulty, value, onlyVisible = true) {
      const newSave = cloneDeep(this.save)

      for (const act of difficulty.acts) {
        // Update act checkbox
        act.all = value

        for (const quest of act.quests) {
          // If "completed" state changes, apply or remove the quest rewards.
          if (
            value !==
            newSave.header[difficulty.key][act.key][quest.key].b0_is_completed
          ) {
            this.checkRewards(newSave, quest, value)
          }
          const toUpdateFlags = onlyVisible ? quest.flags : flagsDef
          for (const flag of toUpdateFlags) {
            newSave.header[difficulty.key][act.key][quest.key][flag.key] = value
          }
        }
      }

      // Emit the modification
      this.$emit('update:save', newSave)
    },
  },
}
</script>

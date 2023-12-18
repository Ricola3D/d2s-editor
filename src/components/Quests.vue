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
                            @input="
                                updateDiff(difficulty, $event.target.checked)
                            "
                        />{{ difficulty.label }}</label
                    >
                </li>
                <ul v-for="(act, j) in difficulty.acts" :key="j">
                    <li>
                        <label
                            ><input
                                v-model="act.all"
                                class="form-check-input"
                                type="checkbox"
                                @input="
                                    updateAct(
                                        difficulty,
                                        act,
                                        $event.target.checked
                                    )
                                "
                            />{{ act.label }}</label
                        >
                    </li>
                    <ul v-for="(quest, k) in act.quests" :key="k">
                        <li>
                            <label>{{ quest.label }}</label>
                        </li>
                        <ul>
                            <li v-for="(state, l) in quest.values" :key="l">
                                <label class="figure-caption"
                                    ><input
                                        class="form-check-input"
                                        type="checkbox"
                                        :checked="
                                            save.header[difficulty.key][
                                                act.key
                                            ][quest.key][state.key]
                                        "
                                        @click="
                                            updateQuest(
                                                difficulty,
                                                act,
                                                quest,
                                                state,
                                                $event.target.checked
                                            )
                                        "
                                    />{{ state.label }}</label
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
const flags = [
    'b0_is_completed',
    'b1_is_requirement_completed',
    'b2_is_received',
    'b3_left_town',
    'b4_entered_area',
    'b5_custom1',
    'b6_custom2',
    'b7_custom3', // For ex for "Prison of Ice" it is consumed scroll or not
    'b8_custom4',
    'b9_custom5',
    'b10_custom6',
    'b11_custom7',
    'b12_closed',
    'b13_done_recently',
    'b14_completed_now',
    'b15_completed_before',
]

const questsDefinition = [
    {
        key: 'act_i',
        label: 'Act I',
        all: false,
        quests: [
            {
                key: 'den_of_evil',
                label: 'Den Of Evil',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'sisters_burial_grounds',
                label: "Sisters' Burial Grounds",
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'the_search_for_cain',
                label: 'Search for Cain',
                values: [
                    { key: 'b10_custom6', label: 'Cow King Killed' },
                    { key: 'b0_is_completed', label: 'Completed' },
                ],
            },
            {
                key: 'the_forgotten_tower',
                label: 'The Forgotten Tower',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'tools_of_the_trade',
                label: 'Tools of the Trade',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'sisters_to_the_slaughter',
                label: 'Sisters to the Slaughter',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
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
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'the_horadric_staff',
                label: 'The Horadric Staff',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'tainted_sun',
                label: 'Tainted Sun',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'arcane_sanctuary',
                label: 'Arcane Sanctuary',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'the_summoner',
                label: 'The Summoner',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'the_seven_tombs',
                label: 'The Seven Tombs',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
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
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'blade_of_the_old_religion',
                label: 'Blade of the Old Religion',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'khalims_will',
                label: "Khalim's Will",
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'lam_esens_tome',
                label: "Lam Esen's Tome",
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'the_blackened_temple',
                label: 'The Blackened Temple',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'the_guardian',
                label: 'The Guardian',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
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
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'hellforge',
                label: "Hell's Forge",
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'terrors_end',
                label: "Terror's End",
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
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
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'rescue_on_mount_arreat',
                label: 'Rescue on Mount Arreat',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'prison_of_ice',
                label: 'Prison of Ice',
                values: [
                    { key: 'b7_custom3 ', label: 'Consumed Scroll' },
                    { key: 'b0_is_completed', label: 'Completed' },
                ],
            },
            {
                key: 'betrayal_of_harrogath',
                label: 'Betrayal of Harrogath',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'rite_of_passage',
                label: 'Rite of Passage',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
            },
            {
                key: 'eve_of_destruction',
                label: 'Eve of Destruction',
                values: [{ key: 'b0_is_completed', label: 'Completed' }],
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
                    acts: JSON.parse(JSON.stringify(questsDefinition)),
                },
                {
                    key: 'quests_nm',
                    all: false,
                    label: 'Nightmare',
                    acts: JSON.parse(JSON.stringify(questsDefinition)),
                },
                {
                    key: 'quests_hell',
                    all: false,
                    label: 'Hell',
                    acts: JSON.parse(JSON.stringify(questsDefinition)),
                },
            ],
        }
    },
    watch: {
        save: {
            handler: function (newSave, oldSave) {
                // Update difficulty all & act all checkboxes
                for (const [i, difficulty] of this.difficulties.entries()) {
                    let isDifficultyAll = true
                    for (const [j, act] of difficulty.acts.entries()) {
                        let isActAll = true
                        for (const quest of act.quests) {
                            if (
                                !newSave.header[difficulty.key][act.key][
                                    quest.key
                                ].b0_is_completed
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
        questReward(save, applyOrReset, attributes, amount) {
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
        questRewards(save, quest, applyOrReset) {
            if (['den_of_evil', 'radaments_lair'].indexOf(quest.key) > -1) {
                this.questReward(save, applyOrReset, ['newskills'], 1)
            } else if (quest.key === 'the_fallen_angel') {
                this.questReward(save, applyOrReset, ['newskills'], 2)
            } else if (quest.key === 'lam_esens_tome') {
                this.questReward(save, applyOrReset, ['statpts'], 5)
            } else if (quest.key === 'the_golden_bird') {
                this.questReward(save, applyOrReset, ['hitpoints', 'maxhp'], 20)
            }
        },
        updateQuest(difficulty, act, quest, state, value) {
            const newSave = JSON.parse(JSON.stringify(this.save))

            // Uncheck Act checkbox if needed
            if (act.all !== value && act.all) {
                act.all = false
            }
            // Uncheck difficulty checkbox if needed
            if (difficulty.all !== value && difficulty.all) {
                difficulty.all = false
            }

            // If state changes, apply or remove the quest rewards. Works because those quests have a single state.
            if (
                value !==
                newSave.header[difficulty.key][act.key][quest.key][state.key]
            ) {
                this.questRewards(newSave, quest, value)
            }

            newSave.header[difficulty.key][act.key][quest.key][state.key] =
                value

            // Emit the modification
            this.$emit('update:save', newSave)
        },
        updateDiff(difficulty, value) {
            const newSave = JSON.parse(JSON.stringify(this.save))

            for (const act of difficulty.acts) {
                // Update act checkbox
                act.all = value

                for (const quest of act.quests) {
                    for (const state of quest.values) {
                        // If state changes, apply or remove the quest rewards. Works because those quests have a single state.
                        if (
                            value !==
                            newSave.header[difficulty.key][act.key][quest.key][
                                state.key
                            ]
                        ) {
                            this.questRewards(newSave, quest, value)
                        }

                        newSave.header[difficulty.key][act.key][quest.key][
                            state.key
                        ] = value
                    }
                }
            }

            // Emit the modification
            this.$emit('update:save', newSave)
        },
        updateAct(difficulty, act, value) {
            const newSave = JSON.parse(JSON.stringify(this.save))

            for (const quest of act.quests) {
                for (const state of quest.values) {
                    // If state changes, apply or remove the quest rewards. Works because those quests have a single state.
                    if (
                        value !==
                        newSave.header[difficulty.key][act.key][quest.key][
                            state.key
                        ]
                    ) {
                        this.questRewards(newSave, quest, value)
                    }

                    newSave.header[difficulty.key][act.key][quest.key][
                        state.key
                    ] = value
                }
            }

            // Emit the modification
            this.$emit('update:save', newSave)
        },
    },
}
</script>

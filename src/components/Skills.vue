<template>
    <div>
        <div class="form-row">
            <div v-for="i in 3" class="col-md-4">
                <div class="row">
                    <div v-for="j in 10" class="col-md-6">
                        <label :for="'Skill' + i + '_' + j">{{
                            save.skills[(i - 1) * 10 + (j - 1)].name
                        }}</label>
                        <input
                            :id="'Skill' + i + '_' + j"
                            v-model.number="
                                save.skills[(i - 1) * 10 + (j - 1)].points
                            "
                            type="number"
                            class="form-control"
                            min="0"
                            max="20"
                        />
                    </div>
                </div>
            </div>
        </div>
        <br />
        <div class="form-row">
            <div class="input-group">
                <div class="input-group-prepend">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="setAll()"
                    >
                        Set All To
                    </button>
                </div>
                <input v-model="allSkills" type="number" min="0" max="20" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        save: Object,
    },
    data() {
        return {
            allSkills: null,
        }
    },
    methods: {
        setAll() {
            if (this.allSkills === null || this.allSkills === undefined) return
            for (const skill of this.save.skills) {
                skill.points = this.allSkills
            }
            this.allSkills = null
        },
    },
}
</script>

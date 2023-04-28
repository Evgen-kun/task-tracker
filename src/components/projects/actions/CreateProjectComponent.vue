<template>
    <v-card
    color="#A5A8E9"
    width="100%"
    @click="show = !show"
    height="200"
    rounded="xl"
    class="elevation-0"
  >
    <v-img
      src='../assets/plus-icon-plus.png'
      class="align-end"
      height="200px"
    >
    </v-img>

   <v-card-title>{{ title }}</v-card-title>

   <v-dialog
      v-model="show"
      max-width="1000"
      transition="dialog-top-transition"
    >
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-toolbar
            color="primary"
            title="Создание проекта"
          ></v-toolbar>
          <v-card-text>
            <v-form ref="createProjectForm" @submit.prevent="createProject">
              <v-container>

                <v-text-field
                  label="Название*"
                  v-model="projectTitle"
                  :rules="titleRules"
                  required
                >
                </v-text-field>

                <v-textarea label="Описание" :rules="textRules" v-model="projectSubtitle"></v-textarea>

                <v-select
                  label="Команда"
                  :items="teamsWithID"
                  item-title="titleWithID"
                  item-value="id"
                  v-model="projectTeamID"
                >
                </v-select>

                <v-text-field
                  label="Ограничение на количество задач со статусом 'Выполняется'"
                  v-model="projectInProgressRestriction"
                  type="number"
                  :rules="inProgressRestrictionRules"
                  placeholder="Оставьте пустым для неограниченного колличества"
                >
                </v-text-field>

                <div><small>*обязательное поле</small></div>

                <v-card-actions class="justify-end">
                  <v-btn
                    type="submit"
                    variant="text"
                  >Создать</v-btn>
                  <v-btn
                    variant="text"
                    @click="isActive.value = false"
                  >Отмена</v-btn>
                </v-card-actions>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>

  </v-card>

</template>

<script>
import store from '@/plugins/store';

    export default {
        data() {
            return {
                show: false,
                title: "Создать проект",

                projectTitle: "",
                projectSubtitle: "",
                projectTeamID: this.$route.params?.teamID,
                projectInProgressRestriction: null,

                titleRules: [
                    v => !!v || 'Требуется название',
                    v => v.length <= 30 || 'Название должно быть меньше 30 символов',
                ],
                textRules: [
                    v => (v)? v.length <= 300 : true || 'Описание должно быть меньше 300 символов',
                ],
                inProgressRestrictionRules: [
                  v => (v)? Number.isInteger(v) : true || 'Число должно быть целым',
                  v => (v)? v >= 0 : true || 'Ограничение на количество задач должно начинаться от 0',
                  v => (v)? v <= 1000 : true || 'Ограничение на количество задач должно быть меньше 1000',
                ],
            }
        },
        props: {
            allTeams: {
              type: Array,
              required: true
            },
        },
        methods: {
            async createProject() {
                const { valid } = await this.$refs.createProjectForm.validate();

                if(valid) {
                    await store.dispatch('projectM/createProject', { 
                      title: this.projectTitle, 
                      body: this.projectSubtitle,
                      inProgressRestriction: this.projectInProgressRestriction,
                      teamID: this.projectTeamID 
                    });
                    this.$refs.createProjectForm.reset();
                    this.$refs.createProjectForm.resetValidation();
                }
                else alert("NOT validate");
            },
            showProject() {
                console.log(this.projectTitle);
                console.log(this.projectSubtitle);
            },
        },
        computed: {
            teamsWithID() {
                return this.allTeams.map(team => ({ ...team, titleWithID: `${team.title} (id: ${team.id})` }));
            },
        }
    }
</script>

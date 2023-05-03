<template>
    <v-card
      color="#e9fa7d"
      width="100%"
      @click="goToDashboard"
      height="200"
      rounded="xl"
      class="project-card elevation-0"
    >
        <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-menu class="project-card-menu" location="end">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-if="currentUser.roles.includes('manager') || currentUser.roles.includes('administrator')"
                    v-bind="props"
                    class="project-card-menu-btn"
                    size="small"
                    color="surface-variant" 
                    variant="text" 
                    icon="mdi-dots-horizontal"
                  ></v-btn>
                </template>
                <v-list>
                    <v-list-item
                      class="project-card-menu-list-item-edit"
                      @click="showEdit = !showEdit"
                    >
                      <v-list-item-title>Изменить</v-list-item-title>
                    </v-list-item>
            
                    <v-list-item
                      class="project-card-menu-list-item-delete"
                      @click="showDelete = !showDelete"
                    >
                      <v-list-item-title>Удалить</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card-actions>
  
        <v-card-title class="project-card-title">{{ project.title }}</v-card-title>
  
        <v-card-subtitle class="project-card-subtitle">{{ project.body }}</v-card-subtitle>
  
        <v-dialog
            v-model="showEdit"
            class="project-card-dialog-edit"
            max-width="1000"
            transition="dialog-top-transition"
        >
        <template v-slot:default="{ isActive }">
          <v-card>
            <v-toolbar
              color="primary"
              title="Изменение проекта"
            ></v-toolbar>
            <v-card-text>
              <v-form ref="editProjectForm" @submit.prevent="{ editProject(); isActive.value = false }">
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
                    >Изменить</v-btn>
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
  
      <v-dialog
        v-model="showDelete"
        class="project-card-dialog-delete"
        max-width="500"
        transition="dialog-top-transition"
      >
        <template v-slot:default="{ isActive }">
          <v-card>
            <v-toolbar
              color="primary"
              title="Удаление проекта"
            ></v-toolbar>
  
            <v-card-item>
              <v-card-text>Вы действительно хотите удалить проект?</v-card-text>
            </v-card-item>
  
            <v-card-actions class="justify-end">
              <v-btn
                variant="text"
                @click="{ deleteProject(); isActive.value = false }"
              >Да</v-btn>
              <v-btn
                variant="text"
                @click="isActive.value = false"
              >Нет</v-btn>
            </v-card-actions>
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
              showEdit: false,
              showDelete: false,
              projectTitle: this.project.title,
              projectSubtitle: this.project.body,
              projectTeamID: this.project.team?.id,
              projectInProgressRestriction: this.project?.inProgressRestriction,
  
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
        project: {
          type: Object,
          required: true
        },
        allTeams: {
          type: Array,
          required: true
        },
        currentUser: {
          type: Object,
          required: true
        }
      },
      methods: {
          async editProject() {
              const { valid } = await this.$refs.editProjectForm.validate();
  
              if(valid) {
                  await store.dispatch('projectM/editProject', { id: this.project.id,
                    title: this.projectTitle, 
                    body: this.projectSubtitle,
                    inProgressRestriction: this.projectInProgressRestriction,
                    teamID: this.projectTeamID
                });
              }
              else alert("NOT validate");
          },
          async deleteProject() {
              await store.dispatch('projectM/deleteProject', { id: this.project.id });
          },
          goToDashboard() {
              this.$router.push({ name: 'dashboard', params: { teamID: this.project.team.id, projectID: this.project.id } });
          },
      },
      computed: {
          teamsWithID() {
              console.log(this.allTeams);
              return this.allTeams.map(team => ({ ...team, titleWithID: `${team.title} (id: ${team.id})` }));
          },
      },
  }
  </script>
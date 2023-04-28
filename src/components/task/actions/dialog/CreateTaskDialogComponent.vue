<template>
    <v-dialog
      v-model="show"
      activator="parent"
      max-width="1000"
      transition="dialog-top-transition"
    >
      <v-card>
        <v-toolbar
          color="primary"
          title="Создание задачи"
        ></v-toolbar>
        <v-card-text>
          <v-form ref="createTaskForm" @submit.prevent="createTask()">
            <v-container>

                <v-text-field
                    label="Заголовок*"
                    v-model="taskTitle"
                    :rules="titleRules"
                    :counter="30"
                    clearable
                    required
                >
                </v-text-field>

                <v-textarea label="Описание" v-model="text" :rules="textRules" clearable></v-textarea>

                <v-autocomplete
                    label="Исполнитель*"
                    :items="usersWithID"
                    item-title="nameWithID"
                    item-value="uid"
                    v-model="executor"
                    :rules="selectRules"
                    clearable
                    required
                ></v-autocomplete>

                <v-autocomplete
                    label="Сложность задачи"
                    :items="[...difficulty.values()]"
                    v-model="selectDifficulty"
                    clearable
                ></v-autocomplete>

                <div class="d-flex flex-row">
                    <v-text-field
                        v-model="beginDate"
                        label="Дата начала"
                        type="date"
                    ></v-text-field>

                    <v-text-field
                        v-model="dueDate"
                        class="ml-2"
                        label="Дедлайн"
                        type="date"
                    ></v-text-field>
                </div>

                <v-autocomplete
                    label="Проект"
                    :items="projects"
                    item-title="title"
                    item-value="id"
                    v-model="selectProject"
                    clearable
                ></v-autocomplete>

                <small>*обязательное поле</small>

              <v-card-actions class="justify-end">
                <v-btn
                  type="submit"
                  color="primary"
                  variant="text"
                >Создать</v-btn>
                <v-btn
                  variant="text"
                  @click="show = false"
                >Отмена</v-btn>
              </v-card-actions>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script>
import store from '@/plugins/store';
import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                show: false,

                title: "Создать задачу",
                taskTitle: "",
                text: "",
                executor: "",
                selectDifficulty: "",
                selectProject: null,
                beginDate: new Date().toLocaleDateString("ru-RU", { year: 'numeric', month: '2-digit', day: '2-digit' }).toString().split('.').reverse().join('-'),
                dueDate: '',
                name: "Test",
                titleRules: [
                    v => !!v || 'Требуется заголовок',
                    v => v.length <= 30 || 'Заголовок должен быть меньше 30 символов',
                ],
                textRules: [
                    v => v.length <= 1000 || 'Описание должно быть меньше 1000 символов',
                ],
                selectRules: [
                    v => !!v || 'Требуется исполнитель',
                ],
            }
        },
        methods: {
            async createTask() {
                const { valid } = await this.$refs.createTaskForm.validate();

                if(valid) {
                    await store.dispatch('taskM/createNewTask', { 
                        title: this.taskTitle, 
                        body: this.text, 
                        executorUID: this.executor,
                        difficultyValue: this.selectDifficulty,
                        projectID: this.selectProject,
                        beginDate: new Date(this.beginDate).toISOString().slice(0, -5) + '+03:00',
                        dueDate: new Date(this.dueDate).toISOString().slice(0, -5) + '+03:00'
                    });
                    this.$refs.createTaskForm.reset();
                    this.$refs.createTaskForm.resetValidation();
                }
                //else alert("NOT validate");
            },
        },
        computed: {
            ...mapGetters({
                users: 'userM/getUsers',
                difficulty: 'taskM/getDifficulty',
                projects: 'projectM/getProjects'
            }),
            usersWithID() {
                return this.users.map(user => ({ ...user, nameWithID: `${user.name} (${user.id})` }));
            },
        },
    }
</script>
<template>
    <v-form ref="taskForm" @submit.prevent="editTask">
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
                v-model="executorUID"
                :rules="selectRules"
                clearable
                required
            ></v-autocomplete>

            <v-autocomplete
                v-model="selectStatus"
                :items="[...statuses.values()]"
                label="Статус задачи"
                single-line
            ></v-autocomplete>

            <v-autocomplete
                v-model="selectDifficulty"
                :items="[...difficulty.values()]"
                label="Сложность задачи"
                single-line
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

            <small>*обязательное поле</small><br>
            <v-btn type="submit" rounded="pill" variant="elevated">Применить</v-btn>
            <v-btn type="button" rounded="pill" variant="elevated" @click="deleteTask">Удалить</v-btn>
        </v-container>
    </v-form>
</template>

<script>
import store from '@/plugins/store';
import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                taskTitle: this.task.title,
                text: this.task.body,
                executorUID: this.userUID,
                selectStatus: this.task.status,
                selectDifficulty: this.task.difficulty,
                selectProject: this.task.project?.id,
                beginDate: new Date(this.task.beginDate).toLocaleDateString("ru-RU", { year: 'numeric', month: '2-digit', day: '2-digit' }).toString().split('.').reverse().join('-'),
                dueDate: new Date(this.task.dueDate).toLocaleDateString("ru-RU", { year: 'numeric', month: '2-digit', day: '2-digit' }).toString().split('.').reverse().join('-'),

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
        props: {
            task: {
                type: Object,
                required: true
            },
            userUID: {
                type: String,
                required: true
            },
        },
        methods: {
            async editTask() {
              const { valid } = await this.$refs.taskForm.validate();

              console.log("Выбранный проект: " + this.selectProject);

              if(valid) {
                    await store.dispatch('taskM/editTask', {
                        id: this.task.id, 
                        title: this.taskTitle, 
                        body: this.text, 
                        executorUID: this.executorUID, 
                        status: this.selectStatus,
                        difficulty: this.selectDifficulty,
                        projectID: this.selectProject
                    });
                }
                //else alert("NOT validate");
            },
            async deleteTask() {
              await store.dispatch('taskM/deleteTask', {id: this.task.id});
            },
            showExecutorUID() {
              console.log(this.executorUID);
            },
        },
        computed: {
            ...mapGetters({
                // users: 'userM/getUsers',
                statuses: 'taskM/getStatuses',
                difficulty: 'taskM/getDifficulty',
                projects: 'projectM/getProjects'
            }),
            getUsers() {
                const currentUser = store.getters['authM/getUser'];
                if(this.task.project?.id) return [...store.getters['projectM/getProjectByID'](this.selectProject).team.users, currentUser];
                else return [...store.getters['userM/getUsers'], currentUser];
            },
            usersWithID() {
                console.log(this.getUsers);
                if(!this.getUsers.map(user => user.uid).includes(this.executorUID)) this.executorUID = null;
                return this.getUsers.map(user => ({ ...user, nameWithID: `${user.name} (${user.id})` }));
            },
        },
    }
</script>
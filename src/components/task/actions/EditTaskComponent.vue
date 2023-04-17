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

            <v-select
                v-model="selectStatus"
                :items="[...statuses.values()]"
                label="Статус задачи"
                single-line
            ></v-select>

            <v-select
                v-model="selectDifficulty"
                :items="[...difficulty.values()]"
                label="Сложность задачи"
                single-line
            ></v-select>

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

              if(valid) {
                    await store.dispatch('taskM/editTask', {
                        id: this.task.id, 
                        title: this.taskTitle, 
                        body: this.text, 
                        executorUID: this.executorUID, 
                        status: this.selectStatus,
                        difficulty: this.selectDifficulty,
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
                users: 'userM/getUsers',
                statuses: 'taskM/getStatuses',
                difficulty: 'taskM/getDifficulty'
            }),
            usersWithID() {
                return this.users.map(user => ({ ...user, nameWithID: `${user.name} (${user.id})` }));
            },
        },
    }
</script>
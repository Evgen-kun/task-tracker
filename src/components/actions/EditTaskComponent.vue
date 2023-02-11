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
                :items="users"
                item-title="name"
                item-value="id"
                v-model="executorUID"
                :rules="selectRules"
                clearable
                required
            ></v-autocomplete>

            <v-select
                v-model="select"
                :items="[...statuses.values()]"
                label="Статус задачи"
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
                taskTitle: this.title,
                text: this.body,
                executorUID: this.userUID,
                select: this.taskStatus,

                titleRules: [
                  v => !!v || 'Требуется заголовок',
                  v => v.length <= 30 || 'Заголовок должен быть меньше 30 символов',
                ],
                textRules: [
                  v => v.length <= 300 || 'Описание должно быть меньше 300 символов',
                ],
                selectRules: [
                    v => !!v || 'Требуется исполнитель',
                ],
            }
        },
        props: {
            taskID: String,
            taskStatus: String,
            title: String,
            body: String,
            userUID: String,
        },
        methods: {
            async editTask() {
              const { valid } = await this.$refs.taskForm.validate();

              if(valid) {
                    await store.dispatch('taskM/editTask', {
                        id: this.taskID, 
                        title: this.taskTitle, 
                        body: this.text, 
                        executorUID: this.executorUID, 
                        status: this.select
                    });
                }
                //else alert("NOT validate");
            },
            async deleteTask() {
              await store.dispatch('taskM/deleteTask', {id: this.taskID});
            },
            showExecutorUID() {
              console.log(this.executorUID);
            },
        },
        computed: {
            ...mapGetters('taskM', {
                users: 'getUsers',
                statuses: 'getStatuses',
            }),
        },
    }
</script>
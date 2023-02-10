<template>
    <v-card
    class="mx-auto"
    max-width="550"
    color="blue"
    rounded="xl"
  >

    <div @click="show = !show" style="cursor: pointer;">
        <v-card-title>
            {{ title }}
        </v-card-title>
    </div>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text>
            <v-form ref="createTaskForm" @submit.prevent="createTask">
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
                        v-model="executor"
                        :rules="selectRules"
                        clearable
                        required
                    ></v-autocomplete>

                    <small>*обязательное поле</small>
                    <v-btn block type="submit" color="black" rounded="lg">Создать</v-btn>
                </v-container>
            </v-form>
        </v-card-text>
      </div>
    </v-expand-transition>

  </v-card>

</template>

<script>
import store from '@/plugins/store';
import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                title: "Создать задачу",
                show: false,
                taskTitle: "",
                text: "",
                executor: "",
                name: "Test",
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

        },
        methods: {
            async createTask() {
                const { valid } = await this.$refs.createTaskForm.validate();

                if(valid) {
                    await store.dispatch('taskM/createNewTask', { title: this.taskTitle, body: this.text, executorUID: this.executor});
                    this.$refs.createTaskForm.reset();
                    this.$refs.createTaskForm.resetValidation();
                }
                //else alert("NOT validate");
            },
        },
        computed: {
            ...mapGetters('taskM', {
                users: 'getUsers',
            }),
        },
        async created() {
            await store.dispatch('taskM/getUsers');
        },
    }
</script>
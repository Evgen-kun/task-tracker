<template>
    <v-card
    class="mx-auto mt-8"
    color="#26c6da"
    theme="dark"
    max-width="550"
    rounded="xl"
    prepend-icon="mdi-alert-octagon-outline"
  >

    <template v-slot:prepend>
      <v-icon size="x-large"></v-icon>
    </template>

    <v-card-text class="text-h4 py-2">
      {{ title }}
    </v-card-text>

    <v-card-text class="text-h5 py-2">
      {{ body }}
    </v-card-text>

    <v-card-actions>
      <v-list-item class="w-100">
        <template v-slot:prepend>
          <v-avatar
            :image=image
          ></v-avatar>
        </template>

        <v-list-item-title>{{ user }}</v-list-item-title>

        <v-list-item-subtitle>{{ subtitle }}</v-list-item-subtitle>

        <template v-slot:append>
          <div class="justify-self-end">
            <v-btn @click="show = !show">{{ btnText }}</v-btn>
          </div>
        </template>
      </v-list-item>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text>
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
                        v-model="executor"
                        :rules="selectRules"
                        clearable
                        required
                    ></v-autocomplete>

                    <small>*обязательное поле</small><br>
                    <v-btn type="submit" rounded="lg">Применить</v-btn>
                    <v-btn type="button" rounded="lg" @click="deleteTask">Удалить</v-btn>
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
              show: false,
              taskTitle: this.title,
              text: this.body,
              executor: this.userUID,
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
            title: String,
            body: String,
            user: String,
            userUID: String,
            image: Image,
            subtitle: String,
            btnText: String,
        },
        methods: {
            async editTask() {
              const { valid } = await this.$refs.taskForm.validate();

              if(valid) {
                    await store.dispatch('taskM/editTask', {id: this.taskID, title: this.taskTitle, body: this.text, executorUID: this.executor});
                }
                //else alert("NOT validate");
            },
            async deleteTask() {
              await store.dispatch('taskM/deleteTask', {id: this.taskID});
            },
            showExecutor() {
              console.log(this.executor);
            },
        },
        computed: {
            ...mapGetters('taskM', {
                users: 'getUsers',
            }),
        },
    }
</script>
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
          <div>
            <v-btn 
              rounded="pill"
              variant="elevated"
              v-show="$route.path == '/about'" 
              color="blue" 
              @click="showAns = false; showEdit = !showEdit"
            >
              Изменить
            </v-btn>

            <v-btn 
              rounded="pill"
              variant="elevated"
              v-show="($route.path == '/') && (lastAnsTitle !== undefined)" 
              color="green" 
              @click="showLastAns = !showLastAns"
            >
              Последний ответ
            </v-btn>

            <v-btn 
              rounded="pill"
              variant="elevated"
              v-show="$route.path == '/'" 
              color="green" 
              @click="showEdit = false; showAns = !showAns"
            >
              Добавить ответ
            </v-btn>
            <!-- <v-btn @click="showEdit = !showEdit">{{ btnText }}</v-btn> -->
          </div>
        </template>
      </v-list-item>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="showLastAns">
        <v-divider></v-divider>
        <v-card-text>
            <v-form ref="lastAnsForm" disabled>
                <v-container>
                    <v-text-field
                        label="Заголовок"
                        v-model="lastAnsTitle"
                    >
                    </v-text-field>

                    <v-textarea label="Описание" v-model="lastAnsText"></v-textarea>

                    <v-file-input
                      v-if="(lastAnsFiles !== undefined) && (lastAnsFiles.length != 0)"
                      v-model="lastAnsFiles"
                      label="Файлы"
                      multiple
                      prepend-icon="mdi-paperclip"
                    >
                      <template v-slot:selection="{ fileNames }">
                        <template v-for="fileName in fileNames" :key="fileName">
                          <v-chip
                            variant="outlined"
                            size="small"
                            label
                            color="white"
                            text-color="white"
                            class="me-2"
                          >
                            {{ fileName }}
                          </v-chip>
                        </template>
                      </template>
                    </v-file-input>
                </v-container>
            </v-form>
        </v-card-text>
      </div>
    </v-expand-transition>

    <v-expand-transition>
      <div v-show="showEdit">
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
                    <v-btn type="submit" rounded="pill" variant="elevated">Применить</v-btn>
                    <v-btn type="button" rounded="pill" variant="elevated" @click="deleteTask">Удалить</v-btn>
                </v-container>
            </v-form>
        </v-card-text>
      </div>
    </v-expand-transition>

    <v-expand-transition>
      <div v-show="showAns">
        <v-divider></v-divider>
        <v-card-text>
            <v-form ref="ansForm" @submit.prevent="addAns">
                <v-container>
                    <v-text-field
                        label="Заголовок*"
                        v-model="ansTitle"
                        :rules="titleRules"
                        :counter="30"
                        clearable
                        required
                    >
                    </v-text-field>

                    <v-textarea label="Описание" v-model="ansText" :rules="textAnsRules" required clearable></v-textarea>

                    <v-file-input
                      v-model="files"
                      placeholder="Загрузите ваш ответ"
                      label="Ввод файла"
                      multiple
                      prepend-icon="mdi-paperclip"
                    >
                      <template v-slot:selection="{ fileNames }">
                        <template v-for="fileName in fileNames" :key="fileName">
                          <v-chip
                            variant="outlined"
                            size="small"
                            label
                            color="white"
                            text-color="white"
                            class="me-2"
                          >
                            {{ fileName }}
                          </v-chip>
                        </template>
                      </template>
                    </v-file-input>

                    <small>*обязательное поле</small><br>
                    <v-btn type="submit" rounded="pill" variant="elevated">Применить</v-btn>
                    <v-btn type="button" rounded="pill" variant="elevated" @click="resetAns">Очистить</v-btn>
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
              showEdit: false,
              showAns: false,
              showLastAns: false,
              taskTitle: this.title,
              ansTitle: "",
              lastAnsTitle: this.propLastAnsTitle,
              text: this.body,
              ansText: "",
              lastAnsText: this.propLastAnsText,
              executor: this.userUID,
              files: [],
              lastAnsFiles: this.propLastAnsFiles,
              titleRules: [
                  v => !!v || 'Требуется заголовок',
                  v => v.length <= 30 || 'Заголовок должен быть меньше 30 символов',
              ],
              textRules: [
                  v => v.length <= 300 || 'Описание должно быть меньше 300 символов',
              ],
              textAnsRules: [
                  v => !!v || 'Требуется ответ',
                  v => v.length <= 500 || 'Ответ должен быть меньше 500 символов',
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

            propLastAnsTitle: String,
            propLastAnsText: String,
            propLastAnsFiles: Array,
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
            resetAns () {
              this.ansTitle = this.ansText = "";
              this.files = [];
              this.$refs.ansForm.resetValidation();
            },
            async addAns() {
              const { valid } = await this.$refs.ansForm.validate();

              if(valid) {
                    await store.dispatch('taskM/createAnswer', {title: this.ansTitle, body: this.ansText, taskUID: this.taskID, files: this.files});
                }
                else alert("Ans is NOT validate");
                console.log(this.files);
            },
        },
        computed: {
            ...mapGetters('taskM', {
                users: 'getUsers',
            }),
        },
    }
</script>
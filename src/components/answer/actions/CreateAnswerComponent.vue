<template>
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

            <v-select
                v-model="select"
                :items="[...progress.values()]"
                label="Прогресс выполнения (%)"
                single-line
                required
            ></v-select>

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
</template>

<script>
import store from '@/plugins/store';
import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                ansTitle: "",
                ansText: "",
                select: "0%",
                files: [],

                titleRules: [
                  v => !!v || 'Требуется заголовок',
                  v => v.length <= 30 || 'Заголовок должен быть меньше 30 символов',
                ],
                textAnsRules: [
                  v => !!v || 'Требуется ответ',
                  v => v.length <= 500 || 'Ответ должен быть меньше 500 символов',
                ],
            }
        },
        props: {
            taskID: {
                type: String,
                required: true
            },
        },
        methods: {
            async addAns() {
              const { valid } = await this.$refs.ansForm.validate();

              if(valid) {
                    await store.dispatch('taskM/createAnswer', {
                        title: this.ansTitle, 
                        body: this.ansText, 
                        taskUID: this.taskID, 
                        progress: `${this.select}%`, 
                        files: this.files
                    });
                }
                else alert("Ans is NOT validate");
                console.log(this.files);
            },
            resetAns () {
              this.ansTitle = this.ansText = "";
              this.files = [];
              this.$refs.ansForm.resetValidation();
            },
        },
        computed: {
            ...mapGetters('taskM', {
                progress: 'getProgress',
            }),
        },
    }
</script>
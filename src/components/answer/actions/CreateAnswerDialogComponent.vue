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
          title="Создание ответа"
        >
            <v-btn
                v-if="task.answers.length > 0"
                @click="showAns(task.answers)"
                variant="text"
            >
                Предыдущий ответ
                <LastAnswerDialogComponent :answers="task.answers"></LastAnswerDialogComponent>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-form ref="ansForm" @submit.prevent="{ addAns(); show = false }">
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
                        :items="[...progress.values()].map(item => ({title: `${item}%`, value: item}))"
                        item-title="title"
                        item-value="value"
                        label="Прогресс выполнения (%)"
                        :rules="progressAnsRules"
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
                            text-color="black"
                            class="me-2"
                            >
                            {{ fileName }}
                            </v-chip>
                        </template>
                        </template>
                    </v-file-input>

                    <small>*обязательное поле</small><br>

                    <v-card-actions class="justify-end">
                        <v-btn
                            type="submit"
                            color="primary"
                            variant="text"
                        >Применить</v-btn>
                        <v-btn
                            type="button"
                            color="error"
                            variant="text"
                            @click="resetAns"
                        >Очистить</v-btn>
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
import LastAnswerDialogComponent from '../LastAnswerDialogComponent.vue';
// import LastAnswerComponent from '../LastAnswerComponent.vue';

    export default {
    data() {
        return {
            show: false,
            ansTitle: "",
            ansText: "",
            select: null,
            files: [],
            titleRules: [
                v => !!v || "Требуется заголовок",
                v => v.length <= 30 || "Заголовок должен быть меньше 30 символов",
            ],
            textAnsRules: [
                v => !!v || "Требуется ответ",
                v => v.length <= 500 || "Ответ должен быть меньше 500 символов",
            ],
            progressAnsRules: [
                v => v !== null || "Требуется указать прогресс",
            ],
        };
    },
    props: {
        task: {
            type: Object,
            required: true
        },
    },
    methods: {
        async addAns() {
            const { valid } = await this.$refs.ansForm.validate();
            if (valid) {
                await store.dispatch('taskM/createAnswer', {
                    title: this.ansTitle, 
                    body: this.ansText, 
                    taskUID: this.taskID, 
                    progress: this.select, 
                    files: this.files
                });
            }
            else alert("Ans is NOT validate");
        },
        resetAns() {
            this.ansTitle = this.ansText = "";
            this.files = [];
            this.$refs.ansForm.resetValidation();
        },
        showAns(res) {
            console.log(res);
        },
    },
    computed: {
        ...mapGetters("taskM", {
            progress: "getProgress",
        }),
    },
    components: { LastAnswerDialogComponent }
}
</script>
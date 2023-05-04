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
          title="Последний ответ"
        ></v-toolbar>
        <v-card-text>
            <v-form ref="lastAnsForm">
                <v-container>
                    <v-text-field
                        label="Заголовок"
                        v-model="lastAnswer.title"
                        readonly
                    >
                    </v-text-field>

                    <v-textarea 
                        v-model="lastAnswer.text"
                        label="Описание"
                        readonly
                    ></v-textarea>

                    <v-text-field
                        label="Прогресс выполнения"
                        readonly
                    >
                        {{ lastAnswer.progress }}%
                    </v-text-field>

                    <v-file-input
                        v-if="lastAnswer.files.length !== 0"
                        v-model="lastAnswer.files"
                        label="Файлы"
                        multiple
                        readonly
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
                    <v-card-actions class="justify-end">
                        <v-btn
                            variant="text"
                            @click="show = false"
                        >Закрыть</v-btn>
                    </v-card-actions>
                </v-container>
            </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script>
import Answer from '@/model/Answer';

export default {
    data() {
        return {
            show: false
        }
    },
    props: {
        answers: {
            type: Array,
            required: true
        },
    },
    methods: {
        
    },
    computed: {
        lastAnswer() {
          if(this.answers.length !== 0) return this.answers[this.answers.length - 1];
          else return new Answer();
        },
    },
}
</script>

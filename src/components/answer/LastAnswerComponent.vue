<template>
    <v-form ref="lastAnsForm">
        <v-container>
            <v-text-field
                label="Заголовок"
                v-model="lastAnswer.title"
                readonly
            >
            </v-text-field>

            <v-textarea label="Описание" v-model="lastAnswer.text"></v-textarea>

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
        </v-container>
    </v-form>
</template>

<script>

    export default {
        data() {
            return {}
        },
        props: {
            answers: {
                type: Array,
                required: true
            },
        },
        computed: {
            lastAnswer() {
              if(this.answers.length !== 0) return this.answers[this.answers.length - 1];
              else return null;
            },
        },
    }
</script>
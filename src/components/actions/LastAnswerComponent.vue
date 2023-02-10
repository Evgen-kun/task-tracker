<template>
    <v-form ref="lastAnsForm" disabled>
        <v-container>
            <v-text-field
                label="Заголовок"
                v-model="lastAnsTitle"
            >
            </v-text-field>

            <v-textarea label="Описание" v-model="lastAnsText"></v-textarea>

            <v-file-input
                v-if="lastAnsFiles.length !== 0"
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
</template>

<script>
    export default {
        data() {
            return {
                lastAnsTitle: (this.answers.length !== 0)? this.answers[0].title : null,
                lastAnsText: (this.answers.length !== 0)? this.answers[0].body : null,
                lastAnsFiles: (this.answers.length !== 0)? this.answers[0].files : [],
            }
        },
        props: {
            answers: Array,
        },
        methods: {
            
        },
    }
</script>
<template>
    <v-form ref="lastAnsForm" disabled>
        <v-container>
            <v-text-field
                label="Заголовок"
                v-model="lastAnsTitle"
            >
            </v-text-field>

            <v-textarea label="Описание" v-model="lastAnsText"></v-textarea>

            <v-text-field
                v-model="select"
                label="Прогресс выполнения"
            ></v-text-field>

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

            }
        },
        props: {
            title: String,
            body: String,
            files: Array,
            taskProgress: String,
        },
        methods: {
            
        },
        computed: {
            select() { return this.taskProgress },
            lastAnsTitle() { return this.title; },
            lastAnsText() { return this.body; },
            lastAnsFiles() { return this.files; },
        },
    }
</script>
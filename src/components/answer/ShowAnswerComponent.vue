<template>
    <v-card
        class="ma-2"
        rounded="xl"
    >

        <div class="d-flex flex-row" @click="show = !show" style="cursor: pointer;">
        <v-card-title>
            Ответ {{ answerNum + 1 }}
        </v-card-title>

        <v-spacer></v-spacer>
        <v-btn
            :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        ></v-btn>
        </div>

        <v-expand-transition >
        <div v-show="show">
            <v-divider></v-divider>

            <v-card-title>
                {{ answer.title }}
            </v-card-title>

            <v-card-subtitle>
                Прогресс выполнения: {{ answer.progress }}%
            </v-card-subtitle>

            <v-card-text>
                {{ answer.body }}
            </v-card-text>

            <v-card-text v-if="answer.files.length !== 0">
            <div class="text-center">
                <v-chip
                    v-for="file in answer.files"
                    class="ma-2"
                    color="primary"
                    variant="outlined"
                    :href="file.link"
                    @click.prevent="downloadFile(file)"
                >
                    {{ file.name }}
                </v-chip>
            </div>
            </v-card-text>
        </div>
        </v-expand-transition>
    </v-card>
</template>

<script>
import axios from 'axios';
    export default {
        data() {
            return {
              show: false,
            }
        },
        props: {
            answerNum: {
                type: Number,
                required: true
            },
            answer: {
                type: Object,
                required: true
            },
        },
        methods: {
            downloadFile({ link, name }) {
                axios.get(link, { responseType: 'blob' }).then(response => {
                        const blob = new Blob([response.data], { type: 'text/plain' });
                        const newLink = document.createElement('a');
                        newLink.href = URL.createObjectURL(blob);
                        newLink.download = name;
                        newLink.click();
                        URL.revokeObjectURL(newLink.href);
                    }).catch(console.error);
            },
        },
    }
</script>

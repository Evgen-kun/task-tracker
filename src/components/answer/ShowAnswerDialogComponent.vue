<template>
    <v-dialog
      v-model="show"
      activator="parent"
      max-width="700"
      transition="dialog-top-transition"
    >
        <v-card>
            <v-toolbar
            color="primary"
            :title="'Ответы задачи \'' + task.title + '\''"
            ></v-toolbar>
            <v-container>
                <ShowAnswerComponent
                    v-for="(answer, i) in task.answers"
                    v-bind:key="answer.uid"
                    v-bind:answerNum="i"
                    v-bind:answer="answer"
                >
                </ShowAnswerComponent>
                <v-card-actions class="justify-end">
                    <v-btn
                        variant="text"
                        @click="show = false"
                    >Закрыть</v-btn>
                </v-card-actions>
            </v-container>
            
        </v-card>
    </v-dialog>
</template>

<script>
import ShowAnswerComponent from '../answer/ShowAnswerComponent.vue';
    export default {
        data() {
            return {
              show: false,
            }
        },
        props: {
            task: {
                type: Object,
                required: true
            },
        },
        components: {
            ShowAnswerComponent,
        }
    }
</script>
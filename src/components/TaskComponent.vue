<template>
  <v-card
    v-if="!show"
    class="mx-auto mt-8"
    :color="color.get(taskStatus)"
    theme="dark"
    max-width="750"
    rounded="xl"
    @click="show = !show"
  >

  <div class="d-flex flex-row">
  <v-card-item>
    <v-list-item class="w-100">
    <v-progress-circular
        v-if="(taskProgress.slice(0, -1) !== '0') && (taskProgress.slice(0, -1) !== '100')"
        :rotate="360"
        :width="7"
        :model-value="Number(taskProgress.slice(0, -1))"
        color="wight"
      >
      </v-progress-circular>
      <v-icon :icon="icon" v-else size="x-large"></v-icon>
    </v-list-item>
  </v-card-item>

    <v-card-item class="text-h5 py-4" style="text-align:start" >
      <v-list-item class="w-100">
        {{ title }}
      </v-list-item>
    </v-card-item>
      
    <v-spacer></v-spacer>

    <v-card-item class="text-h6">{{ user }}</v-card-item>

    <v-card-item>
      <v-list-item class="w-100">
          <v-avatar
            :image=image
          ></v-avatar>
      </v-list-item>
    </v-card-item>
  </div>

  </v-card>

  <v-card
    v-if="show"
    class="mx-auto mt-8"
    :color="color.get(taskStatus)"
    theme="dark"
    max-width="750"
    rounded="xl"
    :prepend-icon="icon"
  >

    <template v-slot:prepend>
      <v-progress-circular
        v-if="(taskProgress.slice(0, -1) !== '0') && (taskProgress.slice(0, -1) !== '100')"
        :rotate="360"
        :width="7"
        :model-value="Number(taskProgress.slice(0, -1))"
        color="wight"
      >
      </v-progress-circular>
      <v-icon v-else size="x-large"></v-icon>
    </template>

    <template v-slot:append>
      <v-btn
          icon="mdi-close"
          color="error"
          @click="show = !show"
        ></v-btn>
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
              v-show="path == '/about'"
              color="blue"
              @click="showAnswers = false; showEdit = !showEdit"
            >
              Изменить
            </v-btn>

            <v-btn
              rounded="pill"
              variant="elevated"
              v-show="path == '/about'"
              :disabled="answers.length === 0"
              color="green"
              @click="showEdit = false; showAnswers = !showAnswers"
            >
              Ответы
            </v-btn>

            <v-btn
              rounded="pill"
              variant="elevated"
              v-show="(path == '/') && (answers.length !== 0)"
              color="green"
              @click="showLastAns = !showLastAns"
            >
              Последний ответ
            </v-btn>

            <v-btn
              rounded="pill"
              variant="elevated"
              v-show="path == '/'"
              color="green"
              @click="showEdit = false; showCreateAns = !showCreateAns"
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
            <LastAnswerComponent 
              v-bind:title="lastAnswer.title"
              v-bind:body="lastAnswer.body"
              v-bind:files="lastAnswer.files"
              v-bind:taskProgress="taskProgress"
            ></LastAnswerComponent>
        </v-card-text>
      </div>
    </v-expand-transition>

    <v-expand-transition>
      <div v-show="showAnswers">
        <v-divider></v-divider>
          <ShowAnswerComponent
            v-for="(answer, i) in answers"
            v-bind:key="answer.id"
            v-bind:i="i"
            v-bind:title="answer.title"
            v-bind:body="answer.body"
            v-bind:progress="answer.progress"
            v-bind:files="answer.files"
          >
          </ShowAnswerComponent>
      </div>
    </v-expand-transition>

    <v-expand-transition>
      <div v-show="showEdit">
        <v-divider></v-divider>
        <v-card-text>
            <EditTaskComponent
            v-bind:taskID="taskID"
            v-bind:taskStatus="taskStatus"
            v-bind:title="title"
            v-bind:body="body"
            v-bind:userUID="userUID"
            >
            </EditTaskComponent>
        </v-card-text>
      </div>
    </v-expand-transition>

    <v-expand-transition>
      <div v-show="showCreateAns">
        <v-divider></v-divider>
        <v-card-text>
            <CreateAnswerComponent :taskID="taskID" />
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import ShowAnswerComponent from './actions/ShowAnswerComponent.vue';
import CreateAnswerComponent from './actions/CreateAnswerComponent.vue';
import EditTaskComponent from './actions/EditTaskComponent.vue';
import LastAnswerComponent from './actions/LastAnswerComponent.vue';
import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
              show: false,
              showEdit: false,
              showCreateAns: false,
              showAnswers: false,
              showLastAns: false,

              color: new Map([
                ['Выполнено', '#009400'], 
                ['Не выполнено', '#3055db'],
                ['Выполняется', '#26c6da'],
                ['Не определено', '#c7c9c8'],
              ]),

              //progress: Number(this.taskProgress.slice(0, -1)),
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
            answers: Array,
            taskStatus: String,
            taskProgress: String,
        },
        methods: {
            
        },
        computed: {
            path() {
              return this.$route.path;
            },
            icon() {
              const progress = Number(this.taskProgress.slice(0, -1));
              if(progress === 100) return "mdi-check-circle-outline";
              if(progress === 0) return "mdi-alert-octagon-outline";
            },
            lastAnswer() {
              if(this.answers.length !== 0) return this.answers[this.answers.length - 1];
              else return { title: null, body: null, files: [] };
            },
        },
        components: {
            ShowAnswerComponent,
            CreateAnswerComponent,
            EditTaskComponent,
            LastAnswerComponent,
        },
    }
</script>
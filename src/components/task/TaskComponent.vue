<template>
  <v-card
    v-if="!show"
    class="line-task mx-auto mt-3 elevation-0"
    :color="color.get(task.difficulty)"
    max-width="750px"
    min-width="300px"
    rounded="xl"
    :ripple="false"
    @click="show = !show"
  >

  <div class="d-flex flex-row">
  <v-card-item>
    <!-- <v-list-item class="w-100"> -->
    <v-progress-circular
        v-if="(task.progress !== 0) && (task.progress !== 100)"
        class="line-task-progress-circular"
        :rotate="360"
        :width="7"
        :model-value="task.progress"
        color="wight"
      >
      </v-progress-circular>
      <v-icon :icon="icon" v-else size="x-large"></v-icon>
    <!-- </v-list-item> -->
  </v-card-item>

    <v-card-title 
      class="line-task-title text-h5 py-4 shrink-block" 
      style="text-align:start" 
    >
      <!-- <v-list-item class="w-100"> -->
        {{ task.title }}
      <!-- </v-list-item> -->
    </v-card-title>
      
    <v-spacer></v-spacer>

    <v-card-item class="line-task-user-name text-h6">{{ user.name }}</v-card-item>

    <v-card-item>
      <!-- <v-list-item class="w-100"> -->
          <v-avatar
            class="line-task-user-avatar"
            :image=user.picture.url
          ></v-avatar>
      <!-- </v-list-item> -->
    </v-card-item>
  </div>

  </v-card>

  <v-card
    v-if="show"
    class="open-task mx-auto mt-3 elevation-0"
    :color="color.get(task.difficulty)"
    max-width="750px"
    min-width="300px"
    rounded="xl"
    :ripple="false"
    @click="show = !show"
  >

    <template v-slot:prepend>
      <v-progress-circular
        v-if="(task.progress !== 0) && (task.progress !== 100)"
        class="open-task-progress-circular"
        :rotate="360"
        :width="7"
        :model-value="task.progress"
        color="wight"
      >
      </v-progress-circular>
      <v-icon :icon="icon" v-else size="x-large"></v-icon>
      <v-chip v-if="(!!task.project) && (this.$route.name !== 'dashboard')" class="ml-2" color="primary">{{ task.project.title }}</v-chip>
    </template>

    <template v-slot:append>
      <!-- <v-btn
          icon="mdi-close"
          color="error"
          @click="show = !show"
        ></v-btn> -->
        <v-chip 
          prepend-icon="mdi-clock"
          color="pink">
          {{ beginDueDate }}
        </v-chip>
    </template>

    <v-card-text class="open-task-title text-h4 py-2">
      {{ task.title }}
    </v-card-text>

    <v-card-text class="open-task-body text-h5 py-2">
      {{ task.body }}
    </v-card-text>

    <v-card-actions>
      <v-list-item class="w-100">
        <template v-slot:prepend>
          <v-avatar
            class="open-task-user-avatar"
            :image=user.picture.url
          ></v-avatar>
        </template>

        <v-list-item-title class="open-task-user-name">{{ user.name }}</v-list-item-title>

        <v-list-item-subtitle class="open-task-subtitle">{{ subtitle }}</v-list-item-subtitle>

        <template v-slot:append>
          <div>
            <v-btn
              rounded="pill"
              variant="tonal"
              v-show="path == '/about'"
              color="blue"
            >
              Изменить
              <EditTaskDialogComponent
                v-bind:task="task"
                v-bind:userUID="user.uid"
              >
              </EditTaskDialogComponent>
            </v-btn>

            <v-btn
              rounded="pill"
              variant="tonal"
              v-show="path == '/about'"
              :disabled="task.answers.length === 0"
              color="blue"
            >
              Ответы
              <ShowAnswerDialogComponent :task="task" />
            </v-btn>

            <!-- <v-btn
              rounded="pill"
              variant="tonal"
              v-show="(path == '/inbox') && (task.answers.length !== 0)"
              color="blue"
              @click.stop="showLastAns = !showLastAns"
            >
              Последний ответ
            </v-btn> -->

            <v-btn
              rounded="pill"
              variant="tonal"
              v-show="path == '/inbox'"
              color="blue"
            >
              Добавить ответ
              <CreateAnswerDialogComponent :task="task" />
            </v-btn>
            <!-- <v-btn @click.stop="showEdit = !showEdit">{{ btnText }}</v-btn> -->
          </div>
        </template>
      </v-list-item>
    </v-card-actions>

    <!-- <v-expand-transition>
      <div v-show="showLastAns">
        <v-divider></v-divider>
        <v-card-text>
            <LastAnswerComponent :answers="task.answers" />
        </v-card-text>
      </div>
    </v-expand-transition> -->

    <!-- <v-expand-transition>
      <div v-show="showAnswers">
        <v-divider></v-divider>
          <ShowAnswerComponent
            v-for="(answer, i) in task.answers"
            v-bind:key="answer.uid"
            v-bind:answerNum="i"
            v-bind:answer="answer"
          >
          </ShowAnswerComponent>
      </div>
    </v-expand-transition> -->

    <!-- <v-expand-transition>
      <div v-show="showCreateAns">
        <v-divider></v-divider>
        <v-card-text>
            <CreateAnswerComponent :taskID="task.id" />
        </v-card-text>
      </div>
    </v-expand-transition> -->
  </v-card>
</template>

<script>
// import ShowAnswerComponent from '../answer/ShowAnswerComponent.vue';
import ShowAnswerDialogComponent from '../answer/ShowAnswerDialogComponent.vue';
// import CreateAnswerComponent from '../answer/actions/CreateAnswerComponent.vue';
import EditTaskDialogComponent from './actions/dialog/EditTaskDialogComponent.vue';
import LastAnswerComponent from '../answer/LastAnswerComponent.vue';
import CreateAnswerDialogComponent from '../answer/actions/CreateAnswerDialogComponent.vue';
// import { mapGetters } from 'vuex';

    export default {
      name: "TaskComponent",
        data() {
            return {
              show: false,
              showCreateAns: false,
              showAnswers: false,
              showLastAns: false,

              color: new Map([
                ['Легко', '#c2fcc8'], 
                ['Нормально', '#c2dcfc'],
                ['Сложно', '#fcc2c2'],
                ['Не определено', '#d1d1d1'],
              ]),

              statusColor: new Map([
                ['Выполнено', '#009400'], 
                ['Не выполнено', '#3055db'],
                ['Выполняется', '#26c6da'],
                ['Не определено', '#c7c9c8'],
              ]),

              //progress: Number(this.taskProgress.slice(0, -1)),
            }
        },
        props: {
            task: {
              type: Object,
              required: true
            },
            user: {
              type: Object,
              required: true
            },
            subtitle: {
              type: String,
              required: true
            },
        },
        methods: {
            
        },
        computed: {
            path() {
              return this.$route.path;
            },
            icon() {
              const progress = this.task.progress;
              if(progress === 100) return "mdi-check-circle-outline";
              if(progress === 0) return "mdi-alert-circle-outline";
              return null;
            },
            lastAnswer() {
              if(this.task.answers.length !== 0) return this.task.answers[this.task.answers.length - 1];
              else return { title: null, body: null, files: [] };
            },
            beginDueDate() {
              return `${new Date(this.task.beginDate).toLocaleDateString("ru-RU", { month: 'short', day: 'numeric' })} - ` +
                `${new Date(this.task.dueDate).toLocaleDateString("ru-RU", { month: 'short', day: 'numeric' })}`;
            },
        },
        components: {
            // ShowAnswerComponent,
            ShowAnswerDialogComponent,
            // CreateAnswerComponent,
            EditTaskDialogComponent,
            LastAnswerComponent,
            CreateAnswerDialogComponent,
        },
    }
</script>

<style scoped>
.shrink-block {
  flex-shrink: 1;
}

.v-card-text {
  line-height: 1.5rem;
}
</style>
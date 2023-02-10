<template>
    <v-card
    class="mx-auto mt-8"
    color="#26c6da"
    theme="dark"
    max-width="550"
    rounded="xl"
    prepend-icon="mdi-alert-octagon-outline"
  >

    <template v-slot:prepend>
      <v-icon size="x-large"></v-icon>
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
              v-show="$route.path == '/about'"
              color="blue"
              @click="showAnswers = false; showEdit = !showEdit"
            >
              Изменить
            </v-btn>

            <v-btn
              rounded="pill"
              variant="elevated"
              v-show="$route.path == '/about'"
              :disabled="answers.length === 0"
              color="green"
              @click="showEdit = false; showAnswers = !showAnswers"
            >
              Ответы
            </v-btn>

            <v-btn
              rounded="pill"
              variant="elevated"
              v-show="($route.path == '/') && (answers.length !== 0)"
              color="green"
              @click="showLastAns = !showLastAns"
            >
              Последний ответ
            </v-btn>

            <v-btn
              rounded="pill"
              variant="elevated"
              v-show="$route.path == '/'"
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
            <LastAnswerComponent :answers="answers"/>
        </v-card-text>
      </div>
    </v-expand-transition>

    <v-expand-transition>
      <div v-show="showAnswers">
        <v-divider></v-divider>
          <ShowAnswerComponent
            v-for="(answer, i) in answers"
            v-bind:key="i"
            v-bind:i="i"
            v-bind:title="answer.title"
            v-bind:body="answer.body"
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

    export default {
        data() {
            return {
              showEdit: false,
              showCreateAns: false,
              showAnswers: false,
              showLastAns: false,
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
        },
        methods: {
            
        },
        components: {
            ShowAnswerComponent,
            CreateAnswerComponent,
            EditTaskComponent,
            LastAnswerComponent,
        },
    }
</script>

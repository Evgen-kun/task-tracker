<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <v-card
        class="mx-auto elevation-0"
        max-width="500"
        rounded="xl"
      >
        <v-card-item>
          <div class="text-subtitle-1">
            {{ dayOfWeek }}
          </div>
        </v-card-item>
        <v-card-text class="text-h4 line-h">
          Добро пожаловать, {{ name }}
        </v-card-text>
      </v-card>

      <v-row align-content="stretch" class="mt-4">
        <v-col class="mx-2">
          <v-card
            width="100%"
            rounded="xl"
            class="elevation-0"
          >
            <v-card-title>
              Задачи
            </v-card-title>
            <v-card-item>
              <v-btn-toggle
                v-model="toggleValue"
                rounded="pill"
                color="deep-purple-accent-3"
                variant="text"
                mandatory
              >
                <v-btn value="toMe">
                  Входящие
                </v-btn>

                <v-btn value="fromMe">
                  От меня
                </v-btn>
              </v-btn-toggle>
            </v-card-item>
            <v-card-item>
              <InboxComponent v-if="toggleValue === 'toMe'" />
              <TasksFromMeComponent v-if="toggleValue === 'fromMe'" />
            </v-card-item>
          </v-card>
        </v-col>

        <v-col class="mx-2">
          <v-card
            width="100%"
            rounded="xl"
            class="elevation-0"
          >
            <v-card-title>
              Команды
            </v-card-title>
            <v-card-item>
              <TeamsComponent />
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
import store from '@/plugins/store';
import { mapGetters } from 'vuex';
import InboxComponent from '../task/InboxComponent.vue';
import TasksFromMeComponent from '../task/TasksFromMeComponent.vue';
import TeamsComponent from '../team/TeamsComponent.vue';

export default {
  data() {
    return {
      name: "",
      toggleValue: "toMe",
    }
  },
  methods: {

  },
  computed: {
    ...mapGetters('taskM', {
      tasks: 'getUserTasks',
    }),
    dayOfWeek() {
      const date = new Date().toLocaleDateString("ru-RU", { month: 'long', day: 'numeric' });
      const weekday = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
      return `${weekday[new Date().getDay()]}, ${date}`;
    },
    //sortedTasks: store.getters['taskM/getSortedUserTasks'](this.selectedField),
  },
  components: {
    InboxComponent,
    TasksFromMeComponent,
    TeamsComponent
},
  async created() {
    const user = store.getters['authM/getUser'];
    const userUID = user.uid;
    this.name = user.name;
    console.log(user);
    console.log(store.getters['authM/getToken']);
    await store.dispatch('taskM/getStatuses');
    await store.dispatch('taskM/getProgress');
    await store.dispatch('taskM/getDifficulty');
    await store.dispatch('taskM/query', { userUID: userUID });
    await store.dispatch('userM/usersQuery');
  }
}

</script>

<style scoped>
.line-h {
  line-height: 2rem;
}
</style>
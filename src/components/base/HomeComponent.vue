<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <v-card
        class="mx-auto elevation-0 bg-img"
        max-width="540px"
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

      <v-row class="mt-4">
        <v-col class="mx-2">
          <v-card
            width="100%"
            min-width="540px"
            height="100%"
            rounded="xl"
            class="elevation-0 bg-blur"
            color="rgba(255, 255, 255, 0.4)"
          >
            <v-card-title class="text-h5">
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
            <v-card-item class="overflow-y-auto" style="max-height: 600px;">
              <InboxListComponent v-if="toggleValue === 'toMe'" />
              <TasksFromMeComponent v-if="toggleValue === 'fromMe'" />
            </v-card-item>
          </v-card>
        </v-col>

        <v-col class="mx-2">
          <v-card
            width="100%"
            min-width="540px"
            height="100%"
            rounded="xl"
            class="elevation-0 bg-blur"
            color="rgba(255, 255, 255, 0.4)"
          >
            <v-card-title class="text-h5">
              Команды
            </v-card-title>
            <v-card-item class="overflow-y-auto" style="max-height: 600px;">
              <TeamsComponent />
            </v-card-item>
          </v-card>
        </v-col>

        <v-col class="mx-2">
          <v-card
            width="100%"
            min-width="540px"
            height="100%"
            rounded="xl"
            class="elevation-0 bg-blur"
            color="rgba(255, 255, 255, 0.4)"
          >
            <v-card-title class="text-h5">
              Проекты
            </v-card-title>
            <v-card-item class="overflow-y-auto" style="max-height: 600px;">
              <ProjectsComponent />
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
import InboxListComponent from '../task/InboxListComponent.vue';
import TasksFromMeComponent from '../task/TasksFromMeComponent.vue';
import TeamsComponent from '../team/TeamsComponent.vue';
import ProjectsComponent from '../projects/ProjectsComponent.vue';

export default {
  data() {
    return {
      name: "",
      toggleValue: "toMe",
    }
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
  },
  components: {
    InboxListComponent,
    TasksFromMeComponent,
    TeamsComponent,
    ProjectsComponent
},
  async created() {
    const user = store.getters['authM/getUser'];
    this.name = user.name;
    await store.dispatch('userM/usersQuery');
    await store.dispatch('taskM/getStatuses');
    await store.dispatch('taskM/getProgress');
    await store.dispatch('taskM/getDifficulty');
    await store.dispatch('teamM/queryTeams', { userUID: user.uid, userRoles: user.roles });
    await store.dispatch('projectM/queryProjects', { userUID: user.uid, userRoles: user.roles });
    await store.dispatch('taskM/queryTasksToMe', { userUID: user.uid });
  }
}
</script>

<style scoped>

.line-h {
  line-height: 2rem;
}

.bg-img {
  background-image: url('@/assets/bg/bg-1.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.bg-blur {
  backdrop-filter: blur(10px);
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #6daafa;
  border: 5px solid transparent;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #651fff;
}
</style>
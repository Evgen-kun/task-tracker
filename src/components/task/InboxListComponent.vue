<template>
    <v-container class="fill-height">
        <v-responsive class="d-flex align-center text-center fill-height">
            <TaskComponent
                v-for="task in tasks"
                v-bind:key="task.id"
                v-bind:task="task"
                v-bind:user="task.author"
                v-bind:subtitle="subtitle">
            </TaskComponent>

            <v-card
              v-if="tasks.length === 0"
              class="mx-auto elevation-0"
              color="#eaccff"
              max-width="750px"
              min-width="300px"
              rounded="xl"
            >
              <v-card-title class="text-h5 py-4" style="text-align:center" >
                  Входящих задач нет
              </v-card-title>
            </v-card>
  
        </v-responsive>
    </v-container>
</template>
  
<script>
import store from '@/plugins/store';
import { mapGetters } from 'vuex';
import TaskComponent from './TaskComponent.vue';
  
export default {
    name: 'InboxListComponent',
    data() {
      return {
        //tasks: [],
        selectedField: "author",
        subtitle: "Назначил задачу",
        btnText: "Добавить ответ",
        fields: [
          {
            title: 'Автор',
            value: 'author',
          },
          {
            title: 'Заголовок',
            value: 'title',
          },
          {
            title: 'Прогресс',
            value: 'progress',
          },
          {
            title: 'Статус',
            value: 'status',
          },
        ],
      }
    },
    methods: {
  
    },
    computed: {
      ...mapGetters('taskM', {
        tasks: 'getUserTasks',
      }),
      //sortedTasks: store.getters['taskM/getSortedUserTasks'](this.selectedField),
    },
    components: {
      TaskComponent
    },
    async created() {
      const user = store.getters['authM/getUser'];
      const userUID = user.uid;
      await store.dispatch('taskM/queryTasksToMe', { userUID: userUID });
      await store.dispatch('userM/usersQuery');
    }
}

</script>
  
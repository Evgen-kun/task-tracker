<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <!-- <v-img
        contain
        height="300"
        src=""
      /> -->

      <!-- <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>

      <h1 class="text-h2 font-weight-bold">Vuetify</h1> -->

      <!-- <v-select
        :items="fields"
        :item-title="fields.title"
        :item-value="fields.value"
        label="Фильтрация"
        density="comfortable"
        v-model="selectedField"
      ></v-select> -->

      <TaskComponent
        v-for="task in tasks"
        v-bind:key="task.id"
        v-bind:task="task"
        v-bind:user="task.author"
        v-bind:subtitle="subtitle">
      </TaskComponent>

    </v-responsive>
  </v-container>
</template>

<script>
import store from '@/plugins/store';
import { mapGetters } from 'vuex';
import TaskComponent from './TaskComponent.vue';

export default {
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
    console.log(user);
    console.log(store.getters['authM/getToken']);
    await store.dispatch('taskM/getStatuses');
    await store.dispatch('taskM/getProgress');
    await store.dispatch('taskM/query', { userUID: userUID });
    await store.dispatch('userM/usersQuery');
  }
}

</script>

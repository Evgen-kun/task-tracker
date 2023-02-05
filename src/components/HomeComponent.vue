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

      <TaskComponent
        v-for="(task, i) in tasks"
        v-bind:key="i"
        v-bind:taskID="task.id"
        v-bind:title="task.title"
        v-bind:body="task.body"
        v-bind:user="task.author"
        v-bind:image="task.authorPicture"
        v-bind:subtitle="subtitle"
        v-bind:btn-text="btnText">
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
      subtitle: "Назначил задачу",
      btnText: "Добавить ответ",
    }
  },
  methods: {

  },
  computed: {
    ...mapGetters('taskM', {
      tasks: 'getUserTasks',
    }),
  },
  components: {
    TaskComponent
  },
  async created() {
    const userUID = store.getters['authM/getUserUID'];
    await store.dispatch('taskM/query', { userUID });
  }
}
  //
</script>

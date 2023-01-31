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
        v-for="task in tasks"
        v-bind:title="task.title"
        v-bind:body="task.body"
        v-bind:author="task.author"
        v-bind:image="task.image">
      </TaskComponent>
      
    </v-responsive>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import TaskComponent from './TaskComponent.vue';

export default {
  data() {
    return {
      /*tasksEx: [
        {
          title: "Test 1",
          body: "Task Test 1",
          author: "admin",
          image: "https://randomuser.me/api/portraits/men/87.jpg"
        },
        {
          title: "Test 2",
          body: "Task Test 2",
          author: "admin",
          image: "https://randomuser.me/api/portraits/men/88.jpg"
        },
        {
          title: "Test 3",
          body: "Task Test 3",
          author: "admin",
          image: "https://randomuser.me/api/portraits/men/89.jpg"
        }
      ],*/
      //tasks: [],
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
  }
}
  //
</script>

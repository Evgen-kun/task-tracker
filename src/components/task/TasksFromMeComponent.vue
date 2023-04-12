<template>
    <v-container class="fill-height">
      <v-responsive class="d-flex align-center text-center fill-height">

        <!-- <EditorComponent /> -->
        <CreateTaskComponent />
  
        <TaskComponent
          v-for="task in tasks"
          v-bind:key="task.id"
          v-bind:task="task"
          v-bind:user="task.executor"
          v-bind:subtitle="subtitle">
        </TaskComponent>
        
      </v-responsive>
    </v-container>
</template>
  
<script>
  import store from '@/plugins/store';
  import { mapGetters } from 'vuex';
  //import EditorComponent from './EditorComponent.vue';
  import CreateTaskComponent from './actions/CreateTaskComponent.vue';
  import TaskComponent from './TaskComponent.vue';
  
  export default {
    data() {
      return {
        //tasks: [],
        subtitle: "Исполнитель",
        btnText: "Редактировать",
      }
    },
    methods: {
  
    },
    computed: {
      ...mapGetters('taskM', {
        tasks: 'getTasksFromMe',
        //sordedTasks: 'getSortedTasksFromMe',
      }),
    },
    components: {
      TaskComponent,
      //EditorComponent,
      CreateTaskComponent
    },
    async created() {
      const user = store.getters['authM/getUser'];
      const userUID = user.uid;
      await store.dispatch('taskM/queryTasksFromMe', { userUID: userUID });
      await store.dispatch('userM/usersQuery');
    }
  }
</script>
  
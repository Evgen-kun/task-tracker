<template>
    <v-container class="fill-height">
      <v-responsive class="d-flex align-center text-center fill-height">

        <!-- <EditorComponent /> -->
        <CreateTaskComponent />
  
        <TaskComponent
          v-for="task in tasks"
          v-bind:key="task.id"
          v-bind:taskID="task.id"
          v-bind:title="task.title"
          v-bind:body="task.body"
          v-bind:user="task.executor"
          v-bind:userUID="task.executorUID"
          v-bind:image="task.executorPicture"
          v-bind:answers="task.answers"
          v-bind:taskStatus="task.status"
          v-bind:taskProgress="task.progress"
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
      const userUID = store.getters['authM/getUserUID'];
      await store.dispatch('taskM/queryTasksFromMe', { userUID });
    }
  }
</script>
  
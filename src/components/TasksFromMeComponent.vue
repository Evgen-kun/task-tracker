<template>
    <v-container class="fill-height">
      <v-responsive class="d-flex align-center text-center fill-height">

        <!-- <EditorComponent /> -->
        <CreateTaskComponent />
  
        <TaskComponent
          v-for="(task, i) in tasks"
          v-bind:key="i"
          v-bind:title="task.title"
          v-bind:body="task.body"
          v-bind:user="task.executor"
          v-bind:image="task.executorPicture"
          v-bind:subtitle="subtitle"
          v-bind:btn-text="btnText">
        </TaskComponent>
        
      </v-responsive>
    </v-container>
</template>
  
<script>
  import store from '@/plugins/store';
  import { mapGetters } from 'vuex';
  import EditorComponent from './EditorComponent.vue';
  import CreateTaskComponent from './CreateTaskComponent.vue';
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
      }),
    },
    components: {
    TaskComponent,
    EditorComponent,
    CreateTaskComponent
},
    async created() {
      const userUID = store.getters['authM/getUserUID'];
      await store.dispatch('taskM/queryTasksFromMe', { userUID });
    }
  }
</script>
  
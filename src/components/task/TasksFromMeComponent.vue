<template>
    <v-container class="fill-height">
      <v-responsive class="d-flex align-center text-center fill-height">

        <!-- <EditorComponent /> -->
        <CreateTaskComponent />
  
        <draggable v-model="myList" tag="transition" item-key="id">
          <template #item="{ element: task }">
            <div><TaskComponent
              v-bind:task="task"
              v-bind:user="task.executor"
              v-bind:subtitle="subtitle">
            </TaskComponent></div>
          </template>
        </draggable>

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
  import draggable from 'vuedraggable';
  import store from '@/plugins/store';
  import { mapGetters, mapState } from 'vuex';
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
      ...mapState('taskM', {
        myTasks: 'tasksFromMe',
      }),
      myList: {
        get() {
            return this.myTasks;
        },
        set(value) {
            this.$store.commit('taskM/setTasksFromMe', value);
        }
      },
    },
    components: {
      TaskComponent,
      //EditorComponent,
      CreateTaskComponent,
      draggable
    },
    async created() {
      const user = store.getters['authM/getUser'];
      const userUID = user.uid;
      await store.dispatch('taskM/queryTasksFromMe', { userUID: userUID });
      await store.dispatch('userM/usersQuery');
    }
  }
</script>
  
<style scoped>

</style>
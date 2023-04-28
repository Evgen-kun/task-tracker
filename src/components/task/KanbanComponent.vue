<template>
    <div class="d-flex flex-row">
        <KanbanColumnComponent
            v-for="column in columns"
            v-bind:key="column.id"
            v-bind:title="column.title"
            v-bind:tasks="tasks.filter(task => task.status === column.title)"
        ></KanbanColumnComponent>
    </div>
</template>
  
<script>
  // import draggable from 'vuedraggable';
  import store from '@/plugins/store';
  import { mapState } from 'vuex';
  import KanbanColumnComponent from './KanbanColumnComponent.vue';
  //import EditorComponent from './EditorComponent.vue';
  
  export default {
    data() {
      return {
        columns: [
            {
                id: 1,
                title: "Не выполнено"
            },
            {
                id: 2,
                title: "Выполняется"
            },
            {
                id: 3,
                title: "Выполнено"
            },
        ],
      }
    },
    methods: {
  
    },
    computed: {
      // ...mapGetters('taskM', {
      //   tasks: 'getTasksFromMe',
      // }),
      tasks() { 
        // return this.$store.getters['taskM/getTasksFromMeByProjectID'](this.$route.params.projectID); 
        return this.$store.getters['taskM/getTasksFromProjectsByProjectID'](this.$route.params.projectID);
      },
      ...mapState('taskM', {
        // myTasks: 'tasksFromMe',
        myTasks: 'tasksFromProjects',
      }),
      myList: {
        get() {
            return this.myTasks;
        },
        set(value) {
            // this.$store.commit('taskM/setTasksFromMe', value);
            this.$store.commit('taskM/setTasksFromProjects', value);
        }
      },
    },
    components: {
      // draggable,
      KanbanColumnComponent
    },
    async created() {
      // const user = store.getters['authM/getUser'];
      // await store.dispatch('taskM/queryTasksFromMe', { userUID: user.uid });
      await store.dispatch('taskM/queryTasksFromProjects');
      await store.dispatch('userM/usersQuery');
    }
  }
</script>
  
<style>
.v-card {
    background-color: rgba(220, 220, 220, 1);
}
</style>
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
  import draggable from 'vuedraggable';
  import store from '@/plugins/store';
  import { mapGetters, mapState } from 'vuex';
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
      draggable,
      KanbanColumnComponent
    },
    async created() {
      const user = store.getters['authM/getUser'];
      const userUID = user.uid;
      await store.dispatch('taskM/queryTasksFromMe', { userUID: userUID });
      await store.dispatch('userM/usersQuery');
    }
  }
</script>
  
<style>
.v-card {
    background-color: rgba(220, 220, 220, 1);
}
</style>
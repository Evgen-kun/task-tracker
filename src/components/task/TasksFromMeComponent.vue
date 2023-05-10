<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <v-btn
        color="deep-purple-accent-3"
        rounded="pill"
      >
        Создать задачу
        <CreateTaskDialogComponent />
      </v-btn>

      <draggable v-model="myList" tag="transition" item-key="id">
        <template #item="{ element: task }">
          <div><TaskComponent
            v-bind:task="task"
            v-bind:user="task.executor"
            v-bind:subtitle="subtitle">
          </TaskComponent></div>
        </template>
      </draggable>
    </v-responsive>
  </v-container>
</template>
  
<script>
import draggable from 'vuedraggable';
import store from '@/plugins/store';
import { mapGetters, mapState } from 'vuex';
import CreateTaskDialogComponent from './actions/dialog/CreateTaskDialogComponent.vue';
import TaskComponent from './TaskComponent.vue';
  
export default {
  data() {
    return {
      subtitle: "Исполнитель",
      btnText: "Редактировать",
    }
  },
  computed: {
    ...mapGetters('taskM', {
      tasks: 'getTasksFromMe',
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
    CreateTaskDialogComponent,
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
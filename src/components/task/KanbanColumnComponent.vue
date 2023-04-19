<template>
    <div class="mr-3">
        <v-card
            min-width="350px"
            max-width="400px"
        >
            <v-toolbar
            color="info"
            density="compact"
            dark
            >
                <v-toolbar-title>
                    {{ title }}
                </v-toolbar-title>

                <!-- <v-spacer></v-spacer>

                <v-btn icon @click="">
                    <v-icon>mdi-plus</v-icon>
                </v-btn> -->
            </v-toolbar>

            <draggable v-model="myList" class="list-group" group="tasks" tag="transition" item-key="id">
                <template #item="{ element: task }">
                    <v-card-item>
                        <TaskComponent
                            v-bind:task="task"
                            v-bind:user="task.executor"
                            v-bind:subtitle="subtitle">
                        </TaskComponent>
                    </v-card-item>
                </template>
            </draggable>
        </v-card>
    </div>
</template>
  
<script>
  import draggable from 'vuedraggable';
  import { mapGetters, mapState } from 'vuex';
  import TaskComponent from './TaskComponent.vue';
  //import EditorComponent from './EditorComponent.vue';
  
  export default {
    data() {
      return {
        subtitle: "",
      }
    },
    props: {
        title: {
            type: String,
            required: true
        },
        tasks: {
            type: Array,
            required: true
        },
    },
    methods: {
        
    },
    computed: {
      ...mapState('taskM', {
        myTasks: 'tasksFromMe',
      }),
      myList: {
        get() {
            return this.myTasks.filter(task => task.status === this.title);
        },
        set(value) {
            this.$store.dispatch('taskM/replaceTasksFromMe', { tasks: value, status: this.title });
            // this.$store.commit('taskM/replaceTasksFromMe', { tasks: value, title: this.title });
        }
      },
    },
    components: {
      draggable,
      TaskComponent
    },
  }
</script>
  
<style>
.v-card {
    background-color: rgba(220, 220, 220, 1);
}

.v-toolbar-title {
    min-width: 200px;
}

.v-list-item__content {
    max-width: 100px;
}
</style>
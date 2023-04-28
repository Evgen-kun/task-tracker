<template>
    <!-- <v-sheet
        class="mx-auto"
        max-width="600"
        rounded="pill"
    >
        <v-slide-group
            v-model="projectsFilter"
            show-arrows
            selected-class="bg-primary"
            multiple
        >
            <v-slide-group-item
                v-for="project in projects"
                :key="project.id"
                v-slot="{ isSelected, toggle }"
            >
                <v-btn
                    class="ma-2"
                    rounded
                    :color="isSelected ? 'primary' : undefined"
                    @click="toggle"
                >
                    {{ project.title }}
                </v-btn>
            </v-slide-group-item>
        </v-slide-group>
    </v-sheet> -->
    <v-sheet
        class="mx-auto"
        max-width="500"
        rounded="lg"
    >
        <v-autocomplete
            v-model="projectsFilter"
            class="mt-5 mx-auto rounded-lg"
            chips
            label="Отсортировать по проектам"
            :items="projects"
            item-title="title"
            item-value="id"
            multiple
            variant="outlined"
        ></v-autocomplete>
    </v-sheet>
    <div class="d-flex flex-row mt-5 mx-auto overflow-x-auto">
        <KanbanColumnComponent
            v-for="column in columns"
            v-bind:key="column.id"
            v-bind:column="column"
            v-bind:tasks="filteredTasks.filter(task => (task.class === column.title) && (task.status !== 'Выполнено'))"
        ></KanbanColumnComponent>
    </div>
</template>
  
<script>
  import store from '@/plugins/store';
  import { mapGetters } from 'vuex';
  import KanbanColumnComponent from './KanbanColumnComponent.vue';
  //import EditorComponent from './EditorComponent.vue';
  
  export default {
    data() {
      return {
        projectsFilter: [],
        columns: [
            {
                id: 1,
                title: "Просроченные"
            },
            {
                id: 2,
                title: "Сегодня - 7 дней"
            },
            {
                id: 3,
                title: "8 - 30 дней"
            },
            {
                id: 4,
                title: "Больше 30 дней"
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
      ...mapGetters({
            myTasks: 'taskM/getUserTasks',
        }),
        projects() {
            const projects = [];
            if(this.myTasks.filter(task => task.project === null).length !== 0) 
                projects.push({ id: 'tasks-without-project', title: 'Личные' });
            this.myTasks.forEach(task => {
                if(task.project !== null && !projects.map(pr => pr.id).includes(task.project.id)) 
                    projects.push({ id: task.project.id, title: task.project.title });
            });
            return projects;
        },
        tasks() {
            if(this.projectsFilter.length === 0) return this.myTasks;
            console.log(this.myTasks);
            console.log(this.projectsFilter);
            const filteredTasks = [];
            const filter = this.projectsFilter;
            const tasks = this.myTasks;
            if(filter.includes('tasks-without-project')) filteredTasks.push(...tasks.filter(task => task.project === null));
            const tasksWithProjects = tasks.filter(task => task.project !== null);
            const ans = filteredTasks.concat(tasksWithProjects.filter(task => filter.includes(task.project.id)));
            console.log(ans);
            return ans;
        },
        filteredTasks() {
            const tasks = this.tasks;
            tasks.forEach(task => {
                if(new Date(task.dueDate) < new Date()) task.class = 'Просроченные';
                if((new Date(task.dueDate) >= new Date()) &&
                    (new Date(task.dueDate) < new Date().setDate(new Date().getDate() + 7))) task.class = 'Сегодня - 7 дней';
                if((new Date(task.dueDate) >= new Date().setDate(new Date().getDate() + 8)) &&
                    (new Date(task.dueDate) < new Date().setDate(new Date().getDate() + 30))) task.class = '8 - 30 дней';
                if(new Date(task.dueDate) >= new Date().setDate(new Date().getDate() + 31)) task.class = 'Больше 30 дней';
            });
            return tasks;
        },
    },
    components: {
      KanbanColumnComponent
    },
    async created() {
      const user = store.getters['authM/getUser'];
      const userUID = user.uid;
      await store.dispatch('taskM/queryTasksToMe', { userUID: userUID });
      await store.dispatch('userM/usersQuery');
    }
  }
</script>
  
<style scoped>
.v-card {
    background-color: rgba(220, 220, 220, 1);
}

.v-sheet {
    background-color: rgba(255, 255, 255, 0.0);
}
</style>
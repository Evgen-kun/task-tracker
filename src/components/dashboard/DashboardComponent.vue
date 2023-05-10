<template>
    <div class="d-flex flex-row mt-3">
        <DashboardCardComponent 
            v-for="item in items"
            v-bind:key="item.id"
            v-bind:item="item">
        </DashboardCardComponent>
    </div>
    <div class="d-flex flex-row mt-3">
        <DashboardStatusChartComponent />
        <DashboardLoadingChartComponent />
    </div>
</template>
    
<script>
import store from '@/plugins/store';
import DashboardCardComponent from './DashboardCardComponent.vue';
import DashboardStatusChartComponent from './DashboardStatusChartComponent.vue';
import DashboardLoadingChartComponent from './DashboardLoadingChartComponent.vue';
  
export default {
    name: "DashboardComponent",
    data() {
        return {
            items: [],
            tasks: [],
            complitedTasks: [],
            uncomplitedTasks: [],
            inProgressTasks: [],
        }
    },
    // props: {
        // team: {
        //     type: Object,
        //     required: true
        // },
    // },
    components: {
        DashboardCardComponent,
        DashboardStatusChartComponent,
        DashboardLoadingChartComponent
    },
    methods: {
        
    },
    computed: {
        // ...mapState('taskM', {
        //     tasks: 'tasksFromMe',
        // }),
    },
    async created() {
        // const user = store.getters['authM/getUser'];
        // await store.dispatch('taskM/queryTasksFromMe', { userUID: userUID });
        await store.dispatch('taskM/queryTasksFromProjects');
        await store.dispatch('userM/usersQuery');

        // this.tasks = store.getters['taskM/getTasksFromMe'];
        // this.tasks = store.getters['taskM/getTasksFromMeByProjectID'](this.$route.params.projectID);
        this.tasks = store.getters['taskM/getTasksFromProjectsByProjectID'](this.$route.params.projectID);

      
        this.items = [
            {
                id: 1,
                title: "Завершённые задачи",
                value: this.tasks.filter(task => task.status === "Выполнено").length
            },
            {
                id: 2,
                title: "Незавершённые задачи",
                value: this.tasks.filter(task => task.status === "Не выполнено").length
            },
            {
                id: 3,
                title: "Просроченные задачи",
                value: this.tasks.filter(task => new Date(task.dueDate) < new Date()).length
            },
            {
                id: 4,
                title: "Всего задач",
                value: this.tasks.length
            },
        ];
    },
  }
</script>
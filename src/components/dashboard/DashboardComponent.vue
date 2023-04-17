<template>
    <div class="d-flex flex-row">
        <DashboardCardComponent 
            v-for="item in items"
            v-bind:key="item.id"
            v-bind:item="item">
        </DashboardCardComponent>
    </div>
    <div>
        <!-- <DashboardChartComponent /> -->
    </div>
</template>
    
<script>
import store from '@/plugins/store';
import DashboardCardComponent from './DashboardCardComponent.vue';
// import DashboardChartComponent from './DashboardChartComponent.vue';
  
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
        // DashboardChartComponent
    },
    methods: {
        
    },
    computed: {
        // ...mapState('taskM', {
        //     tasks: 'tasksFromMe',
        // }),
        dashboardChartData() {
            return [this.uncomplitedTasks, this.inProgressTasks, this.complitedTasks];
        }
    },
    async created() {
        const user = store.getters['authM/getUser'];
        const userUID = user.uid;
        await store.dispatch('taskM/queryTasksFromMe', { userUID: userUID });
        await store.dispatch('userM/usersQuery');

        this.complitedTasks = store.getters['taskM/getFilteredByStatusTasks']("Выполнено");
        this.uncomplitedTasks = store.getters['taskM/getFilteredByStatusTasks']("Не выполнено");
        this.inProgressTasks = store.getters['taskM/getFilteredByStatusTasks']("Выполняется");
        this.tasks = store.getters['taskM/getTasksFromMe'];
      
        this.items = [
            {
                id: 1,
                title: "Завершённые задачи",
                value: this.complitedTasks.length
            },
            {
                id: 2,
                title: "Незавершённые задачи",
                value: this.uncomplitedTasks.length
            },
            {
                id: 3,
                title: "Просроченные задачи",
                value: 0
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
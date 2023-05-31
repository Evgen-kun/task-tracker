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
    components: {
        DashboardCardComponent,
        DashboardStatusChartComponent,
        DashboardLoadingChartComponent
    },
    async created() {
        await store.dispatch('taskM/queryTasksFromProjects');
        await store.dispatch('userM/usersQuery');
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
                value: this.tasks.filter(task => task.status !== "Выполнено").length
            },
            {
                id: 3,
                title: "Просроченные задачи",
                value: this.tasks.filter(task => (new Date(task.dueDate) < new Date()) && (task.status !== "Выполнено")).length
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
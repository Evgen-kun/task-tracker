<template>
    <v-container fluid class="dashboard">
        <v-responsive class="d-flex">
            <div class="d-flex flex-column align-center pa-1">
                <v-btn-toggle
                v-model="toggle"
                color="primary"
                rounded="lg"
                variant="outlined"
                mandatory
                >
                    <v-btn icon="mdi-view-list" value="tasklist" title="Список">
                        <!-- <v-tooltip
                            activator="parent"
                            location="bottom"
                        >Список</v-tooltip> -->
                    </v-btn>
                    <v-btn icon="mdi-chart-gantt" value="gantt" title="Хронология"></v-btn>
                    <v-btn icon="mdi-view-parallel" value="kanban" title="Доска"></v-btn>
                    <v-btn icon="mdi-view-dashboard" value="dashboard" title="Панель мониторинга"></v-btn>
                </v-btn-toggle>
            </div>
            <div v-if="toggle === 'gantt'">
                <GanttComponent />

            </div>
            <div v-if="toggle === 'kanban'">
                <KanbanComponent />
            </div>
            <div v-if="toggle === 'tasklist'">
                <!-- <TaskListComponent /> -->
                <TaskListVuetifyComponent />
            </div>
            <div v-if="toggle === 'dashboard'">
                <DashboardComponent />
            </div>
            <!-- <GanttElastic /> -->
      </v-responsive>
    </v-container>
</template>
  
<script>
// @ is an alias to /src
// import GanttDashboardComponent from '@/components/gantt/GanttDashboardComponent.vue.js';
import DashboardComponent from '@/components/dashboard/DashboardComponent.vue';
import GanttComponent from '@/components/gantt/GanttComponent.vue';
import KanbanComponent from '@/components/task/KanbanComponent.vue';
// import TaskListComponent from '@/components/task/TaskListComponent.vue';
import TaskListVuetifyComponent from '@/components/task/TaskListVuetifyComponent.vue';
// import GanttElastic from '@/components/gantt/GanttElastic.vue';

export default {
    name: "DashboardView",
    components: {
    // GanttDashboardComponent,
    DashboardComponent,
    GanttComponent,
    // TaskListComponent,
    KanbanComponent,
    TaskListVuetifyComponent,
    // GanttElastic
},
    data() {
        return {
            toggle: "tasklist",
        }
    },
    created() {
        this.$watch(() => this.$route.params, (toParams, previousParams) => {
            // react to route changes...
        })
    },
};
</script>

<style>

</style>
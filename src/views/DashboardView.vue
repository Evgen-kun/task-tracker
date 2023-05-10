<template>
    <v-container fluid class="dashboard">
        <v-responsive class="d-flex">
            <div class="d-flex flex-column align-center pa-1">
                <v-btn-toggle
                    v-model="toggle"
                    class="elevation-5"
                    color="deep-purple-accent-3"
                    rounded="lg"
                    mandatory
                >
                    <v-btn icon="mdi-view-list" value="tasklist" title="Список"></v-btn>
                    <v-btn icon="mdi-chart-gantt" value="gantt" title="Хронология"></v-btn>
                    <v-btn icon="mdi-view-parallel" value="kanban" title="Доска"></v-btn>
                    <v-btn icon="mdi-view-dashboard" value="dashboard" title="Панель мониторинга"></v-btn>
                </v-btn-toggle>
            </div>
            <div class="mt-5">
                <GanttComponent v-if="toggle === 'gantt'" />
                <KanbanComponent v-if="toggle === 'kanban'" />
                <TaskListVuetifyComponent v-if="toggle === 'tasklist'" />
                <DashboardComponent v-if="toggle === 'dashboard'" />
            </div>
      </v-responsive>
    </v-container>
</template>
  
<script>
import DashboardComponent from '@/components/dashboard/DashboardComponent.vue';
import GanttComponent from '@/components/gantt/GanttComponent.vue';
import KanbanComponent from '@/components/task/KanbanComponent.vue';
import TaskListVuetifyComponent from '@/components/task/TaskListVuetifyComponent.vue';

export default {
    name: "DashboardView",
    components: {
        DashboardComponent,
        GanttComponent,
        KanbanComponent,
        TaskListVuetifyComponent,
    },
    data() {
        return {
            toggle: "tasklist",
        }
    },
};
</script>

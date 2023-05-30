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
                    <v-tooltip location="bottom" text="Список">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon="mdi-view-list" value="tasklist"></v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip location="bottom" text="Хронология">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon="mdi-chart-gantt" value="gantt"></v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip location="bottom" text="Доска">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon="mdi-view-parallel" value="kanban"></v-btn>
                        </template>
                    </v-tooltip>
                    <v-tooltip location="bottom" text="Панель мониторинга">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon="mdi-view-dashboard" value="dashboard"></v-btn>
                        </template>
                    </v-tooltip>
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

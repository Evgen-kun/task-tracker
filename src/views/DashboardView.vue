<template>
    <v-container fluid class="dashboard">
        <v-responsive class="d-flex">
            <div class="d-flex flex-column align-left pa-1">
                <v-btn-toggle
                v-model="toggle"
                color="primary"
                rounded="lg"
                variant="text"
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
                    <v-btn icon="mdi-calendar-today" value="calendar" title="Календарь"></v-btn>
                    <v-btn icon="mdi-view-dashboard" value="dashboard" title="Панель мониторинга"></v-btn>
                </v-btn-toggle>
            </div>
            <div v-if="toggle === 'gantt'">
                <GanttComponent />
            </div>
            <div v-if="toggle === 'kanban'">
                <DashboardComponent />
            </div>
            <!-- <GanttElastic /> -->
      </v-responsive>
    </v-container>
</template>
  
<script>
// @ is an alias to /src
import DashboardComponent from '@/components/gantt/DashboardComponent.vue';
import GanttComponent from '@/components/gantt/GanttComponent.vue';
// import GanttElastic from '@/components/GanttElastic.vue';

export default {
    name: "DashboardView",
    components: {
        DashboardComponent,
        GanttComponent,
        // GanttElastic
    },
    data() {
        return {
            toggle: "gantt",
        }
    },
    created() {
        this.$watch(() => this.$route.params, (toParams, previousParams) => {
            // react to route changes...
        })
    },
};
</script>

<template>
    <v-container fluid class="dashboard">
        <v-responsive class="d-flex">
            <GanttComponent />
            <!-- <GanttElastic /> -->
            <!-- <DashboardComponent /> -->
      </v-responsive>
    </v-container>
</template>
  
<script>
// @ is an alias to /src
// import DashboardComponent from '@/components/DashboardComponent.vue';
import GanttComponent from '@/components/gantt/GanttComponent.vue';
// import GanttElastic from '@/components/GanttElastic.vue';

export default {
    name: "DashboardView",
    components: {
        // DashboardComponent,
        GanttComponent,
        // GanttElastic
    },
    data() {
        return {
            
        }
    },
    created() {
        this.$watch(() => this.$route.params, (toParams, previousParams) => {
            // react to route changes...
        })
    },
};
</script>

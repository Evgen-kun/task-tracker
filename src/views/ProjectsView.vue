<template>
  <v-container class="projects">
    <v-responsive class="d-flex flex-wrap">
      <ProjectsComponent />
    </v-responsive>
  </v-container>
</template>
  
<script>
import ProjectsComponent from '@/components/projects/ProjectsComponent.vue';
  
export default {
    name: "ProjectsView",
    components: { ProjectsComponent }
};
</script>
  
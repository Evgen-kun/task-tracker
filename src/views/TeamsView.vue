<template>
    <v-container class="teams">
      <v-responsive class="d-flex flex-wrap">
        <TeamsComponent />
      </v-responsive>
    </v-container>
  </template>
  
  <script>
  // @ is an alias to /src
  import TeamsComponent from '@/components/team/TeamsComponent.vue';
  
  export default {
    name: "TeamsView",
    components: {
        TeamsComponent,
    },
  };
  </script>
  
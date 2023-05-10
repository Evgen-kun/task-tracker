<template>
  <v-container class="teams">
    <v-responsive class="d-flex flex-wrap">
      <TeamsComponent />
    </v-responsive>
  </v-container>
</template>
  
<script>
import TeamsComponent from '@/components/team/TeamsComponent.vue';

export default {
  name: "TeamsView",
  components: { TeamsComponent }
};
</script>
  
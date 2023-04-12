<template>
  <v-container class="home">
    <v-responsive class="d-flex align-center text-center fill-height">
      <HomeComponent />
    </v-responsive>
  </v-container>
</template>

<script>
// @ is an alias to /src
import HomeComponent from "@/components/task/HomeComponent.vue";

export default {
  name: "HomeView",
  components: {
    HomeComponent,
  },
};
</script>

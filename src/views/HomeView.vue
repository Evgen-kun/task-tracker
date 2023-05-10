<template>
  <v-container class="home">
    <v-responsive class="d-flex align-center text-center fill-height">
      <HomeComponent />
    </v-responsive>
  </v-container>
</template>

<script>
import HomeComponent from "@/components/base/HomeComponent.vue";

export default {
  name: "HomeView",
  components: { HomeComponent }
};
</script>

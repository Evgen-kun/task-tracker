<template>
  <v-container class="home">
    <v-responsive class="d-flex align-center text-center fill-height">
      <HelloWorld />
    </v-responsive>
  </v-container>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
};
</script>

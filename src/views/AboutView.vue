<template>
  <v-container class="about">
    <v-responsive class="d-flex align-center text-center fill-height">
      <TasksFromMeComponent />
    </v-responsive>
  </v-container>
</template>

<script>
// @ is an alias to /src
import TasksFromMeComponent from "@/components/TasksFromMeComponent.vue";

export default {
  name: "AboutView",
  components: {
    TasksFromMeComponent,
  },
};
</script>
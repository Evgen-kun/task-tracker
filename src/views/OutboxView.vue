<template>
  <v-container class="outbox">
    <v-responsive class="d-flex align-center text-center fill-height">
      <TasksFromMeComponent />
    </v-responsive>
  </v-container>
</template>

<script>
import TasksFromMeComponent from "@/components/task/TasksFromMeComponent.vue";

export default {
  name: "OutboxView",
  components: { TasksFromMeComponent }
};
</script>
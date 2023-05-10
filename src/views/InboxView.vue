<template>
  <v-container class="inbox">
    <v-responsive class="d-flex align-center text-center fill-height">
      <InboxKanbanComponent />
    </v-responsive>
  </v-container>
</template>

<script>
import InboxKanbanComponent from '@/components/task/InboxKanbanComponent.vue';

export default {
    name: "InboxView",
    components: { InboxKanbanComponent }
};
</script>
  
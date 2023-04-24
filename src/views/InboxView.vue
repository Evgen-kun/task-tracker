<template>
    <v-container class="inbox">
      <v-responsive class="d-flex align-center text-center fill-height">
        <!-- <InboxListComponent /> -->
        <InboxKanbanComponent />
      </v-responsive>
    </v-container>
</template>

<script>
// @ is an alias to /src
// import InboxListComponent from "@/components/task/InboxListComponent.vue";
import InboxKanbanComponent from '@/components/task/InboxKanbanComponent.vue';

export default {
    name: "InboxView",
    components: {
      // InboxListComponent,
      InboxKanbanComponent
    },
};
</script>
  
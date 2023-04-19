<template>
    <v-container class="inbox">
      <v-responsive class="d-flex align-center text-center fill-height">
        <InboxComponent />
      </v-responsive>
    </v-container>
</template>

<script>
// @ is an alias to /src
import InboxComponent from "@/components/task/InboxComponent.vue";

export default {
    name: "InboxView",
    components: {
        InboxComponent,
    },
};
</script>
  
<template>
    <v-container class="panel">
      <v-responsive class="d-flex align-center text-center fill-height">
        <PanelComponent />
      </v-responsive>
    </v-container>
</template>

<script>
// @ is an alias to /src
import PanelComponent from "@/components/base/PanelComponent.vue";

export default {
    name: "PanelView",
    components: {
        PanelComponent,
    },
};
</script>
  
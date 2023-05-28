<template>
  <v-dialog
    v-model="show"
    activator="parent"
    max-width="1000"
    transition="dialog-top-transition"
  >
    <EditTaskComponent 
      :task="task" 
      :userUID="userUID"
      :type="type"
      @closeEvent="show = !show"
    ></EditTaskComponent>
  </v-dialog>
</template>

<script>
import EditTaskComponent from '../cards/EditTaskComponent.vue';

export default {
  data() {
    return {
      show: false,
      type: "fromMe"
    }
  },
  props: {
      task: {
          type: Object,
          required: true
      },
      userUID: {
          type: String,
          required: true
      },
  },
  components: {
    EditTaskComponent,
  },
}
</script>
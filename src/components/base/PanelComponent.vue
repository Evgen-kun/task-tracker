<template>
    <v-container class="fill-height"></v-container>
</template>
  
<script>
import store from '@/plugins/store';
  
export default {
    name: 'PanelComponent',
    data() {
      return {}
    },
    async created() {
      const user = store.getters['authM/getUser'];
      this.name = user.name;
    }
}

</script>
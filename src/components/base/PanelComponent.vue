<template>
    <v-container class="fill-height">

    </v-container>
</template>
  
<script>
import store from '@/plugins/store';
  
export default {
    name: 'PanelComponent',
    data() {
      return {
        
      }
    },
    methods: {
  
    },
    computed: {
        
    },
    components: {
      
    },
    async created() {
      const user = store.getters['authM/getUser'];
      const userUID = user.uid;
      this.name = user.name;
      // console.log(user);
      console.log(store.getters['authM/getToken']);
    }
}

</script>
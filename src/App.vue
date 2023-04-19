<template>
  <v-app>
    <NavigationComponent v-if="$route.name !== 'login'"/>
    <v-main>
      <router-view :key="$route.path"/>
    </v-main>
  </v-app>
</template>

<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  //import HomeComponent from '@/components/HomeComponent.vue'
  import NavigationComponent from '@/components/base/NavigationComponent.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

main {
  background-image: url('@/assets/bg/bg-2.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

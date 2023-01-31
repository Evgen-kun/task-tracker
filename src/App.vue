<template>
  <v-app>
    <NavigationComponent />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  //import HomeComponent from '@/components/HomeComponent.vue'
  import NavigationComponent from '@/components/NavigationComponent.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

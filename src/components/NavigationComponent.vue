<template>
    <v-card>
        <v-navigation-drawer
        expand-on-hover
        rail
        >
        <v-list>
            <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            title="Sandra Adams"
            subtitle="sandra_a88@gmailcom"
            ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <router-link to="/">
                <v-list-item prepend-icon="mdi-folder" title="Home" value="myfiles"></v-list-item>
            </router-link>
            <router-link to="/about">
                <v-list-item prepend-icon="mdi-account-multiple" title="About" value="shared"></v-list-item>
            </router-link>
        </v-list>
        </v-navigation-drawer>
    </v-card>
</template>

<script>
    import { RouterLink, RouterView } from 'vue-router'
    export default {  }
</script>

<style>
    a {
        text-decoration: none; 
        color: inherit;
    }
</style>
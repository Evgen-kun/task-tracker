<template>
    <v-app-bar
        color="primary"
        title="Task Tracker"
        density="compact"
    >
      <!-- <v-spacer></v-spacer> -->
    </v-app-bar>

    <v-navigation-drawer
        expand-on-hover
        permanent
        rail
        >
        <v-list>
            <v-list-item
            :prepend-avatar=avatar
            :title=name
            :subtitle=email
            ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <router-link to="/">
                <v-list-item prepend-icon="mdi-folder" title="Главная" value="myfiles"></v-list-item>
            </router-link>
            <router-link to="/about">
                <v-list-item v-if="isManagerOrAdmin" prepend-icon="mdi-account-multiple" title="Мои задачи" value="shared"></v-list-item>
            </router-link>
            <v-list-item v-if="isAuth" prepend-icon="mdi-logout" title="Выход" value="logout" v-on:click="onLogoutButtonClick"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import store from '@/plugins/store';
import { mapGetters } from 'vuex';
import { RouterLink, RouterView } from 'vue-router'
    export default { 
        data() {
            return {
                drawer: false,
            }
        },
        methods: {
            async onLogoutButtonClick() {
                await this.$store.dispatch('authM/onLogout');
                //await this.$router.push({ name: 'login' });
                location.reload();
            },
        },
        computed: {
            isAuth() {
                return localStorage.hasOwnProperty('token');
            },
            isManagerOrAdmin() {
                const roles = JSON.parse(localStorage.getItem('userRoles')) ?? [];
                return !!((roles.includes('manager')) || (roles.includes('administrator')));
            },
            ...mapGetters('authM', {
                name: 'getUserName',
                email: 'getUserEmail',
                avatar: 'getUserPicture',
            }),
        },
     }
</script>

<style>
    a {
        text-decoration: none; 
        color: inherit;
    }
</style>
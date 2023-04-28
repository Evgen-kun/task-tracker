<template>
    <v-app-bar
        color="primary"
        :title="currentTime"
        density="compact"
    >
      <!-- <v-spacer></v-spacer> -->
    </v-app-bar>

    <v-navigation-drawer
        expand-on-hover
        permanent
        rail
        color="rgba(255, 255, 255, 0.3)"
        class="bg-blur"
    >
        <v-list>
            <v-list-item
            :prepend-avatar=user?.picture?.url
            :title=user?.name
            :subtitle=user?.email
            ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <router-link to="/">
                <v-list-item prepend-icon="mdi-home-outline" title="Главная" value="myfiles"></v-list-item>
            </router-link>
            <router-link to="/inbox">
                <v-list-item prepend-icon="mdi-bell-outline" title="Входящие" value="inbox"></v-list-item>
            </router-link>
            <router-link to="/about">
                <v-list-item prepend-icon="mdi-comment-text-outline" title="Мои задачи" value="shared"></v-list-item>
            </router-link>
            <router-link to="/teams">
                <v-list-item prepend-icon="mdi-account-multiple-outline" title="Команды" value="myteams"></v-list-item>
            </router-link>
            <router-link to="/panel">
                <v-list-item v-if="isAdmin" prepend-icon="mdi-view-dashboard" title="Статистика" value="panel"></v-list-item>
            </router-link>
            <v-list-item v-if="isAuth" prepend-icon="mdi-logout" title="Выход" value="logout" v-on:click="onLogoutButtonClick"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';
    export default { 
        data() {
            return {
                drawer: false,
                currentTime: new Date().toLocaleTimeString('ru-RU', { hour: 'numeric', minute: 'numeric' }),
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
                return Object.prototype.hasOwnProperty.call(localStorage, 'token');
            },
            isManagerOrAdmin() {
                const roles = JSON.parse(localStorage.getItem('user'))?.roles ?? [];
                return !!((roles.includes('manager')) || (roles.includes('administrator')));
            },
            isAdmin() {
                const roles = JSON.parse(localStorage.getItem('user'))?.roles ?? [];
                return !!(roles.includes('administrator'));
            },
            ...mapGetters('authM', {
                user: 'getUser',
            }),
            getTime() {

                const date = new Date().toLocaleTimeString('ru-RU', {
                  hour: 'numeric',
                  minute: 'numeric'
                });
                console.log(date);
                return date;
            }
        },
        created() {
            setInterval(() => {
                this.currentTime = new Date().toLocaleTimeString('ru-RU', {
                  hour: 'numeric',
                  minute: 'numeric'
                });
            }, 1000 * 10);
        },
    }
</script>

<style>
    a {
        text-decoration: none; 
        color: inherit;
    }

    .bg-blur {
        backdrop-filter: blur(10px);
    }
</style>
<template>
    <v-container>
        <v-row>
            <v-col v-for="team in teams" :key="team.id" :cols="(path === '/')? 6 : 3">
                <TeamComponent
                    v-bind:team="team"
                    v-bind:allUsers="users"
                    v-bind:currentUser="currentUser">
                </TeamComponent>
            </v-col>

            <v-col v-if="currentUser.roles.includes('administrator') || currentUser.roles.includes('manager')" :cols="(path === '/')? 6 : 3">
                <CreateTeamComponent :allUsers="users"/>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
import store from '@/plugins/store';
import { mapGetters } from 'vuex';
import TeamComponent from './TeamComponent.vue';
import CreateTeamComponent from './actions/CreateTeamComponent.vue';

export default {
    data() {
        return {}
    },
    computed: {
        ...mapGetters({
            teams: 'teamM/getTeams',
            users: 'userM/getUsers',
        }),
        path() {
            return this.$route.path;
        },
        currentUser() {
            return store.getters['authM/getUser'];
        }
    },
    components: {
        TeamComponent,
        CreateTeamComponent,
    },
    async created() {
        const user = store.getters['authM/getUser'];
        await store.dispatch('userM/usersQuery');
        await store.dispatch('teamM/queryTeams', { userUID: user.uid, userRoles: user.roles });
    }
}
</script>
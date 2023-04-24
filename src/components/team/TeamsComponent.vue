<template>
    <v-container>
        <v-row>
            <v-col v-for="team in teams" :key="team.id">
                <TeamComponent
                    v-bind:team="team"
                    v-bind:allUsers="users">
                </TeamComponent>
            </v-col>

            <v-col>
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
        return {

        }
    },
    methods: {

    },
    computed: {
        ...mapGetters({
            teams: 'teamM/getTeams',
            users: 'userM/getUsers',
        }),
    },
    components: {
        TeamComponent,
        CreateTeamComponent,
    },
    async created() {
        const user = store.getters['authM/getUser'];
        const userUID = user.uid;
        await store.dispatch('userM/usersQuery');
        await store.dispatch('teamM/queryTeams', { userUID: userUID, userRoles: user.roles });
    }
}
</script>

<style>
</style>
<template>
    <v-container>
        <v-row>
            <v-col v-for="team in teams" :key="team.id">
                <TeamComponent
                    v-bind:teamID="team.id"
                    v-bind:title="team.title"
                    v-bind:body="team.body"
                    v-bind:teamUsers="[...team.users.values()].map(user => user.id)"
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
import CreateTeamComponent from './CreateTeamComponent.vue';

export default {
    data() {
        return {

        }
    },
    methods: {

    },
    computed: {
        ...mapGetters('teamM', {
            teams: 'getTeams',
            users: 'getUsers',
        }),
    },
    components: {
        TeamComponent,
        CreateTeamComponent,
    },
    async created() {
        const userUID = store.getters['authM/getUserUID'];
        console.log(store.getters['authM/getToken']);
        await store.dispatch('teamM/queryTeams', { userUID });
        await store.dispatch('teamM/getUsers');
    }
}
</script>

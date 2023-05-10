<template>
    <v-container>
        <v-row>
            <v-col v-for="project in getFilteredProjects" :key="project.id">
                <ProjectComponent
                    v-bind:project="project"
                    v-bind:allTeams="teams"
                    v-bind:currentUser="currentUser">
                </ProjectComponent>
            </v-col>

            <v-col v-if="currentUser.roles.includes('administrator') || currentUser.roles.includes('manager')">
                <CreateProjectComponent :allTeams="teams"/>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
import store from '@/plugins/store';
import { mapGetters } from 'vuex';
import ProjectComponent from './ProjectComponent.vue';
import CreateProjectComponent from './actions/CreateProjectComponent.vue';

export default {
    name: 'ProjectsComponent',
    data() {
        return {}
    },
    computed: {
        ...mapGetters({
            projects: 'projectM/getProjects',
            teams: 'teamM/getTeams',
        }),
        getFilteredProjects() {
            if(this.$route.path === '/') return store.getters['projectM/getProjects'];
            else return store.getters['projectM/getProjectsByTeamID'](this.$route.params.teamID);
        },
        currentUser() {
            return store.getters['authM/getUser'];
        }
    },
    components: {
        ProjectComponent,
        CreateProjectComponent,
    },
    async created() {
        const user = store.getters['authM/getUser'];
        await store.dispatch('teamM/queryTeams', { userUID: user.uid, userRoles: user.roles });
        await store.dispatch('projectM/queryProjects', { userUID: user.uid, userRoles: user.roles });
    }
}
</script>

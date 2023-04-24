<template>
    <v-container>
        <v-row>
            <v-col v-for="project in getFilteredProjects" :key="project.id">
                <ProjectComponent
                    v-bind:project="project"
                    v-bind:allTeams="teams">
                </ProjectComponent>
            </v-col>

            <v-col>
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
        return {

        }
    },
    methods: {

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
    },
    components: {
        ProjectComponent,
        CreateProjectComponent,
    },
    async created() {
        const user = store.getters['authM/getUser'];
        const userUID = user.uid;
        console.log("Параметры роута: ");
        console.log(this.$route.params);
        await store.dispatch('teamM/queryTeams', { userUID: userUID, userRoles: user.roles });
        await store.dispatch('projectM/queryProjects', { userUID: userUID, userRoles: user.roles });
    }
}
</script>

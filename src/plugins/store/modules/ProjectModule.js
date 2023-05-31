import { ProjectsQueryAPI } from "@/api/projectAPI";
import Project from "@/model/Project";

export const ProjectModule = {
    namespaced: true,

    state() {
        return {
            projects: [],
        }
    },

    getters: {
        getProjects: (state) => state.projects,
        getProjectsByTeamID: (state) => (teamID) => { return state.projects.filter(project => project.team.id === teamID) },
        getProjectByID: (state) => (id) => { return state.projects.find(project => project.id === id) },
    },

    mutations: {
        setProjects(state, projects) {
            state.projects = projects;
        },

        addProject(state, project) {
            state.projects.push(project);
        },

        editProject(state, newProject) {
            state.projects.forEach((project, i) => {
                if (project.id === newProject.id) state.projects[i] = newProject;
            });
        },

        deleteProjects(state) {
            state.projects = null;
        },

        deleteProject(state, projectID) {
            state.projects.forEach((project, i) => {
                if (project.id === projectID) state.projects.splice(i, 1);
            });
        },
    },

    actions: {
        async queryProjects({ commit, rootGetters }, { userUID, userRoles }) {
            var res;
            if((!userRoles.includes('manager')) && (!userRoles.includes('administrator'))) {
                const teamsID = rootGetters['teamM/getTeams'].map(team => team.id);
                res = await ProjectsQueryAPI.getProjectsByTeamsID(teamsID);
            }
            else res = await ProjectsQueryAPI.getProjectsByUserUID(userUID);
            const projects = [];
            res.data.data.forEach((item) => {
                const project = new Project();
                project.id = item.id;
                project.title = item.attributes.title;
                project.body = (item.attributes.body !== null)? item.attributes.body.value.replace(/(<p>|<\/p>)/g, '') : null;
                project.team = (item.relationships.field_team?.data?.id)? rootGetters['teamM/getTeamByID'](item.relationships.field_team.data.id) : null;
                project.inProgressRestriction = item.attributes.field_inprogress_restriction;
                projects.push(project);
            });

            commit('setProjects', projects);
        },

        async queryProject({ commit, rootGetters }, { projectID }) {
            var res = await ProjectsQueryAPI.getProject(projectID);
            const project = new Project();
            project.id = res.data.data.id;
            project.title = res.data.data.attributes.title;
            project.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.value.replace(/(<p>|<\/p>)/g, '') : null;
            project.team = (res.data.data.relationships.field_team?.data?.id)? rootGetters['teamM/getTeamByID'](res.data.data.relationships.field_team.data.id) : null;
            project.inProgressRestriction = res.data.data.attributes.field_inprogress_restriction;

            commit('addProject', project);
        },

        getUser({ rootGetters }, { userUID }) {
            const allUsers = rootGetters['userM/getUsers'];
            const user = allUsers.find(user => user.uid === userUID);
            return user;
        },

        async createProject({ commit, rootGetters }, { title, body, inProgressRestriction, teamID }) {
            const res = await ProjectsQueryAPI.createProject(title, body, inProgressRestriction, teamID);
            const project = new Project();
            project.id = res.data.data.id;
            project.title = res.data.data.attributes.title;
            project.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.value : null;
            project.team = (res.data.data.relationships.field_team?.data?.id)? 
                rootGetters['teamM/getTeamByID'](res.data.data.relationships.field_team.data.id) : null;
            project.inProgressRestriction = res.data.data.attributes.field_inprogress_restriction;

            commit('addProject', project);
        },

        async editProject({ getters, rootGetters, commit }, { id, title, body, inProgressRestriction, teamID }) {
            const res = await ProjectsQueryAPI.editProject(id, title, body, inProgressRestriction, teamID);
            const project = getters.getProjectByID(id);
            project.title = res.data.data.attributes.title;
            project.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.value : null;
            project.team = (res.data.data.relationships.field_team?.data?.id)? 
                rootGetters['teamM/getTeamByID'](res.data.data.relationships.field_team.data.id) : null;
            project.inProgressRestriction = res.data.data.attributes.field_inprogress_restriction;

            commit('editProject', project);
        },

        async deleteProject({ commit }, { id }) {
            const res = await ProjectsQueryAPI.deleteProject(id);
            commit('deleteProject', id);
        },
    }
}

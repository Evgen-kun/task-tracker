import { TeamsQueryAPI } from "@/api/teamAPI";
import { QueryAPI } from "@/api/taskAPI";

export const TeamModule = {
    namespaced: true,

    state() {
        return {
            teams: [],
            users: [],
            projects: [],
        }
    },

    getters: {
        getTeams: (state) => state.teams,
        getUsers: (state) => state.users,
        getProjects: (state) => state.projects,
    },

    mutations: {
        setTeams(state, teams) {
            state.teams = teams;
            //localStorage.setItem('teams', teams);
        },

        setUsers(state, users) {
            state.users = users;
        },

        setProjects(state, projects) {
            state.projects = projects;
        },

        addTeam(state, team) {
            state.teams.push(team);
            //localStorage.setItem('teams', state.teams);
        },

        addUser(state, user) {
            state.users.push(user);
            //localStorage.setItem('users', state.users);
        },

        addProject(state, project) {
            state.projects.push(project);
            //localStorage.setItem('projects', state.projects);
        },

        deleteTeams(state) {
            state.teams = null;
            //localStorage.removeItem('teams');
        },

        deleteTeam(state, teamID) {
            state.teams.forEach((team, i) => {
                if (team.id === teamID) state.teams.splice(i, 1);
            });
            //localStorage.setItem('teams', state.teams);
        },

        deleteUsers(state) {
            state.users = null;
        },

        deleteUser(state, userUID) {
            state.users.forEach((user, i) => {
                if (user.id === userUID) state.users.splice(i, 1);
            });
            //localStorage.setItem('users', state.users);
        },

        deleteProjects(state) {
            state.projects = null;
        },

        deleteProject(state, projectID) {
            state.projects.forEach((project, i) => {
                if (project.id === projectID) state.projects.splice(i, 1);
            });
            //localStorage.setItem('projects', state.projects);
        },
    },

    actions: {
        async queryTeams({ commit }, { userUID }) {
            const res = await TeamsQueryAPI.getTeams(userUID);
            console.log(res);

            const teams = [];
            res.data.data.forEach((item, i) => {
                console.log("Новая итерация i");
                const team = {};
                team.id = item.id;
                team.title = item.attributes.title;
                team.body = (item.attributes.body !== null)? item.attributes.body.processed.replace(/(<p>|<\/p>)/g, '') : null;
                team.usersID = item.relationships.field_member.data.map(user => user.id);
                team.users = new Map();

                res.data.included.forEach((itemInc, j) => {
                    if(itemInc.type === 'user--user') {
                        if(team.usersID.includes(itemInc.id)) {
                            const user = {};
                            user.id = itemInc.id;
                            user.name = itemInc.attributes.display_name;
                            user.pictureID = itemInc.relationships.user_picture.data.id;
                            team.users.set(user.id, user);
                        }
                    }
                });

                res.data.included.forEach((itemInc, j) => {
                    if(itemInc.type === 'file--file') {
                        const users = [...team.users.values()];
                        if(users.map(user => user.pictureID).includes(itemInc.id)) {
                            const userID = users.find(user => user.pictureID === itemInc.id).id;
                            const user = team.users.get(userID);
                            user.picture = itemInc.attributes.uri.url;
                            team.users.set(userID, user);
                        }
                    }
                });

                teams.push(team);
                console.log(team);
            });

            commit('setTeams', teams);
        },

        async getUsers({ commit }) {
            const res = await QueryAPI.getUsers();
            console.log(res);

            const users = [];
            console.log(res.data.data.length);
            res.data.data.forEach((item) => {
                if(item.id === "52a3ddd5-2b1f-4b48-b600-14507b648d69" || item.id === "6da4f1c5-7607-4047-a6d0-011ba3e0c6cb") { return; }
                const user = {};
                user.id = item.id;
                user.name = `${item.attributes.display_name} (${item.attributes.drupal_internal__uid})`;
                users.push(user);
            });

            console.log(users);
            commit('setUsers', users);
        },

        async createTeam({ commit }, { title, body, users }) {
            const res = await TeamsQueryAPI.createTeam(title, body, users);
            console.log(res);

            const team = {};
            team.id = res.data.data.id;
            team.title = res.data.data.attributes.title;
            team.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.processed.replace(/(<p>|<\/p>)/g, '') : null;
            team.usersID = users;
            team.users = new Map();

            console.log(team);
            commit('addTeam', team);
        },

        async editTeam({ commit }, { id, title, body, executorsUID }) {
            
        },

        async deleteTeam({ commit }, { id }) {
            console.log("Team id: " + id);
            const res = await TeamsQueryAPI.deleteTeam(id);
            console.log(res);

            commit('deleteTeam', id);
        },
    }
}

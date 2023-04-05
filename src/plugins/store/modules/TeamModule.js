import { TeamsQueryAPI } from "@/api/teamAPI";
const ADMIN_ID = '6da4f1c5-7607-4047-a6d0-011ba3e0c6cb';
const GUEST_ID = '52a3ddd5-2b1f-4b48-b600-14507b648d69';

export const TeamModule = {
    namespaced: true,

    state() {
        return {
            teams: [],
            users: [],
        }
    },

    getters: {
        getTeams: (state) => state.teams,
        getTeamByID: (state) => (id) => { return state.teams.find(team => team.id === id) },
        getUsers: (state) => state.users,
    },

    mutations: {
        setTeams(state, teams) {
            state.teams = teams;
            //localStorage.setItem('teams', teams);
        },

        setUsers(state, users) {
            state.users = users;
        },

        addTeam(state, team) {
            state.teams.push(team);
            //localStorage.setItem('teams', state.teams);
        },

        addUser(state, user) {
            state.users.push(user);
            //localStorage.setItem('users', state.users);
        },

        editTeam(state, newTeam) {
            state.teams.forEach((team, i) => {
                if (team.id === newTeam.id) state.teams[i] = newTeam;
            });
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
                team.body = (item.attributes.body !== null)? item.attributes.body.value : null;
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
            const res = await TeamsQueryAPI.getAllUsers();
            console.log(res);

            const users = new Map();
            res.data.data.forEach((item) => {
                if(item.id === GUEST_ID || item.id === ADMIN_ID) { return; }
                const user = {};
                user.id = item.id;
                user.name = item.attributes.display_name;
                user.nameWithID = `${item.attributes.display_name} (${item.attributes.drupal_internal__uid})`;
                users.set(user.id, user);
            });

            res.data.included.forEach((itemInc) => {
                if(itemInc.type === 'file--file') {
                    const usersArr = [...users.values()];
                    if(usersArr.map(user => user.pictureID).includes(itemInc.id)) {
                        const userID = usersArr.find(user => user.pictureID === itemInc.id).id;
                        const user = users.get(userID);
                        user.picture = itemInc.attributes.uri.url;
                        users.set(userID, user);
                    }
                }
            });

            console.log(users);
            commit('setUsers', [...users.values()]);
        },

        async createTeam({ state, commit }, { title, body, usersUID }) {
            const res = await TeamsQueryAPI.createTeam(title, body, usersUID);
            const allUsers = state.users;
            console.log(res);
            console.log(allUsers);

            const team = {};
            team.id = res.data.data.id;
            team.title = res.data.data.attributes.title;
            team.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.value : null;
            team.usersID = usersUID;
            team.users = new Map();

            allUsers.forEach((user) => {
                if(team.usersID.includes(user.id)) {
                    team.users.set(user.id, user);
                }
            });

            console.log(team);
            commit('addTeam', team);
        },

        async editTeam({ state, getters, commit }, { id, title, body, usersUID }) {
            const res = await TeamsQueryAPI.editTeam(id, title, body, usersUID);
            const allUsers = state.users;
            console.log(res);
            console.log(allUsers);

            const team = getters.getTeamByID(id);
            team.title = res.data.data.attributes.title;
            team.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.value : null;
            team.usersID = res.data.data.relationships.field_member.data.map(user => user.id);
            team.users = new Map();

            allUsers.forEach((user) => {
                if(team.usersID.includes(user.id)) {
                    team.users.set(user.id, user);
                }
            });

            console.log(team);
            commit('editTeam', team);
        },

        async deleteTeam({ commit }, { id }) {
            console.log("Team id: " + id);
            const res = await TeamsQueryAPI.deleteTeam(id);
            console.log(res);

            commit('deleteTeam', id);
        },
    }
}

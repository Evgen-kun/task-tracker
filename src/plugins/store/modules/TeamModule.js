import { TeamsQueryAPI } from "@/api/teamAPI";
import Team from "@/model/Team";

export const TeamModule = {
    namespaced: true,

    state() {
        return {
            teams: [],
        }
    },

    getters: {
        getTeams: (state) => state.teams,
        getTeamByID: (state) => (id) => { return state.teams.find(team => team.id === id) },
    },

    mutations: {
        setTeams(state, teams) {
            state.teams = teams;
            //localStorage.setItem('teams', teams);
        },

        addTeam(state, team) {
            state.teams.push(team);
            //localStorage.setItem('teams', state.teams);
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
        }
    },

    actions: {
        async queryTeams({ commit, rootGetters }, { userUID, userRoles }) {
            var res;
            if((!userRoles.includes('manager')) && (!userRoles.includes('administrator')))
                res = await TeamsQueryAPI.getTeamsWithMe(userUID);
            else res = await TeamsQueryAPI.getTeams(userUID);

            const allUsers = rootGetters['userM/getUsers'];
            
            console.log(allUsers);

            const teams = [];
            res.data.data.forEach((item) => {
                const team = new Team();
                team.id = item.id;
                team.title = item.attributes.title;
                team.body = (item.attributes.body !== null)? item.attributes.body.value : null;
                const teamUsersUID = item.relationships.field_member.data.map(user => user.id);
                team.users = allUsers.filter(user => teamUsersUID.includes(user.uid));
                console.log(team.users);

                teams.push(team);
            });

            commit('setTeams', teams);
        },

        async createTeam({ commit, rootGetters }, { title, body, usersUID }) {
            const res = await TeamsQueryAPI.createTeam(title, body, usersUID);
            const allUsers = rootGetters['userM/getUsers'];
            // console.log(res);
            // console.log(allUsers);

            const team = new Team();
            team.id = res.data.data.id;
            team.title = res.data.data.attributes.title;
            team.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.value : null;
            team.users = allUsers.filter(user => usersUID.includes(user.id));

            console.log(team);
            commit('addTeam', team);
        },

        async editTeam({ getters, rootGetters, commit }, { id, title, body, usersUID }) {
            const res = await TeamsQueryAPI.editTeam(id, title, body, usersUID);
            const allUsers = rootGetters['userM/getUsers'];
            const newUsersUID = res.data.data.relationships.field_member.data.map(user => user.id);
            // console.log(res);
            // console.log(allUsers);

            const team = getters.getTeamByID(id);
            team.title = res.data.data.attributes.title;
            team.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.value : null;
            team.users = allUsers.filter(user => newUsersUID.includes(user.id));

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

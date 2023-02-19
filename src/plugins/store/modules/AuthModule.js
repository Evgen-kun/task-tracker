import { AuthAPI } from "@/api/authAPI";

export const AuthModule = {
    namespaced: true,

    state() {
        return {
            credentials: {
                //isAuthorized: localStorage.hasOwnProperty('token'),
                token: localStorage.getItem('token') || null,
                basicToken: localStorage.getItem('basicToken') || null,
                userUID: localStorage.getItem('userUID') || null,
                userID: localStorage.getItem('userID') || null,
                userName: localStorage.getItem('userName') || null,
                userEmail: localStorage.getItem('userEmail') || null,
                userPicture: localStorage.getItem('userPicture') || '/drupal/web/sites/default/files/inline-images/anonym.png',
                userRoles: JSON.parse(localStorage.getItem('userRoles')) || [],
            }
        }
    },

    getters: {
        getToken: (state) => state.credentials.token,
        getBasicToken: (state) => state.credentials.basicToken,
        getUserUID: (state) => state.credentials.userUID,
        getUserID: (state) => state.credentials.userID,
        getUserName: (state) => state.credentials.userName,
        getUserEmail: (state) => state.credentials.userEmail,
        getUserPicture: (state) => state.credentials.userPicture,
        getUserRoles: (state) => state.credentials.userRoles,
    },

    mutations: {
        setToken(state, token) {
            state.credentials.token = token;
            localStorage.setItem('token', token);
        },

        setBasicToken(state, basicToken) {
            state.credentials.basicToken = basicToken;
            localStorage.setItem('basicToken', basicToken);
        },

        /*setUser(state, userUID, userID, userName, userEmail, userPicture) {
            state.credentials.user = {};
            state.credentials.user.userUID = userUID;
            state.credentials.user.userID = userID;
            state.credentials.user.userName = userName;
            state.credentials.user.userEmail = userEmail;
            state.credentials.user.userPicture = userPicture;
            localStorage.setItem('user', state.credentials.user);
        },*/

        setUserUID(state, userUID) {
            state.credentials.userUID = userUID;
            localStorage.setItem('userUID', userUID);
        },

        setUserID(state, userID) {
            state.credentials.userID = userID;
            localStorage.setItem('userID', userID);
        },

        setUserName(state, userName) {
            state.credentials.userName = userName;
            localStorage.setItem('userName', userName);
        },

        setUserEmail(state, userEmail) {
            state.credentials.userEmail = userEmail;
            localStorage.setItem('userEmail', userEmail);
        },

        setUserPicture(state, userPicture) {
            state.credentials.userPicture = userPicture;
            localStorage.setItem('userPicture', userPicture);
        },

        setUserRoles(state, userRoles) {
            state.credentials.userRoles = userRoles;
            localStorage.setItem('userRoles', JSON.stringify(userRoles));
        },

        deleteToken(state) {
            state.credentials.token = null;
            localStorage.removeItem('token');
        },

        deleteBasicToken(state) {
            state.credentials.basicToken = null;
            localStorage.removeItem('basicToken');
        },

        /*deleteUser(state) {
            state.credentials.user = null;
            localStorage.removeItem('user');
        },*/

        deleteUserUID(state) {
            state.credentials.userUID = null;
            localStorage.removeItem('userUID');
        },

        deleteUserID(state) {
            state.credentials.userID = null;
            localStorage.removeItem('userID');
        },

        deleteUserName(state) {
            state.credentials.userName = null;
            localStorage.removeItem('userName');
        },

        deleteUserEmail(state) {
            state.credentials.userEmail = null;
            localStorage.removeItem('userEmail');
        },

        deleteUserPicture(state) {
            state.credentials.userPicture = '/drupal/web/sites/default/files/inline-images/anonym.png';
            localStorage.removeItem('userPicture');
        },

        deleteUserRoles(state) {
            state.credentials.userRoles = [];
            localStorage.removeItem('userRoles');
        }
    },

    actions: {
        async onLogin({ commit }, { login, password }) {
            const res = await AuthAPI.login(login, password);
            //const userID = Number(res.headers.link.split(';')[0].substr(-2, 1));
            const userUID = (await AuthAPI.getUserUID()).data.meta.links.me.meta.id;

            const data = await AuthAPI.getUserData(userUID);
            //const userUID = data.data.data[0].id;
            const userID = data.data.data[0].attributes.drupal_internal__uid;
            const userName = data.data.data[0].attributes.name;
            const userEmail = data.data.data[0].attributes.mail;
            const userRoles = data.data.data[0].relationships.roles.data.map(role => role.meta.drupal_internal__target_id);
            const userPictureID = data.data.data[0].relationships.user_picture.data.id;

            const userPictureData = await AuthAPI.getUserPicture(userPictureID);
            const userPicture = userPictureData.data.data.attributes.uri.url;

            const token = await AuthAPI.getToken();
            console.log("X token: " + token.data);

            const basicToken = btoa(userName + ":" + password);

            /*const users = await AuthAPI.getUsersREST();
            console.log(users.data);
            var userRole = null;
            for(let i = 0; i < users.data.length; i++) {
                if(users.data[i].uuid[0].value == userUID) {
                    userRole = users.data[i].roles[0].target_id;
                    break;
                }
            }
            console.log(userRole);*/

            commit('setToken', token.data);
            commit('setBasicToken', basicToken);
            //commit('setUser', userUID, userID, userName, userEmail, userPicture);
            commit('setUserUID', userUID);
            commit('setUserID', userID);
            commit('setUserName', userName);
            commit('setUserEmail', userEmail);
            commit('setUserRoles', userRoles);
            commit('setUserPicture', userPicture);
            //console.log(login + " залогинен, id: " + res.headers.link.split(';')[0].substr(-2, 1));
            //commit('setUserRole', userRole);
            //DefaultAPIInstance.defaults.headers['Authorization'] = `Basic ${(String(login) + String(password)).toString('base64')}`;
            //DefaultAPIInstance.defaults.headers['X-CSRF-Token'] = `${res.headers['set-cookie']}`;
            
        },

        async onLogout({ commit }) {
            const res = await AuthAPI.logout();

            commit('deleteToken');
            commit('deleteBasicToken');
            commit('deleteUserUID');
            commit('deleteUserID');
            commit('deleteUserName');
            commit('deleteUserEmail');
            commit('deleteUserRoles');
            commit('deleteUserPicture');
            console.log("разлогинен");
            //commit('deleteUserRole');
            //delete DefaultAPIInstance.defaults.headers['Cookie'];
        }
    }
}
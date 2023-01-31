import { AuthAPI } from "@/api/authAPI";

export const AuthModule = {
    namespaced: true,

    state() {
        return {
            credentials: {
                //isAuthorized: localStorage.hasOwnProperty('token'),
                token: localStorage.getItem('token') || null,
                userUID: localStorage.getItem('userUID') || null,
                userID: localStorage.getItem('userID') || null,
                userName: localStorage.getItem('userName') || null,
                userEmail: localStorage.getItem('userEmail') || null,
                userPicture: localStorage.getItem('userPicture') || '/drupal/web/sites/default/files/inline-images/anonym.png',
                //userRole: localStorage.getItem('userRole') || 'anonymous'
            }
        }
    },

    getters: {
        getToken: (state) => state.credentials.token,
        getUserUID: (state) => state.credentials.userUID,
        getUserID: (state) => state.credentials.userID,
        getUserName: (state) => state.credentials.userName,
        getUserEmail: (state) => state.credentials.userEmail,
        getUserPicture: (state) => state.credentials.userPicture,
        //getUserRole: (state) => state.credentials.userRole,
    },

    mutations: {
        setToken(state, token) {
            state.credentials.token = token;
            localStorage.setItem('token', token);
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

        setUserRole(state, userRole) {
            state.credentials.userRole = userRole;
            localStorage.setItem('userRole', userRole);
        },

        deleteToken(state) {
            state.credentials.token = null;
            localStorage.removeItem('token');
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

        deleteUserRole(state) {
            state.credentials.userRole = null;
            localStorage.removeItem('userRole');
        }
    },

    actions: {
        async onLogin({ commit }, { login, password }) {
            const res = await AuthAPI.login(login, password);
            const userID = Number(res.headers.link.split(';')[0].substr(-2, 1));

            const data = await AuthAPI.getUserData(userID);
            const userUID = data.data.data[0].id;
            const userName = data.data.data[0].attributes.name;
            const userEmail = data.data.data[0].attributes.mail;
            const userPictureID = data.data.data[0].relationships.user_picture.data.id;

            const userPictureData = await AuthAPI.getUserPicture(userPictureID);
            const userPicture = userPictureData.data.data.attributes.uri.url;

            commit('setToken', "res.statusCode");
            //commit('setUser', userUID, userID, userName, userEmail, userPicture);
            commit('setUserUID', userUID);
            commit('setUserID', userID);
            commit('setUserName', userName);
            commit('setUserEmail', userEmail);
            commit('setUserPicture', userPicture);
            console.log(login + " залогинен, id: " + res.headers.link.split(';')[0].substr(-2, 1));
            //commit('setUserRole', res.userRole);
            //DefaultAPIInstance.defaults.headers['Authorization'] = `Basic ${(String(login) + String(password)).toString('base64')}`;
            //DefaultAPIInstance.defaults.headers['Cookie'] = `${res.headers['set-cookie']}`;
            
        },

        async onLogout({ commit }) {
            const res = await AuthAPI.logout();

            commit('deleteToken');
            commit('deleteUserUID');
            commit('deleteUserID');
            commit('deleteUserName');
            commit('deleteUserEmail');
            commit('deleteUserPicture');
            console.log("разлогинен");
            //commit('deleteUserRole');
            //delete DefaultAPIInstance.defaults.headers['Cookie'];
        }
    }
}
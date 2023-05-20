import { AuthAPI } from "@/api/authAPI";
import { UsersQueryAPI } from "@/api/usersAPI";
import Picture from "@/model/Picture";
import User from "@/model/User";

export const AuthModule = {
    namespaced: true,

    state() {
        return {
            credentials: {
                user: JSON.parse(localStorage.getItem('user')) || new User(),
                token: localStorage.getItem('token') || null,
                basicToken: localStorage.getItem('basicToken') || null,
            }
        }
    },

    getters: {
        getUser: (state) => state.credentials.user,
        getToken: (state) => state.credentials.token,
        getBasicToken: (state) => state.credentials.basicToken,
    },

    mutations: {
        setUser(state, user) {
            state.credentials.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        },

        setToken(state, token) {
            state.credentials.token = token;
            localStorage.setItem('token', token);
        },

        setBasicToken(state, basicToken) {
            state.credentials.basicToken = basicToken;
            localStorage.setItem('basicToken', basicToken);
        },

        deleteUser(state) {
            state.credentials.user = new User();
            localStorage.removeItem('user');
        },

        deleteToken(state) {
            state.credentials.token = null;
            localStorage.removeItem('token');
        },

        deleteBasicToken(state) {
            state.credentials.basicToken = null;
            localStorage.removeItem('basicToken');
        },
    },

    actions: {
        async onLogin({ commit }, { login, password }) {
            const auth = await AuthAPI.login(login, password);
            const userUID = (await AuthAPI.getUserUID()).data.meta.links.me.meta.id;
            const res = await UsersQueryAPI.getUser(userUID);
            const data = res.data.data;
            const included = res.data.included;
            const picture = new Picture();
            picture.uid = included[0].id;
            picture.url = included[0].attributes.uri.url;
            const user = new User();
            user.uid = data.id;
            user.id = data.attributes.drupal_internal__uid;
            user.name = data.attributes.display_name;
            user.email = data.attributes.mail;
            user.picture = picture;
            user.roles = data.relationships.roles.data.map(role => role.meta.drupal_internal__target_id);
            const token = await AuthAPI.getToken();
            const basicToken = window.btoa(unescape(encodeURIComponent(user.name + ":" + password)));

            commit('setUser', user);
            commit('setToken', token.data);
            commit('setBasicToken', basicToken);
        },

        async onLogout({ commit }) {
            await AuthAPI.logout();

            commit('deleteUser');
            commit('deleteToken');
            commit('deleteBasicToken');
        },
    }
}
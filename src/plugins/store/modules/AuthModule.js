import { DefaultAPIInstance } from "@/api";
import { AuthAPI } from "@/api/authAPI";

export const AuthModule = {
    namespaced: true,

    state() {
        return {
            credentials: {
                token: localStorage.getItem('token') || null,
                //userRole: localStorage.getItem('userRole') || 'anonymous'
            }
        }
    },

    getters: {
        getUserRole: (state) => state.credentials.userRole,
    },

    mutations: {
        setToken(state, token) {
            state.credentials.token = token;
            localStorage.setItem('token', token);
        },

        setUserRole(state, userRole) {
            state.credentials.userRole = userRole;
            localStorage.setItem('userRole', userRole);
        },

        deleteToken(state) {
            state.credentials.token = null;
            localStorage.removeItem('token');
        },

        deleteUserRole(state) {
            state.credentials.userRole = null;
            localStorage.removeItem('userRole');
        }
    },

    actions: {
        onLogin({ commit }, { login, password }) {
            AuthAPI.login(login, password).then((res) => {
                console.log(res);
                commit('setToken', res.statusText);
                //commit('setUserRole', res.userRole);
                //DefaultAPIInstance.defaults.headers['Authorization'] = `Basic ${(String(login) + String(password)).toString('base64')}`;
                //DefaultAPIInstance.defaults.headers['Cookie'] = '';
            })
        },

        onLogout({ commit }) {
            AuthAPI.logout().then((res) => {
                console.log(res);
                commit('deleteToken');
                //commit('deleteUserRole');
                //delete DefaultAPIInstance.defaults.headers['Authorization'];
            })
        }
    }
}
import { UsersQueryAPI } from "@/api/usersAPI";
import { ADMIN_ID, GUEST_ID } from "/settings";
import User from "@/model/User";
import Picture from "@/model/Picture";

export const UserModule = {
    namespaced: true,

    state() {
        return {
            users: [],
            pictures: new Map()
        }
    },

    getters: {
        getUsers: (state) => state.users,
        getUsersUID: (state) => state.users.map(user => user.uid),
        getUserByUID: (state) => (uid) => { return state.users.find(user => user.uid === uid) },
        getUserByID: (state) => (id) => { return state.users.find(user => user.id === id) },
        getUsersByRole: (state) => (role) => { return state.users.filter(user => user.role === role) },

        getPictures: (state) => state.pictures,
        getPictureByUserUID: (state) => (uid) => { return state.pictures.get(uid) },
    },

    mutations: {
        setUsers(state, users) {
            state.users = users;
        },

        addPicture(state, { picture, user }) {
            state.pictures.set(user.id, picture);
        },

        addUser(state, user) {
            state.users.push(user);
        },

        deleteUsers(state) {
            state.users = [];
        },

        deleteUser(state, userUID) {
            state.users.forEach((user, i) => {
                if (user.uid === userUID) state.users.splice(i, 1);
            });
        }
    },

    actions: {
        async usersQuery({ commit, dispatch }) {
            const res = await UsersQueryAPI.getUsers();
            const pictures = res.data.included.filter(item => item.type === 'file--file');
            const users = res.data.data
                .filter(item => (item.id !== GUEST_ID && item.id !== ADMIN_ID))
                .map(user => new User({
                    uid: user.id,
                    id: user.attributes.drupal_internal__uid,
                    name: user.attributes.display_name,
                    email: user.attributes.mail,
                    picture: dispatch('getUserPicture', { user: user, pictures: pictures }),
                    roles: user.relationships.roles.data.map(role => role.meta.drupal_internal__target_id)
                }));

            commit('setUsers', users);
        },

        async addNewUser({ commit, dispatch }, { uid }) {
            const res = await UsersQueryAPI.getUser(uid);
            const userData = res.data.data;
            const user = new User({
                uid: userData.id,
                id: userData.attributes.drupal_internal__uid,
                name: userData.attributes.display_name,
                email: userData.attributes.mail,
                picture: dispatch('getUserPicture', { user: userData, pictures: res.data.included }),
                roles: userData.relationships.roles.data.map(role => role.meta.drupal_internal__target_id)
            });

            commit('addUser', user);
            return user;
        },

        deleteUser({ commit }, { uid }) {
            commit('deleteUser', uid);
        },

        getUserPicture(context, { user, pictures }) {
            const res = pictures.find(picture => picture.id === user.relationships.user_picture.data.id);
            const picture = new Picture({ 
                uid: res.id,
                url: res.attributes.uri.url
            });

            context.commit('addPicture', { picture, user });
            return picture;
        },

        isUserExists({ getters }, { uid }) {
            return !!getters.getUserByUID(uid);
        },

        async isUserExistsOnServer(context, { uid }) {
            const res = await UsersQueryAPI.getUser(uid);
            const userData = res.data?.errors;
            if(userData[0].title === "Not Found") return false;
            return true;
        }
    }
}

import { UsersQueryAPI } from "@/api/usersAPI";
import User from "@/model/User";
import Picture from "@/model/Picture";
const ADMIN_ID = '6da4f1c5-7607-4047-a6d0-011ba3e0c6cb';
const GUEST_ID = '52a3ddd5-2b1f-4b48-b600-14507b648d69';

export const UserModule = {
    namespaced: true,

    state() {
        return {
            users: [],
        }
    },

    getters: {
        getUsers: (state) => state.users,
        getUsersUID: (state) => state.users.map(user => user.uid),
        getUserByUID: (state) => (uid) => { return state.users.find(user => user.uid === uid) },
        getUserByID: (state) => (id) => { return state.users.find(user => user.id === id) },
        getUsersByRole: (state) => (role) => { return state.users.filter(user => user.role === role) },
    },

    mutations: {
        setUsers(state, users) {
            state.users = users;
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
            // console.log(res);

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

            console.log(users);
            commit('setUsers', users);
        },

        async addNewUser({ commit, dispatch }, { uid }) {
            /*if(!(await dispatch('isUserExistsOnServer', { uid: uid }))) {
                throw new Error('User does not exist on server');
            }*/
                
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

            console.log("New User! => " + user.name);
            commit('addUser', user);
            return user;
        },

        deleteUser({ commit }, { uid }) {
            console.log("Not Found User " + uid);
            commit('deleteUser', uid);
        },

        getUserPicture(context, { user, pictures }) {
            const picture = pictures.find(picture => picture.id === user.relationships.user_picture.data.id);
            return new Picture({ 
                uid: picture.id,
                url: picture.attributes.uri.url
            })
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

import { QueryAPIInstance } from "@/api";
import { QueryAPI } from "@/api/jsonAPI";

export const TaskModule = {
    namespaced: true,

    state() {
        return {
            credentials: {
                tasks: [],
            }
        }
    },

    getters: {
        getUserTasks: (state) => state.credentials.tasks,
    },

    mutations: {
        setTasks(state, tasks) {
            state.credentials.tasks = tasks;
            localStorage.setItem('tasks', tasks);
        },

        addUserTask(state, task) {
            state.credentials.tasks.push(task);
            localStorage.setItem('tasks', state.credentials.tasks);
        },

        deleteTasks(state) {
            state.credentials.tasks = null;
            localStorage.removeItem('tasks');
        },

        deleteUserTask(state, taskID) {
            state.credentials.tasks.forEach(function(el, i) {
                if (el.id == taskID) state.credentials.tasks.splice(i, 1);
            });
            localStorage.setItem('tasks', state.credentials.tasks);
        }
    },

    actions: {
        query({ commit }, { user }) {
            QueryAPI.getTasks(user).then((res) => {
                console.log(res);
                commit('setTasks', res);
            })
        },

    }
}
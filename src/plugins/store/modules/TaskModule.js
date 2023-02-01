import { QueryAPIInstance } from "@/api";
import { QueryAPI } from "@/api/jsonAPI";

export const TaskModule = {
    namespaced: true,

    state() {
        return {
            tasks: [],
            tasksFromMe: [],
        }
    },

    getters: {
        getUserTasks: (state) => state.tasks,
        getTasksFromMe: (state) => state.tasksFromMe,
    },

    mutations: {
        setTasks(state, tasks) {
            state.tasks = tasks;
            //localStorage.setItem('tasks', tasks);
        },

        setTasksFromMe(state, tasks) {
            state.tasksFromMe = tasks;
        },

        addUserTask(state, task) {
            state.tasks.push(task);
            //localStorage.setItem('tasks', state.tasks);
        },

        addTaskFromMe(state, task) {
            state.tasksFromMe.push(task);
        },

        deleteTasks(state) {
            state.tasks = null;
            //localStorage.removeItem('tasks');
        },

        deleteTasksFromMe(state) {
            state.tasksFromMe = null;
        },

        deleteUserTask(state, taskID) {
            state.tasks.forEach(function(task, i) {
                if (task.id == taskID) state.tasks.splice(i, 1);
            });
            //localStorage.setItem('tasks', state.tasks);
        },

        deleteTaskFromMe(state, taskID) {
            state.tasksFromMe.forEach(function(task, i) {
                if (task.id == taskID) state.tasksFromMe.splice(i, 1);
            });
        },
    },

    actions: {
        async query({ commit }, { userUID }) {
            const res = await QueryAPI.getTasks(userUID);
            console.log(res);

            const tasks = [];
            res.data.data.forEach((item, i) => {
                console.log("Новая итерация i");
                const task = {};
                task.id = item.id;
                task.title = item.attributes.title;
                task.body = item.attributes.body.processed.replace(/(<p>|<\/p>)/g, '');
                task.authorUID = item.relationships.uid.data.id;

                res.data.included.forEach((itemInc, j) => {
                    if(itemInc.type == 'user--user') {
                        if(itemInc.id == task.authorUID) { 
                            task.author = itemInc.attributes.display_name;
                            task.authorPictureID = itemInc.relationships.user_picture.data.id;
                        }
                    }
                });

                res.data.included.forEach((itemInc, j) => {
                    if(itemInc.type == 'file--file') {
                        if(itemInc.id == task.authorPictureID) task.authorPicture = itemInc.attributes.uri.url;
                    }
                });

                tasks.push(task);
            });

            commit('setTasks', tasks);
        },

        async queryTasksFromMe({ commit }, { userUID }) {
            const res = await QueryAPI.getMyTasks(userUID);
            console.log(res);

            const tasks = [];
            res.data.data.forEach((item, i) => {
                console.log("Новая итерация i");
                const task = {};
                task.id = item.id;
                task.title = item.attributes.title;
                task.body = item.attributes.body.processed.replace(/(<p>|<\/p>)/g, '');
                task.executorUID = item.relationships.field_ispolnitel.data.id;

                res.data.included.forEach((itemInc, j) => {
                    if(itemInc.type == 'user--user') {
                        if(itemInc.id == task.executorUID) { 
                            task.executor = itemInc.attributes.display_name;
                            task.executorPictureID = itemInc.relationships.user_picture.data.id;
                        }
                    }
                });

                res.data.included.forEach((itemInc, j) => {
                    if(itemInc.type == 'file--file') {
                        if(itemInc.id == task.executorPictureID) task.executorPicture = itemInc.attributes.uri.url;
                    }
                });

                tasks.push(task);
                console.log(task);
            });

            commit('setTasksFromMe', tasks);
        },

    }
}
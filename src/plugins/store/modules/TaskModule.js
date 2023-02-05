import { QueryAPI } from "@/api/jsonAPI";

export const TaskModule = {
    namespaced: true,

    state() {
        return {
            tasks: [],
            tasksFromMe: [],
            users: [],
        }
    },

    getters: {
        getUserTasks: (state) => state.tasks,
        getTasksFromMe: (state) => state.tasksFromMe,
        getUsers: (state) => state.users,
    },

    mutations: {
        setTasks(state, tasks) {
            state.tasks = tasks;
            //localStorage.setItem('tasks', tasks);
        },

        setTasksFromMe(state, tasks) {
            state.tasksFromMe = tasks;
        },

        setUsers(state, users) {
            state.users = users;
        },

        addUserTask(state, task) {
            state.tasks.push(task);
            //localStorage.setItem('tasks', state.tasks);
        },

        addTaskFromMe(state, task) {
            state.tasksFromMe.push(task);
        },

        editTaskFromMe(state, newTask) {
            state.tasksFromMe.forEach((task, i) => {
                if (task.id == newTask.id) state.tasksFromMe[i] = newTask;
            });
        },

        deleteTasks(state) {
            state.tasks = null;
            //localStorage.removeItem('tasks');
        },

        deleteTasksFromMe(state) {
            state.tasksFromMe = null;
        },

        deleteUsers(state) {
            state.users = null;
        },

        deleteUserTask(state, taskID) {
            state.tasks.forEach((task, i) => {
                if (task.id == taskID) state.tasks.splice(i, 1);
            });
            //localStorage.setItem('tasks', state.tasks);
        },

        deleteTaskFromMe(state, taskID) {
            state.tasksFromMe.forEach((task, i) => {
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
                task.body = (item.attributes.body !== null)? item.attributes.body.processed.replace(/(<p>|<\/p>)/g, '') : null;
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

            console.log(tasks);
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
                task.body = (item.attributes.body !== null)? item.attributes.body.processed.replace(/(<p>|<\/p>)/g, '') : null;
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

        async getUsers({ commit }) {
            const res = await QueryAPI.getUsers();
            console.log(res);

            const users = [];
            //console.log(res.data.data.length);
            res.data.data.forEach((item) => {
                if(item.id == "52a3ddd5-2b1f-4b48-b600-14507b648d69" || item.id == "6da4f1c5-7607-4047-a6d0-011ba3e0c6cb") { return; }
                const user = {};
                user.id = item.id;
                user.name = `${item.attributes.display_name} (${item.attributes.drupal_internal__uid})`;
                users.push(user);
            });

            console.log(users);
            commit('setUsers', users);
        },

        async createNewTask({ commit }, { title, body, executorUID }) {
            const res = await QueryAPI.createTask(title, body, executorUID);
            console.log(res);

            const task = {};
            task.id = res.data.data.id;
            task.title = res.data.data.attributes.title;
            task.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.processed.replace(/(<p>|<\/p>)/g, '') : null;
            task.executorUID = res.data.data.relationships.field_ispolnitel.data.id;
            const json = await QueryAPI.getUserData(res.data.data.relationships.field_ispolnitel.data.id);
            task.executor = json.data.data.attributes.display_name;
            task.executorPicture = json.data.included[0].attributes.uri.url;

            console.log(task);
            commit('addTaskFromMe', task);
        },

        async editTask({ commit }, { id, title, body, executorUID }) {
            const res = await QueryAPI.editTask(id, title, body, executorUID);
            console.log(res);

            const task = {};
            task.id = id;
            task.title = res.data.data.attributes.title;
            task.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.processed.replace(/(<p>|<\/p>)/g, '') : null;
            task.executorUID = res.data.data.relationships.field_ispolnitel.data.id;
            const json = await QueryAPI.getUserData(res.data.data.relationships.field_ispolnitel.data.id);
            task.executor = json.data.data.attributes.display_name;
            task.executorPicture = json.data.included[0].attributes.uri.url;

            console.log(task);
            commit('editTaskFromMe', task);
        },

        async deleteTask({ commit }, { id }) {
            console.log("Task id: " + id);
            const res = await QueryAPI.deleteTask(id);
            console.log(res);

            commit('deleteTaskFromMe', id);
        },

    }
}
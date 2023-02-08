import { AnsQueryAPI } from "@/api/answerAPI";
import { QueryAPI } from "@/api/taskAPI";

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
        getUserTaskByID: (state) => (id) => { return state.tasks.find(task => task.id === id) },
        getTasksFromMe: (state) => state.tasksFromMe,
        getTaskFromMeByID: (state) => (id) => { return state.tasksFromMe.find(task => task.id === id) },
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

        addAnswer(state, taskWithAnswer) {
            state.tasks.forEach((task, i) => {
                if (task.id == taskWithAnswer.id) state.tasks[i] = taskWithAnswer;
            });
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
            const comments = await AnsQueryAPI.getMyAnswers(userUID);
            console.log(res);
            console.log(comments);

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

                task.ans = {};
                var maxCID = -1;
                comments.data.data.forEach((com) => {
                    if((com.relationships.entity_id.data.id == task.id) && (maxCID < com.attributes.drupal_internal__cid)) { 
                        task.ans.id = com.id;
                        task.ans.title = com.attributes.subject;
                        task.ans.body = com.attributes.comment_body.processed.replace(/(<p>|<\/p>)/g, '');
                        task.ans.filesID = [];
                        task.ans.files = [];
                        console.log(com.relationships.field_file.data);
                        if(com.relationships.field_file.data.length != 0) {
                            com.relationships.field_file.data.forEach((file) => {
                                task.ans.filesID.push(file.id);
                            });
                        }
                        maxCID = com.attributes.drupal_internal__cid;
                    } 
                    else { return; }

                    if(comments.data.hasOwnProperty('included')) {
                        comments.data.included.forEach((itemInc) => {
                            if(task.ans.filesID.includes(itemInc.id)) {
                                const file = {
                                    id: itemInc.id,
                                    name: itemInc.attributes.filename,
                                    links: itemInc.attributes.uri
                                };
                                task.ans.files.push(file);
                            }
                            else { return; }
                        });
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

        async createAnswer({ commit, getters }, { title, body, taskUID, files }) {
            const res = await AnsQueryAPI.createAnswer(title, body, taskUID);
            console.log(res);
            console.log('Файлы:' + files)

            const task = getters.getUserTaskByID(taskUID);

            task.ans = {};
            
            task.ans.id = res.data.data.id;
            task.ans.title = res.data.data.attributes.subject;
            task.ans.body = res.data.data.attributes.comment_body.processed.replace(/(<p>|<\/p>)/g, '');
            task.ans.filesID = [];
            task.ans.files = files;
            if(res.data.data.relationships.field_file.data.length != 0) {
                res.data.data.relationships.field_file.data.forEach((file) => {
                    task.ans.filesID.push(file.id);
                });
            }

            console.log(task);
            // comments.data.included.forEach((itemInc) => {
            //     if(task.ans.filesID.includes(itemInc.id)) {
            //         task.ans.files.push(itemInc.attributes.filename);
            //     }
            //     else { return; }
            // });

            commit('addAnswer', task);
        },

    }
}
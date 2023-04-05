import { AnsQueryAPI } from "@/api/answerAPI";
import { QueryAPI } from "@/api/taskAPI";

export const TaskModule = {
    namespaced: true,

    state() {
        return {
            tasks: [],
            tasksFromMe: [],
            users: [],
            statuses: new Map(),
            progress: new Map(),
        }
    },

    getters: {
        getUserTasks: (state) => state.tasks,
        getUserTaskByID: (state) => (id) => { return state.tasks.find(task => task.id === id) },
        //getSortedUserTasks: (state) => (field) => { return state.tasks.sort((a, b) => a[field] > b[field] ? 1 : -1) },
        getTasksFromMe: (state) => state.tasksFromMe,
        getTaskFromMeByID: (state) => (id) => { return state.tasksFromMe.find(task => task.id === id) },
        //getSortedTasksFromMe: (state) => (field) => { return state.tasksFromMe.sort((a, b) => a[field] > b[field] ? 1 : -1) },
        getUsers: (state) => state.users,
        getStatuses: (state) => state.statuses,
        getProgress: (state) => state.progress,
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

        setStatuses(state, statuses) {
            state.statuses = statuses;
        },

        setProgress(state, progress) {
            state.progress = progress;
        },

        addUserTask(state, task) {
            state.tasks.push(task);
            //localStorage.setItem('tasks', state.tasks);
        },

        addAnswer(state, taskWithAnswer) {
            state.tasks.forEach((task, i) => {
                if (task.id === taskWithAnswer.id) state.tasks[i] = taskWithAnswer;
            });
        },

        addTaskFromMe(state, task) {
            state.tasksFromMe.push(task);
        },

        editTaskFromMe(state, newTask) {
            state.tasksFromMe.forEach((task, i) => {
                if (task.id === newTask.id) state.tasksFromMe[i] = newTask;
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

        deleteStatuses(state) {
            state.statuses = null;
        },

        deleteProgress(state) {
            state.progress = null;
        },

        deleteUserTask(state, taskID) {
            state.tasks.forEach((task, i) => {
                if (task.id === taskID) state.tasks.splice(i, 1);
            });
            //localStorage.setItem('tasks', state.tasks);
        },

        deleteTaskFromMe(state, taskID) {
            state.tasksFromMe.forEach((task, i) => {
                if (task.id === taskID) state.tasksFromMe.splice(i, 1);
            });
        },
    },

    actions: {
        async query({ commit, getters }, { userUID }) {
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
                task.status = getters.getStatuses.get(item.relationships.field_status.data.id) ?? 'Не определено';
                task.progress = '0%';

                res.data.included.forEach((itemInc, j) => {
                    if(itemInc.type === 'user--user') {
                        if(itemInc.id === task.authorUID) {
                            task.author = itemInc.attributes.display_name;
                            task.authorPictureID = itemInc.relationships.user_picture.data.id;
                        }
                    }
                });

                res.data.included.forEach((itemInc, j) => {
                    if(itemInc.type === 'file--file') {
                        if(itemInc.id === task.authorPictureID) task.authorPicture = itemInc.attributes.uri.url;
                    }
                });

                task.answers = [];
                var maxCID = -1;
                comments.data.data.forEach((com) => {
                    if((com.relationships.entity_id.data.id === task.id) && (com.attributes.field_name === 'field_answer')
                        && (maxCID < com.attributes.drupal_internal__cid)) {
                        task.answers[0] = {};
                        task.answers[0].id = com.id;
                        task.answers[0].title = com.attributes.subject;
                        task.answers[0].body = com.attributes.comment_body.processed.replace(/(<p>|<\/p>)/g, '');
                        task.answers[0].progress = getters.getProgress.get(com.relationships.field_progress.data.id);
                        task.progress = task.answers[0].progress ?? '0%';
                        task.answers[0].filesID = [];
                        task.answers[0].files = [];
                        console.log(com.relationships.field_file.data);
                        if(com.relationships.field_file.data.length !== 0) {
                            com.relationships.field_file.data.forEach((file) => {
                                task.answers[0].filesID.push(file.id);
                            });
                        }
                        maxCID = com.attributes.drupal_internal__cid;
                    }
                    else { return; }

                    if(comments.data.hasOwnProperty('included')) {
                        comments.data.included.forEach((itemInc) => {
                            if(task.answers[0].filesID.includes(itemInc.id)) {
                                const file = {
                                    id: itemInc.id,
                                    name: itemInc.attributes.filename,
                                    links: itemInc.attributes.uri
                                };
                                task.answers[0].files.push(file);
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

        async queryTasksFromMe({ commit, getters }, { userUID }) {
            const res = await QueryAPI.getMyTasks(userUID);
            const comments = await AnsQueryAPI.getAnswers();
            console.log(res);
            console.log(comments);

            const tasks = [];
            res.data.data.forEach((item, i) => {
                console.log("Новая итерация i");
                const task = {};
                task.id = item.id;
                task.title = item.attributes.title;
                task.body = (item.attributes.body !== null)? item.attributes.body.processed.replace(/(<p>|<\/p>)/g, '') : null;
                task.executorUID = item.relationships.field_ispolnitel.data.id;
                task.status = getters.getStatuses.get(item.relationships.field_status.data.id) ?? 'Не определено';
                task.progress = '0%';

                res.data.included.forEach((itemInc, j) => {
                    if(itemInc.type === 'user--user') {
                        if(itemInc.id === task.executorUID) {
                            task.executor = itemInc.attributes.display_name;
                            task.executorPictureID = itemInc.relationships.user_picture.data.id;
                        }
                    }
                });

                res.data.included.forEach((itemInc, j) => {
                    if(itemInc.type === 'file--file') {
                        if(itemInc.id === task.executorPictureID) task.executorPicture = itemInc.attributes.uri.url;
                    }
                });

                task.answers = [];
                var maxCID = -1;
                var j = -1;
                comments.data.data.forEach((com) => {
                    if((com.relationships.entity_id.data.id === task.id) && (com.attributes.field_name === 'field_answer')) {
                        j += 1;
                        task.answers[j] = {};
                        task.answers[j].id = com.id;
                        task.answers[j].title = com.attributes.subject;
                        task.answers[j].body = com.attributes.comment_body.processed.replace(/(<p>|<\/p>)/g, '');
                        task.answers[j].progress = getters.getProgress.get(com.relationships.field_progress.data.id);
                        task.progress = (maxCID < com.attributes.drupal_internal__cid)? task.answers[j].progress : task.progress;
                        task.answers[j].filesID = [];
                        task.answers[j].files = [];
                        console.log(com.relationships.field_file.data);
                        if(com.relationships.field_file.data.length !== 0) {
                            com.relationships.field_file.data.forEach((file) => {
                                task.answers[j].filesID.push(file.id);
                            });
                        }
                        if(maxCID < com.attributes.drupal_internal__cid) maxCID = com.attributes.drupal_internal__cid;
                    }
                    else { return; }

                    if(comments.data.hasOwnProperty('included')) {
                        comments.data.included.forEach((itemInc) => {
                            if(task.answers[j].filesID.includes(itemInc.id)) {
                                const file = {
                                    id: itemInc.id,
                                    name: itemInc.attributes.filename,
                                    link: itemInc.attributes.uri.url
                                };
                                console.log('links: ' + file.link);
                                task.answers[j].files.push(file);
                            }
                            else { return; }
                        });
                    }
                });

                tasks.push(task);
                console.log(task);
            });

            commit('setTasksFromMe', tasks);
        },

        async getStatuses({ commit }) {
            const res = await QueryAPI.getStatuses();
            //console.log(res);

            const statuses = new Map();
            res.data.data.forEach((item) => {
                statuses.set(item.id, item.attributes.name);
            });

            //console.log(statuses);
            commit('setStatuses', statuses);
        },

        async getProgress({ commit }) {
            const res = await QueryAPI.getProgress();
            //console.log(res);

            const progress = new Map();
            res.data.data.forEach((item) => {
                progress.set(item.id, item.attributes.name);
            });

            //console.log(progress);
            commit('setProgress', progress);
        },

        async getUsers({ commit }) {
            const res = await QueryAPI.getUsers();
            console.log(res);

            const users = [];
            //console.log(res.data.data.length);
            res.data.data.forEach((item) => {
                if(item.id === "52a3ddd5-2b1f-4b48-b600-14507b648d69" || item.id === "6da4f1c5-7607-4047-a6d0-011ba3e0c6cb") { return; }
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
            task.status = 'Не выполнено';
            task.progress = '0%';
            task.executorUID = res.data.data.relationships.field_ispolnitel.data.id;
            const json = await QueryAPI.getUserData(res.data.data.relationships.field_ispolnitel.data.id);
            task.executor = json.data.data.attributes.display_name;
            task.executorPicture = json.data.included[0].attributes.uri.url;
            task.answers = [];

            console.log(task);
            commit('addTaskFromMe', task);
        },

        async editTask({ commit, getters }, { id, title, body, executorUID, status }) {
            const statuses = getters.getStatuses;
            const res = await QueryAPI.editTask(id, title, body, executorUID, [...statuses.keys()].find((key) => statuses.get(key) === status));
            console.log(res);

            const task = getters.getTaskFromMeByID(id);
            task.title = res.data.data.attributes.title;
            task.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.processed.replace(/(<p>|<\/p>)/g, '') : null;
            task.executorUID = res.data.data.relationships.field_ispolnitel.data.id;
            task.status = status;

            /*const task = {};
            task.id = id;
            task.title = res.data.data.attributes.title;
            task.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.processed.replace(/(<p>|<\/p>)/g, '') : null;
            task.executorUID = res.data.data.relationships.field_ispolnitel.data.id;*/
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

        async createAnswer({ commit, getters }, { title, body, taskUID, progress, files }) {
            const progressMap = getters.getProgress;
            const res = await AnsQueryAPI.createAnswer(title, body, [...progressMap.keys()].find((key) => progressMap.get(key) === progress), taskUID);
            console.log(res);
            console.log('Файлы:' + files)

            const task = getters.getUserTaskByID(taskUID);

            const answer = {};
            answer.id = res.data.data.id;
            answer.title = res.data.data.attributes.subject;
            answer.body = res.data.data.attributes.comment_body.processed.replace(/(<p>|<\/p>)/g, '');
            answer.progress = progress;
            answer.filesID = [];
            answer.files = files;
            if(res.data.data.relationships.field_file.data.length !== 0) {
                res.data.data.relationships.field_file.data.forEach((file) => {
                    answer.filesID.push(file.id);
                });
            }
            task.progress = progress;
            task.answers.push(answer);

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

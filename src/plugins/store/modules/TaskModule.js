import { AnsQueryAPI } from "@/api/answerAPI";
import { QueryAPI } from "@/api/taskAPI";
import Task from "@/model/Task";
import Answer from "@/model/Answer";
import User from "@/model/User";
import Picture from "@/model/Picture";
import File from "@/model/File";

export const TaskModule = {
    namespaced: true,

    state() {
        return {
            tasksToMe: [],
            tasksFromMe: [],
            tasksFromProjects: [],
            users: [],
            statuses: new Map(),
            progress: new Map(),
            difficulty: new Map()
        }
    },

    getters: {
        getUserTasks: (state) => state.tasksToMe,
        getUserTaskByID: (state) => (id) => { return state.tasksToMe.find(task => task.id === id) },

        getTasksFromMe: (state) => state.tasksFromMe,
        getTaskFromMeByID: (state) => (id) => { return state.tasksFromMe.find(task => task.id === id) },
        getTasksFromMeByProjectID: (state) => (id) => { return state.tasksFromMe.filter(task => task.project?.id === id) },

        getTasksFromProjects: (state) => state.tasksFromProjects,
        getTasksFromProjectsByID: (state) => (id) => state.tasksFromProjects.filter(task => task.id),

        getUsers: (state) => state.users,
        getStatuses: (state) => state.statuses,
        getProgress: (state) => state.progress,
        getDifficulty: (state) => state.difficulty,

        getFilteredByStatusTasks: (state) => (status) => state.tasksFromMe.filter(task => task.status === status),

    },

    mutations: {
        setTasksToMe(state, tasks) {
            state.tasksToMe = tasks;
        },

        setTasksFromMe(state, tasks) {
            state.tasksFromMe = tasks;
        },

        replaceTasks(state, { tasks, title }) {
            tasks.forEach((task, i) => {
                task.status = title;
                state.tasksToMe.forEach((myTask, j) => {
                    if (task.id === myTask.id) state.tasksToMe[j] = task;
                });
            });
        },

        replaceTasksFromMe(state, { tasks, title }) {
            tasks.forEach((task, i) => {
                task.status = title;
                state.tasksFromMe.forEach((taskFromMe, j) => {
                    if (task.id === taskFromMe.id) state.tasksFromMe[j] = task;
                });
            });
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

        setDifficulty(state, difficulty) {
            state.difficulty = difficulty;
        },

        addUserTask(state, task) {
            state.tasksToMe.push(task);
        },

        addAnswer(state, taskWithAnswer) {
            state.tasksToMe.forEach((task, i) => {
                if (task.id === taskWithAnswer.id) state.tasksToMe[i] = taskWithAnswer;
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

        deleteTasksToMe(state) {
            state.tasksToMe = null;
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

        deleteDifficulty(state) {
            state.difficulty = null;
        },

        deleteUserTask(state, taskID) {
            state.tasksToMe.forEach((task, i) => {
                if (task.id === taskID) state.tasksToMe.splice(i, 1);
            });
        },

        deleteTaskFromMe(state, taskID) {
            state.tasksFromMe.forEach((task, i) => {
                if (task.id === taskID) state.tasksFromMe.splice(i, 1);
            });
        },
    },

    actions: {
        async queryTasksToMe({ commit, getters, rootGetters }, { userUID }) {
            const res = await QueryAPI.getTasks(userUID);
            const comments = await AnsQueryAPI.getMyAnswers(userUID);
            // console.log(res);
            // console.log(comments);

            const tasks = [];
            res.data.data.forEach((item, i) => {
                const task = new Task();
                task.id = item.id;
                task.title = item.attributes.title;
                task.body = (item.attributes.body !== null)? item.attributes.body.processed.replace(/(<p>|<\/p>)/g, '') : null;
                task.status = getters.getStatuses.get(item.relationships.field_status.data.id) ?? 'Не определено';
                task.difficulty = getters.getDifficulty.get(item.relationships.field_difficulty_level.data.id) ?? 'Легко';
                task.beginDate = item.attributes.field_begin_date;
                task.dueDate = item.attributes.field_due_date;
                task.progress = 0;
                task.project = (item.relationships.field_project?.data?.id)? 
                    rootGetters['projectM/getProjectByID'](item.relationships.field_project.data.id) : null;

                const authorUID = item.relationships.uid.data.id;
                res.data.included.forEach((itemInc, j) => {
                    if(itemInc.type === 'user--user') {
                        if(itemInc.id === authorUID) {
                            const author = new User();
                            author.uid = authorUID;
                            author.id = itemInc.attributes.drupal_internal__uid;
                            author.name = itemInc.attributes.display_name;

                            const picture = new Picture();
                            picture.uid = itemInc.relationships.user_picture.data.id;

                            author.picture = picture;
                            task.author = author;
                        }
                    }
                });

                res.data.included.forEach((itemInc, j) => {
                    if(itemInc.type === 'file--file') {
                        if(itemInc.id === task.author.picture.uid) task.author.picture.url = itemInc.attributes.uri.url;
                    }
                });

                const answer = new Answer();
                var maxCID = -1;
                comments.data.data.forEach((com) => {
                    if((com.relationships.entity_id.data.id !== task.id) 
                        || (com.attributes.field_name !== 'field_answer')
                        || (maxCID >= com.attributes.drupal_internal__cid)) { return; }

                    answer.uid = com.id;
                    answer.title = com.attributes.subject;
                    answer.body = com.attributes.comment_body.processed.replace(/(<p>|<\/p>)/g, '');
                    answer.progress = getters.getProgress.get(com.relationships.field_progress.data.id);
                    task.progress = answer.progress ?? 0;

                    const answerFilesID = [];
                    // console.log(com.relationships.field_file.data);
                    if(com.relationships.field_file.data.length !== 0) {
                        com.relationships.field_file.data.forEach((file) => {
                            answerFilesID.push(file.id);
                        });
                    }
                    maxCID = com.attributes.drupal_internal__cid;

                    if(comments.data.hasOwnProperty('included')) {
                        comments.data.included.forEach((itemInc) => {
                            if(!answerFilesID.includes(itemInc.id)) { return; }
                            
                            const file = new File();
                            file.id = itemInc.id;
                            file.name = itemInc.attributes.filename;
                            file.url = itemInc.attributes.uri;

                            answer.files.push(file);
                        });
                    }
                });

                task.answers.push(answer);
                tasks.push(task);
            });

            console.log(tasks);
            commit('setTasksToMe', tasks);
        },

        async queryTasksFromMe({ commit, getters, rootGetters }, { userUID }) {
            const res = await QueryAPI.getMyTasks(userUID);
            const comments = await AnsQueryAPI.getAnswers();
            // console.log(res);
            // console.log(comments);

            const tasks = [];
            res.data.data.forEach((item, i) => {
                // console.log("Новая итерация i");
                const task = new Task();
                task.id = item.id;
                task.title = item.attributes.title;
                task.body = (item.attributes.body !== null)? item.attributes.body.processed.replace(/(<p>|<\/p>)/g, '') : null;
                task.status = getters.getStatuses.get(item.relationships.field_status.data.id) ?? 'Не определено';
                task.difficulty = getters.getDifficulty.get(item.relationships.field_difficulty_level.data.id) ?? 'Легко';
                task.beginDate = item.attributes.field_begin_date;
                task.dueDate = item.attributes.field_due_date;
                task.progress = 0;
                task.project = (item.relationships.field_project?.data?.id)? 
                    rootGetters['projectM/getProjectByID'](item.relationships.field_project.data.id) : null;

                const executorUID = item.relationships.field_ispolnitel.data.id;
                res.data.included.forEach((itemInc, j) => {
                    if(itemInc.type === 'user--user') {
                        if(itemInc.id === executorUID) {
                            const executor = new User();
                            executor.uid = executorUID;
                            executor.id = itemInc.attributes.drupal_internal__uid;
                            executor.name = itemInc.attributes.display_name;

                            const picture = new Picture();
                            picture.uid = itemInc.relationships.user_picture.data.id;

                            executor.picture = picture;
                            task.executor = executor;
                        }
                    }
                });

                res.data.included.forEach((itemInc, j) => {
                    if(itemInc.type === 'file--file') {
                        if(itemInc.id === task.executor.picture.uid) task.executor.picture.url = itemInc.attributes.uri.url;
                    }
                });

                var maxCID = -1;
                comments.data.data.forEach((com) => {
                    if((com.relationships.entity_id.data.id !== task.id) || (com.attributes.field_name !== 'field_answer')) { return; }
                    
                    const answer = new Answer();
                    answer.id = com.id;
                    answer.title = com.attributes.subject;
                    answer.body = com.attributes.comment_body.processed.replace(/(<p>|<\/p>)/g, '');
                    answer.progress = getters.getProgress.get(com.relationships.field_progress.data.id);
                    task.progress = (maxCID < com.attributes.drupal_internal__cid)? answer.progress : task.progress;

                    const answerFilesID = [];
                    // console.log(com.relationships.field_file.data);
                    if(com.relationships.field_file.data.length !== 0) {
                        com.relationships.field_file.data.forEach((file) => {
                            answerFilesID.push(file.id);
                        });
                    }
                    if(maxCID < com.attributes.drupal_internal__cid) maxCID = com.attributes.drupal_internal__cid;
                    

                    if(comments.data.hasOwnProperty('included')) {
                        comments.data.included.forEach((itemInc) => {
                            if(!answerFilesID.includes(itemInc.id)) { return; }

                            const file = new File();
                            file.id = itemInc.id;
                            file.name = itemInc.attributes.filename;
                            file.url = itemInc.attributes.uri.url;
                            // console.log('links: ' + file.link);
                            answer.files.push(file);
                        });
                    }

                    task.answers.push(answer);
                });

                tasks.push(task);
                // console.log(task);
            });

            console.log(tasks);
            commit('setTasksFromMe', tasks);
        },

        async replaceTasksFromMe({ commit, getters, dispatch }, { tasks, status }) {
            console.log("Обновление статуса");

            // console.log(tasks);
            // console.log(getters.getTasksFromMe);

            await tasks.forEach(async (task) => {
                const res = await dispatch('editTask', { 
                    id: task.id, 
                    title: task.title, 
                    body: task.body, 
                    executorUID: task.executor.uid, 
                    status: status, 
                    difficulty: task.difficulty,
                    projectID: task.project?.id
                });
            });
        
            // commit('replaceTasksFromMe', { tasks: tasks, title: status });
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
                progress.set(item.id, Number(item.attributes.name.slice(0, -1)));
            });

            //console.log(progress);
            commit('setProgress', progress);
        },

        async getDifficulty({ commit }) {
            const res = await QueryAPI.getDifficulty();
            //console.log(res);

            const difficulty = new Map();
            res.data.data.forEach((item) => {
                difficulty.set(item.id, item.attributes.name);
            });

            //console.log(statuses);
            commit('setDifficulty', difficulty);
        },

        /*async getUsers({ commit }) {
            const res = await QueryAPI.getUsers();
            console.log(res);

            const users = [];
            //console.log(res.data.data.length);
            res.data.data.forEach((item) => {
                if(item.id === ADMIN_ID || item.id === GUEST_ID) { return; }
                const user = new User();
                user.uid = item.id;
                user.id = item.attributes.drupal_internal__uid;
                user.name = item.attributes.display_name;
                users.push(user);
            });

            console.log(users);
            commit('setUsers', users);
        },*/

        async createNewTask({ commit, dispatch, getters, rootGetters }, { title, body, executorUID, difficultyValue, projectID, beginDate, dueDate }) {
            var executor;
            if (!dispatch('userM/isUserExists', { uid: executorUID })) {
                executor = await dispatch('userM/addNewUser', { uid: executorUID });
            }
            else {
                executor = rootGetters['userM/getUserByUID'](executorUID);
            }

            const author = rootGetters['authM/getUser'];
            const difficulties = getters.getDifficulty;

            const res = await QueryAPI.createTask(
                title, 
                body, 
                executorUID, 
                [...difficulties.keys()].find((key) => difficulties.get(key) === difficultyValue),
                projectID,
                beginDate,
                dueDate
            );
            
            // console.log(res);
            // console.log(executor);

            const task = new Task();
            task.id = res.data.data.id;
            task.title = res.data.data.attributes.title;
            task.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.processed.replace(/(<p>|<\/p>)/g, '') : null;
            task.status = 'Не выполнено';
            task.progress = 0;
            task.project = (res.data.data.relationships.field_project?.data?.id)? 
                rootGetters['projectM/getProjectByID'](res.data.data.relationships.field_project.data.id) : null;
            task.executor = executor;
            task.author = author;
            task.beginDate = res.data.data.attributes.field_begin_date;
            task.dueDate = res.data.data.attributes.field_due_date;
            task.difficulty = getters.getDifficulty.get(res.data.data.relationships.field_difficulty_level.data.id);
            task.answers = [];

            console.log(task);
            commit('addTaskFromMe', task);
        },

        async editTask({ commit, getters, rootGetters }, { id, title, body, executorUID, status, difficulty, projectID, beginDate, dueDate }) {
            const statuses = getters.getStatuses;
            const difficulties = getters.getDifficulty;
            const res = await QueryAPI.editTask(
                id, 
                title, 
                body, 
                executorUID, 
                [...statuses.keys()].find((key) => statuses.get(key) === status), 
                [...difficulties.keys()].find((key) => difficulties.get(key) === difficulty),
                projectID,
                beginDate,
                dueDate
            );
            console.log(res);

            console.log("executorUID" + executorUID);
            const task = getters.getTaskFromMeByID(id);
            const user = rootGetters['userM/getUserByUID'](executorUID);
            const picture = rootGetters['userM/getPictureByUserUID'](executorUID);

            task.title = res.data.data.attributes.title;
            task.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.processed.replace(/(<p>|<\/p>)/g, '') : null;
            task.executor = user;
            task.executor.picture = picture;
            console.log("executor" + task.executor);
            task.status = status;
            task.difficulty = difficulty;
            task.project = (res.data.data.relationships.field_project?.data?.id)? 
                rootGetters['projectM/getProjectByID'](res.data.data.relationships.field_project.data.id) : null;

            /*const task = {};
            task.id = id;
            task.title = res.data.data.attributes.title;
            task.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.processed.replace(/(<p>|<\/p>)/g, '') : null;
            task.executorUID = res.data.data.relationships.field_ispolnitel.data.id;*/
            /*const json = await QueryAPI.getUserData(res.data.data.relationships.field_ispolnitel.data.id);
            task.executor = json.data.data.attributes.display_name;
            task.executorPicture = json.data.included[0].attributes.uri.url;*/

            console.log(task);
            commit('editTaskFromMe', task);
        },

        async deleteTask({ commit }, { id }) {
            console.log("Task id: " + id);
            const res = await QueryAPI.deleteTask(id);
            console.log(res);

            commit('deleteTaskFromMe', id);
        },

        async createAnswer({ commit, getters }, { title, body, taskUID, progress, files }) { // TODO
            const progressMap = getters.getProgress;
            const res = await AnsQueryAPI.createAnswer(title, body, [...progressMap.keys()].find((key) => progressMap.get(key) === progress), taskUID);
            console.log(res);
            console.log('Файлы:' + files)

            const task = getters.getUserTaskByID(taskUID);

            const answer = new Answer();
            answer.uid = res.data.data.id;
            answer.title = res.data.data.attributes.subject;
            answer.body = res.data.data.attributes.comment_body.processed.replace(/(<p>|<\/p>)/g, '');
            answer.progress = progress;

            // answer.filesID = [];
            // answer.files = files;
            // if(res.data.data.relationships.field_file.data.length !== 0) {
            //     res.data.data.relationships.field_file.data.forEach((item) => {
            //         const file = new File();
            //         file.uid = item.id;
            //         file.id = item.meta.drupal_internal__target_id;
            //         file.name = 
            //         answer.filesID.push(item.id);
            //     });
            // }
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

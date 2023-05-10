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
        getTaskFromProjectsByID: (state) => (id) => { return state.tasksFromProjects.find(task => task.id === id) },
        getTasksFromProjectsByProjectID: (state) => (id) => state.tasksFromProjects.filter(task => task.project.id === id),

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

        setTasksFromProjects(state, tasks) {
            state.tasksFromProjects = tasks;
        },

        replaceTasks(state, { tasks, title }) {
            tasks.forEach((task) => {
                task.status = title;
                state.tasksToMe.forEach((myTask, j) => {
                    if (task.id === myTask.id) state.tasksToMe[j] = task;
                });
            });
        },

        replaceTasksFromMe(state, { tasks, title }) {
            tasks.forEach((task) => {
                task.status = title;
                state.tasksFromMe.forEach((taskFromMe, j) => {
                    if (task.id === taskFromMe.id) state.tasksFromMe[j] = task;
                });
            });
        },

        replaceTasksFromProjects(state, { tasks, title }) {
            tasks.forEach((task) => {
                task.status = title;
                state.tasksFromProjects.forEach((taskFromProjects, j) => {
                    if (task.id === taskFromProjects.id) state.tasksFromProjects[j] = task;
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

        addTaskFromProjects(state, task) {
            state.tasksFromProjects.push(task);
        },

        editTaskFromMe(state, newTask) {
            state.tasksFromMe.forEach((task, i) => {
                if (task.id === newTask.id) state.tasksFromMe[i] = newTask;
            });
        },

        editTaskFromProjects(state, newTask) {
            state.tasksFromProjects.forEach((task, i) => {
                if (task.id === newTask.id) state.tasksFromProjects[i] = newTask;
            });
        },

        deleteTasksToMe(state) {
            state.tasksToMe = null;
        },

        deleteTasksFromMe(state) {
            state.tasksFromMe = null;
        },

        deleteTasksFromProjects(state) {
            state.tasksFromProjects = null;
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

        deleteTaskFromProjects(state, taskID) {
            state.tasksFromProjects.forEach((task, i) => {
                if (task.id === taskID) state.tasksFromProjects.splice(i, 1);
            });
        },
    },

    actions: {
        async queryTasksToMe({ commit, getters, rootGetters }, { userUID }) {
            const res = await QueryAPI.getTasks(userUID);
            const comments = await AnsQueryAPI.getMyAnswers(userUID);

            const tasks = [];
            res.data.data.forEach((item) => {
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
                res.data.included.forEach((itemInc) => {
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

                res.data.included.forEach((itemInc) => {
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
                    if(com.relationships.field_file.data.length !== 0) {
                        com.relationships.field_file.data.forEach((file) => {
                            answerFilesID.push(file.id);
                        });
                    }
                    maxCID = com.attributes.drupal_internal__cid;

                    if(Object.prototype.hasOwnProperty.call(comments.data, 'included')) {
                        comments.data.included.forEach((itemInc) => {
                            if(!answerFilesID.includes(itemInc.id)) { return; }
                            const file = new File();
                            file.id = itemInc.id;
                            file.name = itemInc.attributes.filename;
                            file.url = itemInc.attributes.uri;
                            answer.files.push(file);
                        });
                    }

                    if(!task.answers.map(ans => ans.uid).includes(answer.uid)) task.answers.push(answer);
                });

                tasks.push(task);
            });

            commit('setTasksToMe', tasks);
        },

        async queryTasksFromMe({ commit, getters, rootGetters }, { userUID }) {
            const res = await QueryAPI.getMyTasks(userUID);
            const comments = await AnsQueryAPI.getAnswers();

            const tasks = [];
            res.data.data.forEach((item) => {
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
                res.data.included.forEach((itemInc) => {
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

                res.data.included.forEach((itemInc) => {
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
                    if(com.relationships.field_file.data.length !== 0) {
                        com.relationships.field_file.data.forEach((file) => {
                            answerFilesID.push(file.id);
                        });
                    }
                    if(maxCID < com.attributes.drupal_internal__cid) maxCID = com.attributes.drupal_internal__cid;
                    
                    if(Object.prototype.hasOwnProperty.call(comments.data, 'included')) {
                        comments.data.included.forEach((itemInc) => {
                            if(!answerFilesID.includes(itemInc.id)) { return; }
                            const file = new File();
                            file.id = itemInc.id;
                            file.name = itemInc.attributes.filename;
                            file.url = itemInc.attributes.uri.url;
                            answer.files.push(file);
                        });
                    }

                    task.answers.push(answer);
                });

                tasks.push(task);
            });

            commit('setTasksFromMe', tasks);
        },

        async queryTasksFromProjects({ commit, getters, rootGetters }) {
            const projects = rootGetters['projectM/getProjects'];

            const res = await QueryAPI.getFilteredTasks(projects.map(pr => pr.id));
            const comments = await AnsQueryAPI.getAnswers();

            const tasks = [];
            res.data.data.forEach((item) => {
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
                const executorUID = item.relationships.field_ispolnitel.data.id;
                res.data.included.forEach((itemInc) => {
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
                        if(itemInc.id === authorUID) {
                            const author = new User();
                            author.uid = executorUID;
                            author.id = itemInc.attributes.drupal_internal__uid;
                            author.name = itemInc.attributes.display_name;
                            const picture = new Picture();
                            picture.uid = itemInc.relationships.user_picture.data.id;
                            author.picture = picture;
                            task.author = author;
                        }
                    }
                });

                res.data.included.forEach((itemInc) => {
                    if(itemInc.type === 'file--file') {
                        if(itemInc.id === task.executor.picture.uid) task.executor.picture.url = itemInc.attributes.uri.url;
                        if(itemInc.id === task.author.picture.uid) task.author.picture.url = itemInc.attributes.uri.url;
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
                    if(com.relationships.field_file.data.length !== 0) {
                        com.relationships.field_file.data.forEach((file) => {
                            answerFilesID.push(file.id);
                        });
                    }
                    if(maxCID < com.attributes.drupal_internal__cid) maxCID = com.attributes.drupal_internal__cid;
                    

                    if(Object.prototype.hasOwnProperty.call(comments.data, 'included')) {
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
            });

            commit('setTasksFromProjects', tasks);
        },

        async replaceTasks({ rootGetters, dispatch }, { tasks, status, type = 'fromMe' }) {
            await tasks.forEach(async (task) => {
                const user = rootGetters['authM/getUser'];
                if((!user.roles.includes('administrator')) && (!user.roles.includes('manager')) 
                    && (user.uid !== task.executor.uid)) { return; }
                await dispatch('editTask', { 
                    id: task.id, 
                    title: task.title, 
                    body: task.body, 
                    executorUID: task.executor.uid, 
                    status: status, 
                    difficulty: task.difficulty,
                    projectID: task.project?.id,
                    type: type
                });
            });
        },

        async getStatuses({ commit }) {
            const res = await QueryAPI.getStatuses();

            const statuses = new Map();
            res.data.data.forEach((item) => {
                statuses.set(item.id, item.attributes.name);
            });

            commit('setStatuses', statuses);
        },

        async getProgress({ commit }) {
            const res = await QueryAPI.getProgress();

            const progress = new Map();
            res.data.data.forEach((item) => {
                progress.set(item.id, Number(item.attributes.name.slice(0, -1)));
            });

            commit('setProgress', progress);
        },

        async getDifficulty({ commit }) {
            const res = await QueryAPI.getDifficulty();

            const difficulty = new Map();
            res.data.data.forEach((item) => {
                difficulty.set(item.id, item.attributes.name);
            });

            commit('setDifficulty', difficulty);
        },

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

        async editTask({ commit, getters, rootGetters }, { id, title, body, executorUID, status, difficulty, projectID, beginDate, dueDate, type = 'fromMe' }) {
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

            console.log("executorUID" + executorUID);
            const task = (type === 'fromMe')? getters.getTaskFromMeByID(id) : getters.getTaskFromProjectsByID(id);
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

            if(type === 'fromMe') commit('editTaskFromMe', task);
            else commit('editTaskFromProjects', task);
        },

        async deleteTask({ commit }, { id }) {
            console.log("Task id: " + id);
            const res = await QueryAPI.deleteTask(id);
            console.log(res);

            commit('deleteTaskFromMe', id);
        },

        async createAnswer({ commit, getters }, { title, body, taskUID, progress, files }) {
            const filesID = [];
            if(files.length > 0) {
                for (const file of files) {
                    filesID.push((await AnsQueryAPI.createFile(file.name, file.File)).data.data.id) ;
                }
            }
            const progressMap = getters.getProgress;
            const res = await AnsQueryAPI.createAnswer(title, body, [...progressMap.keys()].find((key) => progressMap.get(key) === progress), taskUID, filesID);

            const task = getters.getUserTaskByID(taskUID);

            const answer = new Answer();
            answer.uid = res.data.data.id;
            answer.title = res.data.data.attributes.subject;
            answer.body = res.data.data.attributes.comment_body.processed.replace(/(<p>|<\/p>)/g, '');
            answer.progress = progress;

            if(res.data.data.relationships.field_file.data.length !== 0) {
                for (const item of res.data.data.relationships.field_file.data) {
                    const file = new File();
                    file.uid = item.id;
                    file.id = item.meta.drupal_internal__target_id;
                    const includedFile = await AnsQueryAPI.getFile(file.uid);
                    file.name = includedFile.attributes.filename;
                    file.url = includedFile.attributes.uri.url;
                    answer.files.push(file);
                }
            }
            task.progress = progress;
            task.answers.push(answer);

            commit('addAnswer', task);
        },
    }
}

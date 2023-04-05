import { ProjectsQueryAPI } from "@/api/projectAPI";
import Project from "@/model/Project";
import Task from "@/model/Task";
import User from "@/model/User";
const ADMIN_ID = '6da4f1c5-7607-4047-a6d0-011ba3e0c6cb';
const GUEST_ID = '52a3ddd5-2b1f-4b48-b600-14507b648d69';

export const ProjectModule = {
    namespaced: true,

    state() {
        return {
            projects: [],
        }
    },

    getters: {
        getProjects: (state) => state.projects,
        getProjectByID: (state) => (id) => { return state.projects.find(project => project.id === id) },
        getAllUsers: (state, getters, rootState, rootGetters) => rootGetters['teamM/getUsers'],
    },

    mutations: {
        setProjects(state, projects) {
            state.projects = projects;
        },

        addProject(state, project) {
            state.projects.push(project);
            //localStorage.setItem('projects', state.projects);
        },

        editProject(state, newProject) {
            state.projects.forEach((project, i) => {
                if (project.id === newProject.id) state.projects[i] = newProject;
            });
        },

        deleteProjects(state) {
            state.projects = null;
        },

        deleteProject(state, projectID) {
            state.projects.forEach((project, i) => {
                if (project.id === projectID) state.projects.splice(i, 1);
            });
            //localStorage.setItem('projects', state.projects);
        },
    },

    actions: {
        async queryProjects({ commit }, { teamUID }) {
            const res = await ProjectsQueryAPI.getProjects(teamUID);
            console.log(res);

            const projects = [];
            res.data.data.forEach((item, i) => {
                const project = new Project();
                project.id = item.id;
                project.title = item.attributes.title;
                project.body = (item.attributes.body !== null)? item.attributes.body.value : null;
                project.tasksID = item.relationships.field_task.data.map(task => task.id);
                project.tasks = new Map();

                res.data.included.forEach((itemInc) => {
                    if(itemInc.type === 'node--task') {
                        if(project.tasksID.includes(itemInc.id)) {
                            const task = new Task();
                            task.id = itemInc.id;
                            task.title = itemInc.attributes.title;
                            task.body = (item.attributes.body !== null)? item.attributes.body.value : null;

                            const executor = new User();
                            executor.uid = itemInc.relationships.field_ispolnitel.data.id;
                            executor.name = this.getUser(task.executorUID) ?? null;
                            task.executor = executor;

                            project.tasks.set(task.id, task);
                        }
                    }
                });

                /*const executorsUID = [...new Set([...project.tasks.values()].map(task => task.executorUID))];
                console.log(executorsUID);
                var tasksWithExecutors = [];

                res.data.included.forEach((itemInc) => {
                    if(itemInc.type === 'user--user') {
                        if(executorsUID.includes(itemInc.id)) {
                            tasksWithExecutors = 
                                [...project.tasks.values()]
                                .filter(task => task.executorUID === itemInc.id)
                                .map(task => { 
                                    task.executor = itemInc.attributes.display_name;
                                    task.executorPictureID = itemInc.relationships.user_picture.data.id;
                                    project.tasks.set(task.id, task);
                                    return task;
                                });
                            
                        }
                    }
                });

                res.data.included.forEach((itemInc) => {
                    if(itemInc.type === 'file--file') {
                        if(itemInc.id === task.executorPictureID) task.executorPicture = itemInc.attributes.uri.url;
                    }
                });*/

                projects.push(project);
                console.log(team);
            });

            commit('setTeams', teams);
        },

        getUser({ getters }, userID) {
            const allUsers = getters.getAllUsers();
            console.log(res);

            const user = allUsers.find(user => user.id === userID);

            console.log("USER: " + user);
            return user;
        },
    }
}

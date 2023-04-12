import { ProjectsQueryAPI } from "@/api/projectAPI";
import Project from "@/model/Project";
import Task from "@/model/Task";

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
        async queryProjects({ commit, dispatch }, { teamID }) {
            const res = await ProjectsQueryAPI.getProjects(teamID);
            console.log(res);

            const projects = [];
            res.data.data.forEach((item, i) => {
                const project = new Project();
                project.id = item.id;
                project.title = item.attributes.title;
                project.body = (item.attributes.body !== null)? item.attributes.body.value : null;
                const projectTasksID = item.relationships.field_task.data.map(task => task.id);

                res.data.included.forEach((itemInc) => {
                    if(itemInc.type === 'node--task') {
                        if(projectTasksID.includes(itemInc.id)) {
                            const task = new Task();
                            task.id = itemInc.id;
                            task.title = itemInc.attributes.title;
                            task.body = (item.attributes.body !== null)? item.attributes.body.value : null;

                            const executorUID = itemInc.relationships.field_ispolnitel.data.id;
                            const executor = dispatch('getUser', { userUID: executorUID }) ?? null;
                            task.executor = executor;

                            project.tasks.push(task);
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
            });

            commit('setProjects', projects);
        },

        getUser({ rootGetters }, { userUID }) {
            const allUsers = rootGetters['userM/getUsers'];
            console.log(res);

            const user = allUsers.find(user => user.uid === userUID);

            console.log("USER: " + user);
            return user;
        },
    }
}

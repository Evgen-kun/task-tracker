import { ProjectsQueryAPI } from "@/api/projectAPI";
import Project from "@/model/Project";

export const ProjectModule = {
    namespaced: true,

    state() {
        return {
            projects: [],
        }
    },

    getters: {
        getProjects: (state) => state.projects,
        getProjectsByTeamID: (state) => (teamID) => { return state.projects.filter(project => project.team.id === teamID) },
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
        async queryProjects({ commit, rootGetters, dispatch }, { userUID }) {
            const res = await ProjectsQueryAPI.getProjectsByUserUID(userUID);
            console.log(res);

            const projects = [];
            res.data.data.forEach((item, i) => { //TODO Поменять сам запрос в API
                const project = new Project();
                project.id = item.id;
                project.title = item.attributes.title;
                project.body = (item.attributes.body !== null)? item.attributes.body.value : null;
                // const projectTasksID = item.relationships.field_task.data.map(task => task.id);
                // project.tasks = allTasks.filter(task => projectTasksID.includes(task.id));
                project.team = (!!item.relationships.field_team?.data?.id)? rootGetters['teamM/getTeamByID'](item.relationships.field_team.data.id) : null;

                // res.data.included.forEach((itemInc) => {
                //     if(itemInc.type === 'node--task') {
                //         if(projectTasksID.includes(itemInc.id)) {
                //             const task = new Task();
                //             task.id = itemInc.id;
                //             task.title = itemInc.attributes.title;
                //             task.body = (item.attributes.body !== null)? item.attributes.body.value : null;

                //             const executorUID = itemInc.relationships.field_ispolnitel.data.id;
                //             const executor = dispatch('getUser', { userUID: executorUID }) ?? null;
                //             task.executor = executor;

                //             project.tasks.push(task);
                //         }
                //     }
                // });

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

            console.log(projects);
            commit('setProjects', projects);
        },

        getUser({ rootGetters }, { userUID }) {
            const allUsers = rootGetters['userM/getUsers'];
            console.log(res);

            const user = allUsers.find(user => user.uid === userUID);

            console.log("USER: " + user);
            return user;
        },

        async createProject({ commit, rootGetters }, { title, body, teamID }) {
            const res = await ProjectsQueryAPI.createProject(title, body, teamID);
            // const allUsers = rootGetters['userM/getUsers'];
            // console.log(res);
            // console.log(allUsers);

            const project = new Project();
            project.id = res.data.data.id;
            project.title = res.data.data.attributes.title;
            project.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.value : null;
            project.team = (!!res.data.data.relationships.field_team?.data?.id)? 
                rootGetters['teamM/getTeamByID'](res.data.data.relationships.field_team.data.id) : null;
            // project.users = allUsers.filter(user => usersUID.includes(user.id));

            console.log(project);
            commit('addProject', project);
        },

        async editProject({ getters, rootGetters, commit }, { id, title, body, teamID }) {
            const res = await ProjectsQueryAPI.editProject(id, title, body, teamID);
            // const allUsers = rootGetters['userM/getUsers'];
            // const allTasks = rootGetters['taskM/getTasks'];
            // console.log(res);
            // console.log(allUsers);

            const project = getters.getProjectByID(id);
            project.title = res.data.data.attributes.title;
            project.body = (res.data.data.attributes.body !== null)? res.data.data.attributes.body.value : null;
            project.team = (!!res.data.data.relationships.field_team?.data?.id)? 
                rootGetters['teamM/getTeamByID'](res.data.data.relationships.field_team.data.id) : null;

            console.log(project);
            commit('editProject', project);
        },

        async deleteProject({ commit }, { id }) {
            console.log("Project id: " + id);
            const res = await ProjectsQueryAPI.deleteProject(id);
            console.log(res);

            commit('deleteProject', id);
        },
    }
}

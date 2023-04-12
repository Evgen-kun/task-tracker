import { QueryAPIInstance, PostQueryAPIInstance } from "@/api";
import store from "@/plugins/store";

export const ProjectsQueryAPI = {
    /**
     * 
     * @param {string} teamID
     * @returns {Promise<AxiosResponse<any>>}
     */
    getProjects(teamID) {
        const url = `http://localhost/drupal/web/jsonapi/node/team?filter[id]=${teamID}&fields[node--team]=id,title,body,field_member,field_project&include=field_project.field_task&fields[node--project]=id,title,body,field_task&fields[node--task]=id,title,body,field_ispolnitel,field_status`;
        return QueryAPIInstance.get(url);
    },

    /*async createProject(title, body, usersUID) {
        const url = `http://localhost/drupal/web/jsonapi/node/project`;
        const data = { 
            data: {
                type: "node--team",
                attributes: {
                    title: title,
                    body: {
                        value: body,
                        format: "plain_text"
                    }
                },
                relationships: {
                    field_member: {
                        data: (usersUID.length !== 0)? usersUID.map(userUID => userUID = {type: "user--user", id: userUID}) : [],
                    }
                }
            }
        };
        PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = await store.getters['authM/getToken'];
        //PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = token.data;
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        console.log(PostQueryAPIInstance.defaults.headers['X-CSRF-Token']);
        console.log(PostQueryAPIInstance.defaults.headers['Authorization']);
        return PostQueryAPIInstance.post(url, data);
    },

    async editProject(id, title, body, usersUID) {
        const url = `http://localhost/drupal/web/jsonapi/node/project/${id}`;
        const data = { 
            data: {
                type: "node--team",
                id: id,
                attributes: {
                    title: title,
                    body: {
                        value: body,
                        format: "plain_text"
                    }
                },
                relationships: {
                    field_member: {
                        data: (usersUID.length !== 0)? usersUID.map(userUID => userUID = {type: "user--user", id: userUID}) : [],
                    }
                }
            }
        };
        PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = await store.getters['authM/getToken'];
        //PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = token.data;
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        console.log(PostQueryAPIInstance.defaults.headers['X-CSRF-Token']);
        console.log(PostQueryAPIInstance.defaults.headers['Authorization']);
        return PostQueryAPIInstance.patch(url, data);
    },
    
    async deleteProject(id) {
        const url = `http://localhost/drupal/web/jsonapi/node/project/${id}`;

        PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = await store.getters['authM/getToken'];
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        console.log(PostQueryAPIInstance.defaults.headers['X-CSRF-Token']);
        console.log(PostQueryAPIInstance.defaults.headers['Authorization']);
        return PostQueryAPIInstance.delete(url);
    },*/

}
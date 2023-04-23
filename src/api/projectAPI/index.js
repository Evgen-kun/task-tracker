import { QueryAPIInstance, PostQueryAPIInstance } from "@/api";
import store from "@/plugins/store";

export const ProjectsQueryAPI = {
    /**
     * 
     * @param {string} userUID
     * @returns {Promise<AxiosResponse<any>>}
     */
    getProjectsByUserUID(userUID) {
        const url = `http://localhost/drupal/web/jsonapi/node/project?filter[uid.id]=${userUID}&fields[node--project]=id,title,body,field_team`;
        return QueryAPIInstance.get(url);
    },

    /**
     * 
     * @param {string} teamID
     * @returns {Promise<AxiosResponse<any>>}
     */
    getProjectsByTeamID(teamID) {
        const url = `http://localhost/drupal/web/jsonapi/node/team?filter[id]=${teamID}&fields[node--team]=id,title,body,field_member,field_project&include=field_project.field_task&fields[node--project]=id,title,body,field_task&fields[node--task]=id,title,body,field_ispolnitel,field_status`;
        return QueryAPIInstance.get(url);
    },

    async createProject(title, body, teamID) {
        const url = `http://localhost/drupal/web/jsonapi/node/project`;
        const data = { 
            data: {
                type: "node--project",
                attributes: {
                    title: title,
                    body: {
                        value: body,
                        format: "plain_text"
                    }
                },
                relationships: {
                    field_team: {
                        data: {
                            type: "node--team",
                            id: teamID
                        }
                    }
                }
            }
        };
        PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = await store.getters['authM/getToken'];
        //PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = token.data;
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        return PostQueryAPIInstance.post(url, data);
    },

    async editProject(id, title, body, teamID) {
        const url = `http://localhost/drupal/web/jsonapi/node/project/${id}`;
        const data = { 
            data: {
                type: "node--project",
                id: id,
                attributes: {
                    title: title,
                    body: {
                        value: body,
                        format: "plain_text"
                    }
                },
                relationships: {
                    field_team: {
                        data: {
                            type: "node--team",
                            id: teamID
                        }
                    }
                }
            }
        };
        PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = await store.getters['authM/getToken'];
        //PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = token.data;
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        return PostQueryAPIInstance.patch(url, data);
    },
    
    async deleteProject(id) {
        const url = `http://localhost/drupal/web/jsonapi/node/project/${id}`;

        PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = await store.getters['authM/getToken'];
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        return PostQueryAPIInstance.delete(url);
    },

}
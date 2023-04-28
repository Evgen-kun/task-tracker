import { QueryAPIInstance, PostQueryAPIInstance } from "@/api";
import store from "@/plugins/store";

export const ProjectsQueryAPI = {
    /**
     * 
     * @param {string} teamID
     * @returns {Promise<AxiosResponse<any>>}
     */
    getProject(projectID) {
        const url = `http://localhost/drupal/web/jsonapi/node/project?filter[id]=${projectID}&fields[node--project]=id,title,body,field_team,field_inprogress_restriction`;
        return QueryAPIInstance.get(url);
    },

    /**
     * 
     * @param {string} userUID
     * @returns {Promise<AxiosResponse<any>>}
     */
    getProjectsByUserUID(userUID) {
        const url = `http://localhost/drupal/web/jsonapi/node/project?filter[uid.id]=${userUID}&fields[node--project]=id,title,body,field_team,field_inprogress_restriction`;
        return QueryAPIInstance.get(url);
    },

    /**
     * 
     * @param {string} teamID
     * @returns {Promise<AxiosResponse<any>>}
     */
    getProjectsByTeamID(teamID) {
        const url = `http://localhost/drupal/web/jsonapi/node/project?filter[field_team.id]=${teamID}&fields[node--project]=id,title,body,field_team,field_inprogress_restriction`;
        return QueryAPIInstance.get(url);
    },

    /**
     * 
     * @param {Array} teamsID
     * @returns {Promise<AxiosResponse<any>>}
     */
    getProjectsByTeamsID(teamsID) {
        const str = teamsID.reduce(
            (acc, item, i) => acc + `&filter[teamsFilter][condition][value][${i + 1}]=${item}`, '');
        const url = `http://localhost/drupal/web/jsonapi/node/project?fields[node--project]=id,title,body,field_team,field_inprogress_restriction&filter[teamsFilter][condition][path]=field_team.id&filter[teamsFilter][condition][operator]=IN${str}`;
        return QueryAPIInstance.get(url);
    },

    async createProject(title, body, inProgressRestriction, teamID) {
        const url = `http://localhost/drupal/web/jsonapi/node/project`;
        const data = { 
            data: {
                type: "node--project",
                attributes: {
                    title: title,
                    body: {
                        value: body,
                        format: "plain_text"
                    },
                    field_inprogress_restriction: inProgressRestriction,
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

    async editProject(id, title, body, inProgressRestriction, teamID) {
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
                    },
                    field_inprogress_restriction: inProgressRestriction,
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
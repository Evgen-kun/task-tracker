import { QueryAPIInstance, PostQueryAPIInstance } from "@/api";
import { API_LINK } from "/settings";
import store from "@/plugins/store";

export const TeamsQueryAPI = {
    getTeams(userUID) {
        const url = API_LINK + `/jsonapi/node/team?include=field_member.user_picture&filter[uid.id]=${userUID}&fields[node--team]=id,title,body,field_member&fields[user--user]=id,display_name,user_picture`;
        return QueryAPIInstance.get(url);
    },

    getTeamsWithMe(userUID) {
        const url = API_LINK + `/jsonapi/node/team?include=field_member.user_picture&filter[field_member.id]=${userUID}&fields[node--team]=id,title,body,field_member&fields[user--user]=id,display_name,user_picture`;
        return QueryAPIInstance.get(url);
    },

    getAllUsers() {
        const url = API_LINK + `/jsonapi/user/user?include=user_picture&fields[user--user]=drupal_internal__uid,display_name,user_picture&fields[file--file]=uri`;
        return QueryAPIInstance.get(url);
    },

    async createTeam(title, body, usersUID) {
        const url = API_LINK + `/jsonapi/node/team`;
        const data = { 
            data: {
                type: "node--team",
                attributes: {
                    title: title,
                    body: {
                        value: `<p>${body}</p>`,
                        format: "basic_html"
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
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        return PostQueryAPIInstance.post(url, data);
    },

    async editTeam(id, title, body, usersUID) {
        const url = API_LINK + `/jsonapi/node/team/${id}`;
        const data = { 
            data: {
                type: "node--team",
                id: id,
                attributes: {
                    title: title,
                    body: {
                        value: `<p>${body}</p>`,
                        format: "basic_html"
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
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        return PostQueryAPIInstance.patch(url, data);
    },
    
    async deleteTeam(id) {
        const url = API_LINK + `/jsonapi/node/team/${id}`;
        PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = await store.getters['authM/getToken'];
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        return PostQueryAPIInstance.delete(url);
    },
}
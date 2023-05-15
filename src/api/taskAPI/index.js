import { QueryAPIInstance, PostQueryAPIInstance } from "@/api";
import { API_LINK } from "/settings";
import store from "@/plugins/store";

export const QueryAPI = {
    getTasks(userUID) {
        const url = API_LINK + `/jsonapi/node/task?include=uid.user_picture,field_project&filter[field_ispolnitel.id]=${userUID}&fields[node--task]=id,title,body,uid,field_status,field_difficulty_level,field_begin_date,field_due_date,field_project&fields[user--user]=id,display_name,drupal_internal__uid,user_picture&fields[file--file]=id,uid,uri`;
        return QueryAPIInstance.get(url);
    },

    getMyTasks(userUID) {
        const url = API_LINK + `/jsonapi/node/task?include=field_ispolnitel.user_picture&filter[uid.id]=${userUID}&fields[node--task]=id,title,body,field_ispolnitel,field_status,field_difficulty_level,field_begin_date,field_due_date,field_project&fields[user--user]=id,display_name,drupal_internal__uid,user_picture&fields[file--file]=id,uri`;
        return QueryAPIInstance.get(url);
    },

    getFilteredTasks(projectsID) {
        const str = projectsID.reduce(
            (acc, item, i) => acc + `&filter[projectsFilter][condition][value][${i + 1}]=${item}`, '');
        const url = API_LINK + `/jsonapi/node/task?include=uid.user_picture,field_ispolnitel.user_picture&fields[node--task]=id,title,body,field_ispolnitel,field_status,field_difficulty_level,field_begin_date,field_due_date,field_project,uid&fields[user--user]=id,display_name,drupal_internal__uid,user_picture&fields[file--file]=id,uri&filter[projectsFilter][condition][path]=field_project.id&filter[projectsFilter][condition][operator]=IN${str}`;
        return QueryAPIInstance.get(url);
    },

    getStatuses() {
        const url = API_LINK + `/jsonapi/taxonomy_term/status?fields[taxonomy_term--status]=id,name`;
        return QueryAPIInstance.get(url);
    },

    getProgress() {
        const url = API_LINK + `/jsonapi/taxonomy_term/progress?fields[taxonomy_term--progress]=id,name`;
        return QueryAPIInstance.get(url);
    },

    getDifficulty() {
        const url = API_LINK + `/jsonapi/taxonomy_term/difficulty_level?fields[taxonomy_term--difficulty_level]=id,name`;
        return QueryAPIInstance.get(url);
    },

    async createTask(title, body, executorUID, difficultyID, projectID, beginDate, dueDate) {
        const url = API_LINK + `/jsonapi/node/task`;
        const data = { 
            data: {
                type: "node--task",
                attributes: {
                    title: title,
                    body: {
                        value: `<p>${body}</p>`,
                        format: "basic_html"
                    },
                    field_begin_date: beginDate,
                    field_due_date: dueDate
                },
                relationships: {
                    field_ispolnitel: {
                        data: {
                            type: "user--user",
                            id: executorUID
                        }
                    },
                    field_difficulty_level: {
                        data: {
                            type: "taxonomy_term--difficulty_level",
                            id: difficultyID
                        }
                    },
                    field_project: {
                        data: (projectID)? {
                            type: "node--project",
                            id: projectID
                        } : null
                    },
                }
            }
        };
        PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = await store.getters['authM/getToken'];
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        return PostQueryAPIInstance.post(url, data);
    },

    async editTask(id, title, body, executorUID, statusUID, difficultyID, projectID, beginDate, dueDate) {
        const url = API_LINK + `/jsonapi/node/task/${id}`;
        const data = { 
            data: {
                type: "node--task",
                id: id,
                attributes: {
                    title: title,
                    body: {
                        value: `<p>${body}</p>`,
                        format: "basic_html"
                    },
                    field_begin_date: beginDate,
                    field_due_date: dueDate
                },
                relationships: {
                    field_ispolnitel: {
                        data: {
                            type: "user--user",
                            id: executorUID
                        }
                    },
                    field_status: {
                        data: {
                            type: "taxonomy_term--status",
                            id: statusUID
                        }
                    },
                    field_difficulty_level: {
                        data: {
                            type: "taxonomy_term--difficulty_level",
                            id: difficultyID
                        }
                    },
                    field_project: {
                        data: (projectID)? {
                            type: "node--project",
                            id: projectID
                        } : null
                    },
                }
            }
        };
        PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = await store.getters['authM/getToken'];
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        return PostQueryAPIInstance.patch(url, data);
    },

    async deleteTask(id) {
        const url = API_LINK + `/jsonapi/node/task/${id}`;
        PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = await store.getters['authM/getToken'];
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        return PostQueryAPIInstance.delete(url);
    },

}
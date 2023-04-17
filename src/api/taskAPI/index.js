import { QueryAPIInstance, PostQueryAPIInstance } from "@/api";
import store from "@/plugins/store";

export const QueryAPI = {
    /**
     * 
     * @param {string} userUID
     * @returns {Promise<AxiosResponse<any>>}
     */
    getTasks(userUID) {
        const url = `http://localhost/drupal/web/jsonapi/node/task?include=uid.user_picture&filter[field_ispolnitel.id]=${userUID}&fields[node--task]=id,title,body,uid,field_status,field_difficulty_level,field_begin_date,field_due_date&fields[user--user]=id,display_name,user_picture&fields[file--file]=id,uid,uri`;
        return QueryAPIInstance.get(url);
    },

    getMyTasks(userUID) {
        const url = `http://localhost/drupal/web/jsonapi/node/task?include=field_ispolnitel.user_picture&filter[uid.id]=${userUID}&fields[node--task]=id,title,body,field_ispolnitel,field_status,field_difficulty_level,field_begin_date,field_due_date&fields[user--user]=id,display_name,user_picture&fields[file--file]=id,uri`;
        return QueryAPIInstance.get(url);
    },

    getStatuses() {
        const url = `http://localhost/drupal/web/jsonapi/taxonomy_term/status?fields[taxonomy_term--status]=id,name`;
        return QueryAPIInstance.get(url);
    },

    getProgress() {
        const url = `http://localhost/drupal/web/jsonapi/taxonomy_term/progress?fields[taxonomy_term--progress]=id,name`;
        return QueryAPIInstance.get(url);
    },

    getDifficulty() {
        const url = `http://localhost/drupal/web/jsonapi/taxonomy_term/difficulty_level?fields[taxonomy_term--difficulty_level]=id,name`;
        return QueryAPIInstance.get(url);
    },

    async createTask(title, body, executorUID, difficultyID) {
        const url = `http://localhost/drupal/web/jsonapi/node/task`;
        const data = { 
            data: {
                type: "node--task",
                attributes: {
                    title: title,
                    body: {
                        value: body,
                        format: "plain_text"
                    }
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

    async editTask(id, title, body, executorUID, statusUID, difficultyID) {
        const url = `http://localhost/drupal/web/jsonapi/node/task/${id}`;
        const data = { 
            data: {
                type: "node--task",
                id: id,
                attributes: {
                    title: title,
                    body: {
                        value: body,
                        format: "plain_text"
                    }
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
                    }
                }
            }
        };

        PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = await store.getters['authM/getToken'];
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        console.log(PostQueryAPIInstance.defaults.headers['X-CSRF-Token']);
        console.log(PostQueryAPIInstance.defaults.headers['Authorization']);
        return PostQueryAPIInstance.patch(url, data);
    },

    async deleteTask(id) {
        const url = `http://localhost/drupal/web/jsonapi/node/task/${id}`;

        PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = await store.getters['authM/getToken'];
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        console.log(PostQueryAPIInstance.defaults.headers['X-CSRF-Token']);
        console.log(PostQueryAPIInstance.defaults.headers['Authorization']);
        return PostQueryAPIInstance.delete(url);
    },

}
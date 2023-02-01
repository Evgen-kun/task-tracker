import { QueryAPIInstance } from "@/api";

export const QueryAPI = {
    /**
     * 
     * @param {string} userUID
     * @returns {Promise<AxiosResponse<any>>}
     */
    getTasks(userUID) {
        const url = `http://localhost/drupal/web/jsonapi/node/task?include=uid.user_picture&filter[field_ispolnitel.id]=${userUID}&fields[node--task]=id,title,body,uid&fields[user--user]=id,display_name,user_picture&fields[file--file]=id,uid,uri`;
        return QueryAPIInstance.get(url);
    },

    getMyTasks(userUID) {
        const url = `http://localhost/drupal/web/jsonapi/node/task?include=field_ispolnitel.user_picture&filter[uid.id]=${userUID}&fields[node--task]=id,title,body,field_ispolnitel&fields[user--user]=id,display_name,user_picture&fields[file--file]=id,uri`;
        return QueryAPIInstance.get(url);
    },

}
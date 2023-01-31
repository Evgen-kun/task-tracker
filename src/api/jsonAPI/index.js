import { QueryAPIInstance } from "@/api";

export const QueryAPI = {
    /**
     * 
     * @param {string} userUID
     * @returns {Promise<AxiosResponse<any>>}
     */
    getTasks(userUID) {
        const url = 'http://localhost/drupal/web/jsonapi/node/task?fields[node--task]=title,body';
        return QueryAPIInstance.get(url);
    }

}
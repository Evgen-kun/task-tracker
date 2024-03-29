import { QueryAPIInstance, LoginAPIInstance } from "@/api";
import { API_LINK } from "/settings";

export const UsersQueryAPI = {

    /**
     * 
     * @param {String} uid
     * @returns {Promise<AxiosResponse<any>>}
     */
    getUser(uid) {
        const url = API_LINK + `/jsonapi/user/user/${uid}?include=user_picture&fields[user--user]=id,drupal_internal__uid,display_name,mail,roles,user_picture&fields[file--file]=uri`;
        return QueryAPIInstance.get(url);
    },

    /**
     * 
     * @returns {Promise<AxiosResponse<any>>}
     */
    getUsers() {
        const url = API_LINK + `/jsonapi/user/user?include=user_picture&fields[user--user]=id,drupal_internal__uid,display_name,mail,roles,user_picture&fields[file--file]=uri`;
        return QueryAPIInstance.get(url);
    },

    /**
     * 
     * @param {Array<String>} usersUID
     * @returns {Promise<AxiosResponse<any>>}
     */
    getFilteredUsers(usersUID) {
        const str = usersUID.reduce(
            (acc, item, i) => acc + `&filter[usersFilter][condition][value][${i + 1}]=${item}`, '');
        const url = API_LINK + `/jsonapi/user/user?include=user_picture&fields[user--user]=id,drupal_internal__uid,display_name,mail,roles,user_picture&fields[file--file]=uri&filter[usersFilter][condition][path]=id&filter[usersFilter][condition][operator]=IN${str}`;
        return QueryAPIInstance.get(url);
    },
    
    /**
     * 
     * @returns {Promise<AxiosResponse<any>>}
     */
    getUsersNames() {
        const url = API_LINK + `/jsonapi/user/user?fields[user--user]=id,drupal_internal__uid,display_name`;
        return QueryAPIInstance.get(url);
    },

    /**
     * 
     * @returns {Promise<AxiosResponse<any>>}
     */
    getUsersWithPictures() {
        const url = API_LINK + `/jsonapi/user/user?include=user_picture&fields[user--user]=id,drupal_internal__uid,display_name,user_picture&fields[file--file]=uri`;
        return QueryAPIInstance.get(url);
    },

    /**
     * 
     * @returns {Promise<AxiosResponse<any>>}
     */
    getUserUID() {
        const url = API_LINK + `/jsonapi`;
        return LoginAPIInstance.get(url);
    },

    /**
     * 
     * @param {Number} userPictureID
     * @returns {Promise<AxiosResponse<any>>}
     */
    getUserPicture(userPictureID) {
        const url = API_LINK + `/jsonapi/file/file/${userPictureID}?fields[file--file]=uri`;
        return QueryAPIInstance.get(url);
    },

    /**
     * 
     * @param {String} userUID 
     * @returns {Promise<AxiosResponse<any>>}
     */
    getUserData(userUID) {
        const url = API_LINK + `/jsonapi/user/user?filter[id]=${userUID}&fields[user--user]=id,name,mail,user_picture,roles`;
        return QueryAPIInstance.get(url);
    },
}
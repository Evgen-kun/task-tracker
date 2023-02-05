import { LoginAPIInstance, DefaultAPIInstance, QueryAPIInstance } from "@/api";

export const AuthAPI = {
    /**
     * 
     * @param {string} login 
     * @param {string} password 
     * @returns {Promise<AxiosResponse<any>>}
     */
    login(login, password) {
        const url = 'http://localhost/drupal/web/user/login';
        var bodyFormData = new FormData();
        bodyFormData.append('name', login);
        bodyFormData.append('pass', password);
        bodyFormData.append('form_build_id', 'form-dDDcy4VEZkPWMGR-eQP9EyW63TALj9lYEKAFiCXzJOU');
        bodyFormData.append('form_id', 'user_login_form');
        bodyFormData.append('op', 'Войти');
        //LoginAPIInstance.defaults.headers['Authorization'] = `Basic ${btoa(login + ":" + password)}`;
        return LoginAPIInstance.post(url, bodyFormData);
    },

    /**
     * 
     * @returns {Promise<AxiosResponse<any>>}
     */
    getToken() {
        const url = `http://localhost/drupal/web/session/token`;
        return LoginAPIInstance.get(url);
    },

    /**
     * 
     * @returns {Promise<AxiosResponse<any>>}
     */
    getUsersREST() {
        const url = `http://localhost/drupal/web/all_users`;
        return LoginAPIInstance.get(url);
    },

    /**
     * 
     * @returns {Promise<AxiosResponse<any>>}
     */
    logout() {
        const url = 'http://localhost/drupal/web/user/logout';
        //console.log("logout отработал " + name);
        return LoginAPIInstance.get(url);
    },

    /**
     * 
     * @param {Number} userPictureID
     * @returns {Promise<AxiosResponse<any>>}
     */
    getUserPicture(userPictureID) {
        const url = `http://localhost/drupal/web/jsonapi/file/file/${userPictureID}?fields[file--file]=uri`;
        return QueryAPIInstance.get(url);
    },

    /**
     * 
     * @param {Number} userID 
     * @returns {Promise<AxiosResponse<any>>}
     */
    getUserData(userID) {
        const url = `http://localhost/drupal/web/jsonapi/user/user?filter[drupal_internal__uid]=${userID}&fields[user--user]=id,name,mail,user_picture`;
        return QueryAPIInstance.get(url);
    },
}
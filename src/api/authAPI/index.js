import { LoginAPIInstance } from "@/api";
import { API_LINK } from "/settings";

export const AuthAPI = {
    /**
     * 
     * @param {string} login 
     * @param {string} password 
     * @returns {Promise<AxiosResponse<any>>}
     */
    login(login, password) {
        const url = API_LINK + '/user/login';
        var bodyFormData = new FormData();
        bodyFormData.append('name', login);
        bodyFormData.append('pass', password);
        bodyFormData.append('form_build_id', 'form-dDDcy4VEZkPWMGR-eQP9EyW63TALj9lYEKAFiCXzJOU');
        bodyFormData.append('form_id', 'user_login_form');
        bodyFormData.append('op', 'Войти');
        return LoginAPIInstance.post(url, bodyFormData);
    },

    /**
     * 
     * @returns {Promise<AxiosResponse<any>>}
     */
    getToken() {
        const url = API_LINK + '/session/token';
        return LoginAPIInstance.get(url);
    },

    /**
     * 
     * @returns {Promise<AxiosResponse<any>>}
     */
    getUserUID() {
        const url = API_LINK + '/jsonapi';
        return LoginAPIInstance.get(url);
    },

    /**
     * 
     * @returns {Promise<AxiosResponse<any>>}
     */
    logout() {
        const url = API_LINK + '/user/logout';
        return LoginAPIInstance.get(url);
    }
}
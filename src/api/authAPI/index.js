import { LoginAPIInstance, DefaultAPIInstance } from "@/api";

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
    logout() {
        const url = 'http://localhost/drupal/web/user/logout';
        return DefaultAPIInstance.get(url);
    }
}
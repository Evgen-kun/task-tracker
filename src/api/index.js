import axios from "axios";

const loginConfig = {
    baseURL: process.env.VUE_APP_BASE_URL,
    Headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

export const LoginAPIInstance = axios.create(loginConfig);

const defaultConfig = {
    baseURL: process.env.VUE_APP_BASE_URL,
    Headers: {
        'Content-Type': 'text/html'
    }
}

export const DefaultAPIInstance = axios.create(defaultConfig);
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
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

export const DefaultAPIInstance = axios.create(defaultConfig);

const queryConfig = {
    baseURL: process.env.VUE_APP_BASE_URL,
    Headers: {
        'Content-Type': 'application/json'
    }
}

export const QueryAPIInstance = axios.create(queryConfig);

const postQueryConfig = {
    baseURL: process.env.VUE_APP_BASE_URL,
    Headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
    }
}

export const PostQueryAPIInstance = axios.create(postQueryConfig);
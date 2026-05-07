import axios from "./axios.customer";
const apiRegister = (data) => {
    const URL_BACKEND = "/api/register";
    return axios.post(URL_BACKEND, data);
}
const apiLogin = (data) => {
    const URL_BACKEND = "/api/login";
    return axios.post(URL_BACKEND, data);
}

const getAccountAPI = () => {
    const URL_BACKEND = "/api/user";
    return axios.get(URL_BACKEND);
}

export { apiLogin, apiRegister, getAccountAPI };


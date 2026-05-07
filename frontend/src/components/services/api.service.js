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

const apiGetMetaData = () => {
    const URL_BACKEND = "/api/get-meta-data";
    return axios.get(URL_BACKEND);
}

const apiCreateCourse = (data) => {
    const URL_BACKEND = "/api/courses";
    return axios.post(URL_BACKEND, data);
}

const apiGetCourse = (id) => {
    const URL_BACKEND = "/api/courses/show/" + id;
    return axios.get(URL_BACKEND);
}
const apiUpdateCourse = (id, data) => {
    const URL_BACKEND = "/api/courses/update/" + id;
    return axios.put(URL_BACKEND, data);
}

const apiCreateOutcome = (data) => {
    const URL_BACKEND = "/api/outcome/create";
    return axios.post(URL_BACKEND, data);
}
const apiGetOutcomeOfCourse = (id) => {
    const URL_BACKEND = "/api/outcomes/?course_id=" + id;
    return axios.get(URL_BACKEND);
}

export { apiCreateCourse, apiCreateOutcome, apiGetCourse, apiGetMetaData, apiGetOutcomeOfCourse, apiLogin, apiRegister, apiUpdateCourse, getAccountAPI };


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
const apiUploadImage = (id, data, signal) => {
    let config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        signal: signal
    }
    const URL_BACKEND = "/api/courses/upload-image/" + id;
    return axios.post(URL_BACKEND, data, config);
}
const apiChangeStatusCourse = (id, data) => {
    const URL_BACKEND = "/api/courses/update-status/" + id;
    return axios.patch(URL_BACKEND, data);
}

// outcome
const apiCreateOutcome = (data) => {
    const URL_BACKEND = "/api/outcome/create";
    return axios.post(URL_BACKEND, data);
}
const apiGetOutcomeOfCourse = (id) => {
    const URL_BACKEND = "/api/outcomes/?course_id=" + id;
    return axios.get(URL_BACKEND);
}
const apiUpdateOutcomeOfCourse = (data, id) => {
    const URL_BACKEND = "/api/outcome/update/" + id;
    return axios.put(URL_BACKEND, data);
}
const apiDeleteOutcome = (id) => {
    const URL_BACKEND = "/api/outcome/delete/" + id;
    return axios.delete(URL_BACKEND);
}
const apiUpdateSortOrderOutcome = (data) => {
    const URL_BACKEND = "/api/outcome/update/sort-order";
    return axios.patch(URL_BACKEND, data);
}

// requirements
const apiCreateRequirement = (data) => {
    const URL_BACKEND = "/api/requirement/create";
    return axios.post(URL_BACKEND, data);
}
const apiGetRequirementOfCourse = (id) => {
    const URL_BACKEND = "/api/requirements/?course_id=" + id;
    return axios.get(URL_BACKEND);
}
const apiUpdateRequirementOfCourse = (data, id) => {
    const URL_BACKEND = "/api/requirement/update/" + id;
    return axios.put(URL_BACKEND, data);
}
const apiDeleteRequirement = (id) => {
    const URL_BACKEND = "/api/requirement/delete/" + id;
    return axios.delete(URL_BACKEND);
}
const apiUpdateSortOrderRequirement = (data) => {
    const URL_BACKEND = "/api/requirement/update/sort-order";
    return axios.patch(URL_BACKEND, data);
}

// chapter
const apiCreateChapter = (data) => {
    const URL_BACKEND = "/api/chapter/create";
    return axios.post(URL_BACKEND, data);
}
const apiGetChapterOfCourse = (id) => {
    const URL_BACKEND = "/api/chapters/?course_id=" + id;
    return axios.get(URL_BACKEND);
}
const apiUpdateChapterOfCourse = (data, id) => {
    const URL_BACKEND = "/api/chapter/update/" + id;
    return axios.put(URL_BACKEND, data);
}
const apiDeleteChapter = (id) => {
    const URL_BACKEND = "/api/chapter/delete/" + id;
    return axios.delete(URL_BACKEND);
}
const apiUpdateSortOrderChapter = (data) => {
    const URL_BACKEND = "/api/chapter/update/sort-order";
    return axios.patch(URL_BACKEND, data);
}

// lesson
const apiGetLesson = (id) => {
    const URL_BACKEND = "/api/lessons/show/" + id;
    return axios.get(URL_BACKEND);
}
const apiCreateLesson = (data) => {
    const URL_BACKEND = "/api/lesson/create";
    return axios.post(URL_BACKEND, data);
}
const apiGetLessonOfCourse = (id) => {
    const URL_BACKEND = "/api/lessons/?course_id=" + id;
    return axios.get(URL_BACKEND);
}
const apiUpdateLessonOfCourse = (data, id) => {
    const URL_BACKEND = "/api/lesson/update/" + id;
    return axios.put(URL_BACKEND, data);
}
const apiDeleteLesson = (id) => {
    const URL_BACKEND = "/api/lesson/delete/" + id;
    return axios.delete(URL_BACKEND);
}
const apiUpdateSortOrderLesson = (data) => {
    const URL_BACKEND = "/api/lesson/update/sort-order";
    return axios.patch(URL_BACKEND, data);
}
const apiUploadVideo = (id, data, signal) => {
    let config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        signal: signal
    }
    const URL_BACKEND = "/api/lesson/upload-video/" + id;
    return axios.post(URL_BACKEND, data, config);
}

export { apiChangeStatusCourse, apiCreateChapter, apiCreateCourse, apiCreateLesson, apiCreateOutcome, apiCreateRequirement, apiDeleteChapter, apiDeleteLesson, apiDeleteOutcome, apiDeleteRequirement, apiGetChapterOfCourse, apiGetCourse, apiGetLesson, apiGetLessonOfCourse, apiGetMetaData, apiGetOutcomeOfCourse, apiGetRequirementOfCourse, apiLogin, apiRegister, apiUpdateChapterOfCourse, apiUpdateCourse, apiUpdateLessonOfCourse, apiUpdateOutcomeOfCourse, apiUpdateRequirementOfCourse, apiUpdateSortOrderChapter, apiUpdateSortOrderLesson, apiUpdateSortOrderOutcome, apiUpdateSortOrderRequirement, apiUploadImage, apiUploadVideo, getAccountAPI };


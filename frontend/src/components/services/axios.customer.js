import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

instance.interceptors.request.use(function (config) {
    // 1. Lấy chuỗi userInfo từ localStorage an toàn
    const userInfoString = typeof window !== "undefined" ? window.localStorage.getItem('userInfo') : null;

    // 2. Kiểm tra nếu có tồn tại thì mới parse
    if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        // 3. Kiểm tra xem có token không rồi mới gắn vào header
        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }

    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(
    function (response) {
        return response.data;

    },
    function (error) {
        if (error.response && error.response.data) return error.response.data;
        return Promise.reject(error);
    },
);

export default instance
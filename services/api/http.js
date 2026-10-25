import axios from "axios";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    timeout: 20000,
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("alliance_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("alliance_token");
        }

        return Promise.reject(error);
    }
);

export default http;
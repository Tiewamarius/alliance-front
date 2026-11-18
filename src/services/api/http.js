import axios from "axios";

export const TOKEN_KEY = "alliance_token";
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    timeout: 20000,
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        // Un 401 alors qu'un token existait : session expirée ou révoquée.
        // AuthContext écoute cet événement pour déconnecter l'interface.
        if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
            localStorage.removeItem(TOKEN_KEY);
            window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
        }

        return Promise.reject(error);
    }
);

export default http;
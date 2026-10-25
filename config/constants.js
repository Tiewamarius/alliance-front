export const APP_NAME = "Alliance Transit";

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000/api/v1";

export const STORAGE_KEYS = {
    TOKEN: "alliance_token",
};

export const ROUTES = {
    HOME: "/",
    LOGIN: "/connexion",
    REGISTER: "/inscription",
    CLIENT: "/mon-compte",
    ADMIN: "/admin",
    AGENCY: "/agence",
    DELIVERY: "/livraison",
    LOGISTICS: "/logistique",
};
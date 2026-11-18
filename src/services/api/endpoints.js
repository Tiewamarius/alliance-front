// Chemins de l'API, relatifs à VITE_API_BASE_URL (ex. http://127.0.0.1:8000/api/v1).
// Ressources REST : une chaîne (le service ajoute /{id} lui-même).
// Routes spécifiques : un objet.

export const ENDPOINTS = {
    auth: {
        login: "/login",
        register: "/register",
        me: "/my",
        updateProfile: "/my",
        logout: "/logout",
    },

    admin: {
        dashboard: "/admin/dashboard",
    },

    clients: "/clients",
    expeditions: "/expeditions",
    livraisons: "/livraisons",
    factures: "/factures",
    devis: "/devis",
    users: "/users",
};

export default ENDPOINTS;

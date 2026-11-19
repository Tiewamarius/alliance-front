// Chemins de l'API, relatifs à VITE_API_BASE_URL (ex. http://127.0.0.1:8000/api/v1).
// Ressources REST : une chaîne (le service ajoute /{id} lui-même).
// Routes spécifiques ou groupées : un objet.
// Source : routes/api.php (Laravel).

export const ENDPOINTS = {
    auth: {
        login: "/login",
        register: "/register",
        me: "/my",
        updateProfile: "/my",
        logout: "/logout",
    },

    // Réservé aux rôles super_admin et admin (préfixe /admin côté Laravel).
    admin: {
        dashboard: "/admin/dashboard",
        conteneurs: "/admin/conteneurs",
        expeditionStatuts: "/admin/expedition-statuts",
    },

    clients: "/clients",
    devis: "/devis",
    expeditions: "/expeditions",
    colis: "/colis",
    livraisons: "/livraisons",
    paiements: "/paiements",
    factures: "/factures",

    // Lecture ouverte aux utilisateurs connectés ; écriture sous /admin/conteneurs.
    conteneurs: "/conteneurs",

    notifications: "/notifications",

    // Référentiels : lecture seule pour les formulaires.
    referentiels: {
        pays: "/pays",
        villes: "/villes",
        communes: "/communes",
        zones: "/zones",
        agences: "/agences",
        services: "/services",
        devises: "/devises",
        typesColis: "/types-colis",
        expeditionStatuts: "/expedition-statuts",
        adresses: "/adresses",
    },

    // Route à créer côté Laravel : aucun UserController pour l'instant.
    users: "/users",
};

export default ENDPOINTS;
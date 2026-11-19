// Source unique pour les rôles : priorité et page d'accueil de chacun.
// Les slugs doivent correspondre à ceux créés par RoleSeeder côté Laravel.

// Si un utilisateur a plusieurs rôles, le premier de cette liste l'emporte.
export const ROLE_PRIORITY = [
    "super_admin",
    "admin",
    "responsable_agence",
    "responsable_transport",
    "agent_exploitation",
    "agent_service_client",
    "agent_commercial",
    "comptable",
    "livreur",
    "auditeur",
    "client",
];

// Page d'accueil de chaque rôle : uniquement des espaces qui existent dans
// src/app/router.jsx (/admin, /agence, /logistique, /livraison, /mon-compte).
export const ROLE_HOME = {
    super_admin: "/admin",
    admin: "/admin",
    responsable_agence: "/agence",
    responsable_transport: "/logistique",
    agent_exploitation: "/logistique",
    livreur: "/livraison",
    client: "/mon-compte",
    // Pas encore d'espace dédié dans le router : agent_service_client,
    // agent_commercial, comptable, auditeur. Ils arrivent sur DEFAULT_HOME
    // en attendant de créer leur espace (voir getHomePath).
};

// Rôle sans espace dédié (ou utilisateur sans rôle) : accueil public.
export const DEFAULT_HOME = "/";

// L'API peut renvoyer des chaînes ("admin") ou des objets ({ slug: "admin" }).
export function toRoleSlugs(roles) {
    return (roles ?? [])
        .map((role) =>
            typeof role === "string" ? role : role?.slug ?? role?.name
        )
        .filter(Boolean);
}

export function getPrimaryRole(roles) {
    const slugs = toRoleSlugs(roles);

    return ROLE_PRIORITY.find((role) => slugs.includes(role)) ?? null;
}

export function getHomePath(roles) {
    return ROLE_HOME[getPrimaryRole(roles)] ?? DEFAULT_HOME;
}
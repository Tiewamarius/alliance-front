// Message lisible à partir d'une erreur axios.
// Priorité : première erreur de validation Laravel (422), puis message de l'API,
// puis cas particuliers (403, 404, serveur injoignable).
export function getApiErrorMessage(error, fallback = "Une erreur est survenue.") {
    const response = error?.response;

    if (!response) {
        return error?.request
            ? "Impossible de joindre le serveur. Vérifiez votre connexion."
            : error?.message || fallback;
    }

    const validationErrors = response.data?.errors;

    if (validationErrors) {
        const first = Object.values(validationErrors).flat()[0];

        if (first) return first;
    }

    if (response.data?.message) return response.data.message;
    if (response.status === 403) return "Vous n'avez pas accès à cette ressource.";
    if (response.status === 404) return "Ressource introuvable.";

    return fallback;
}
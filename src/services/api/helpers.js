import http from "./http";

// Laravel renvoie le contenu tel quel ou dans une clé "data".
export function unwrap(body) {
    return body?.data ?? body;
}

const ALL_METHODS = ["getAll", "getById", "create", "update", "delete"];

/**
 * Fabrique un service REST pour une ressource Laravel.
 *
 * @param {string} basePath  chemin de la ressource, ex. ENDPOINTS.clients
 * @param {{ methods?: string[] }} options  méthodes exposées (toutes par défaut).
 *        Ne lister que celles que l'API supporte réellement pour cette ressource.
 *
 * Chaque méthode accepte une config axios en dernier argument, ce qui permet
 * d'annuler une requête (utile dans un useEffect, surtout en StrictMode) :
 *
 *   const controller = new AbortController();
 *   clientService.getAll({ page: 1 }, { signal: controller.signal });
 *   // cleanup : controller.abort();
 */
export function createCrudService(basePath, { methods = ALL_METHODS } = {}) {
    const handlers = {
        async getAll(params = {}, config = {}) {
            const response = await http.get(basePath, { ...config, params });
            return unwrap(response.data);
        },

        async getById(id, config = {}) {
            const response = await http.get(`${basePath}/${id}`, config);
            return unwrap(response.data);
        },

        async create(payload, config = {}) {
            const response = await http.post(basePath, payload, config);
            return unwrap(response.data);
        },

        async update(id, payload, config = {}) {
            const response = await http.put(`${basePath}/${id}`, payload, config);
            return unwrap(response.data);
        },

        async delete(id, config = {}) {
            const response = await http.delete(`${basePath}/${id}`, config);
            return response.data;
        },
    };

    return Object.fromEntries(
        methods.map((name) => {
            if (!handlers[name]) {
                throw new Error(`createCrudService : méthode inconnue "${name}".`);
            }

            return [name, handlers[name]];
        })
    );
}

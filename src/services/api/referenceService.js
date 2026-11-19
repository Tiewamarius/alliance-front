import ENDPOINTS from "./endpoints";
import { createCrudService } from "./helpers";

// Référentiels en lecture seule, utilisés par les formulaires (listes déroulantes).
// getAll est mis en cache : ces données changent rarement et seraient sinon
// rechargées à chaque ouverture de formulaire. Le cache ignore volontairement
// config.signal : une requête partagée ne doit pas être annulée par le premier
// composant qui se démonte (cas du StrictMode en développement).

const cache = new Map();

function readOnly(key, path) {
    const service = createCrudService(path, { methods: ["getAll", "getById"] });

    return {
        ...service,

        getAll(params = {}) {
            const cacheKey = `${key}:${JSON.stringify(params)}`;

            if (!cache.has(cacheKey)) {
                const request = service.getAll(params).catch((error) => {
                    cache.delete(cacheKey); // ne jamais garder un échec en cache
                    throw error;
                });

                cache.set(cacheKey, request);
            }

            return cache.get(cacheKey);
        },
    };
}

export function clearReferenceCache() {
    cache.clear();
}

const { referentiels } = ENDPOINTS;

export const referenceService = {
    pays: readOnly("pays", referentiels.pays),
    villes: readOnly("villes", referentiels.villes),
    communes: readOnly("communes", referentiels.communes),
    zones: readOnly("zones", referentiels.zones),
    agences: readOnly("agences", referentiels.agences),
    services: readOnly("services", referentiels.services),
    devises: readOnly("devises", referentiels.devises),
    typesColis: readOnly("typesColis", referentiels.typesColis),
    expeditionStatuts: readOnly("expeditionStatuts", referentiels.expeditionStatuts),
};

export default referenceService;
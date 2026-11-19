import http from "./http";
import ENDPOINTS from "./endpoints";
import { createCrudService, unwrap } from "./helpers";

// Lecture sur /conteneurs (filtres : search, statut, scelle, per_page),
// écriture sur /admin/conteneurs (super_admin et admin).
const read = createCrudService(ENDPOINTS.conteneurs, {
    methods: ["getAll", "getById"],
});

const write = createCrudService(ENDPOINTS.admin.conteneurs, {
    methods: ["create", "update", "delete"],
});

export const containerService = {
    ...read,
    ...write,

    // payload : { statut } (valeur parmi Conteneur::STATUTS côté Laravel)
    async updateStatut(id, payload, config = {}) {
        const response = await http.patch(
            `${ENDPOINTS.admin.conteneurs}/${id}/statut`,
            payload,
            config
        );

        return unwrap(response.data);
    },
};

export default containerService;
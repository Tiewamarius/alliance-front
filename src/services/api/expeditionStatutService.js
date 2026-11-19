import ENDPOINTS from "./endpoints";
import { createCrudService } from "./helpers";

// Lecture : tout utilisateur connecté (/expedition-statuts).
// Écriture : super_admin et admin (/admin/expedition-statuts).
const read = createCrudService(ENDPOINTS.referentiels.expeditionStatuts, {
    methods: ["getAll", "getById"],
});

const write = createCrudService(ENDPOINTS.admin.expeditionStatuts, {
    methods: ["create", "update", "delete"],
});

export const expeditionStatutService = { ...read, ...write };

export default expeditionStatutService;
import ENDPOINTS from "./endpoints";
import { createCrudService } from "./helpers";

export const quoteService = createCrudService(ENDPOINTS.devis, {
    methods: ["getAll", "getById", "create", "update"],
});

export default quoteService;

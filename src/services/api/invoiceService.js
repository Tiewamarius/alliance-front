import ENDPOINTS from "./endpoints";
import { createCrudService } from "./helpers";

export const invoiceService = createCrudService(ENDPOINTS.factures, {
    methods: ["getAll", "getById", "create"],
});

export default invoiceService;

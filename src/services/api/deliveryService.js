import ENDPOINTS from "./endpoints";
import { createCrudService } from "./helpers";

export const deliveryService = createCrudService(ENDPOINTS.livraisons, {
    methods: ["getAll", "getById", "create", "update"],
});

export default deliveryService;

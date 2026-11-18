import ENDPOINTS from "./endpoints";
import { createCrudService } from "./helpers";

// Les listes paginées de Laravel arrivent sous la forme
// { current_page, data: [...], ... } une fois la clé "data" externe retirée.
export const expeditionService = createCrudService(ENDPOINTS.expeditions);

export default expeditionService;

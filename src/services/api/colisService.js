import ENDPOINTS from "./endpoints";
import { createCrudService } from "./helpers";

// Lecture : personnel concerné et client (ses propres colis).
// Création, modification, suppression : personnel uniquement.
export const colisService = createCrudService(ENDPOINTS.colis);

export default colisService;
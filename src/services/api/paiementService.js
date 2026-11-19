import ENDPOINTS from "./endpoints";
import { createCrudService } from "./helpers";

// Lecture : comptabilité, administration et client (ses propres paiements).
// Écriture : comptabilité et administration uniquement.
export const paymentService = createCrudService(ENDPOINTS.paiements);

export default paymentService;
import ENDPOINTS from "./endpoints";
import { createCrudService } from "./helpers";

// Attention : l'API Laravel actuelle n'a pas de UserController. Cette route
// /users doit exister côté backend avant d'utiliser ce service.
export const userService = createCrudService(ENDPOINTS.users);

export default userService;

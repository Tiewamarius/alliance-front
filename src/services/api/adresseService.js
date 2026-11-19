import ENDPOINTS from "./endpoints";
import { createCrudService } from "./helpers";

// Carnet d'adresses.
// Lecture : tout utilisateur connecté (un client ne voit que ses adresses).
//   Filtres pour le personnel : personne_id, q, per_page (100 max).
// Écriture : personnel concerné et clients. create() demande personne_id au
//   personnel ; un client crée toujours pour lui-même. delete() est logique.
// Volontairement sans cache : les adresses dépendent de l'utilisateur connecté.
export const adresseService = createCrudService(ENDPOINTS.referentiels.adresses);

export default adresseService;
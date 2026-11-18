// Alias conservé pour ne pas casser les imports existants : "shipment" et
// "expedition" ciblent la même ressource /expeditions.
// À supprimer quand toutes les pages importeront expeditionService.
export { expeditionService as shipmentService } from "./expeditionService";
export { default } from "./expeditionService";

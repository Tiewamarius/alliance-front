import authService from "./authService";
import ENDPOINTS from "./endpoints";
import { createCrudService } from "./helpers";

export const clientService = {
    ...createCrudService(ENDPOINTS.clients),

    // Profil client de l'utilisateur connecté (renvoyé par /my).
    async getMyProfile(config = {}) {
        const data = await authService.my(config);

        return data?.client ?? null;
    },
};

export default clientService;

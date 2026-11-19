import http from "./http";
import ENDPOINTS from "./endpoints";
import { createCrudService } from "./helpers";

// Notifications de l'utilisateur connecté uniquement (filtrées côté Laravel).
export const notificationService = {
    ...createCrudService(ENDPOINTS.notifications, {
        methods: ["getAll", "getById"],
    }),

    async markAsRead(id, config = {}) {
        const response = await http.patch(
            `${ENDPOINTS.notifications}/${id}/lue`,
            null,
            config
        );

        return response.data; // { message }
    },
};

export default notificationService;
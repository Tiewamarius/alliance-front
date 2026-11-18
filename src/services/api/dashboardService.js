import http from "./http";
import ENDPOINTS from "./endpoints";
import { unwrap } from "./helpers";

export const dashboardService = {
    async getDashboard(params = {}, config = {}) {
        const response = await http.get(ENDPOINTS.admin.dashboard, {
            ...config,
            params,
        });

        return unwrap(response.data);
    },
};

export default dashboardService;

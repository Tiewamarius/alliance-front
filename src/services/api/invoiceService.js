import http from "./http";

export const invoiceService = {
    async getAll(params = {}) {
        const response = await http.get("/factures", { params });
        return response.data?.data ?? response.data;
    },

    async getById(id) {
        const response = await http.get(`/factures/${id}`);
        return response.data?.data ?? response.data;
    },

    async create(payload) {
        const response = await http.post("/factures", payload);
        return response.data?.data ?? response.data;
    },
};

export default invoiceService;
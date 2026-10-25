import http from "./http";

export const quoteService = {
    async getAll(params = {}) {
        const response = await http.get("/devis", { params });
        return response.data?.data ?? response.data;
    },

    async getById(id) {
        const response = await http.get(`/devis/${id}`);
        return response.data?.data ?? response.data;
    },

    async create(payload) {
        const response = await http.post("/devis", payload);
        return response.data?.data ?? response.data;
    },

    async update(id, payload) {
        const response = await http.put(`/devis/${id}`, payload);
        return response.data?.data ?? response.data;
    },
};

export default quoteService;
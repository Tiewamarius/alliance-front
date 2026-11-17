import http from "./http";

export const deliveryService = {
    async getAll(params = {}) {
        const response = await http.get("/livraisons", { params });
        return response.data?.data ?? response.data;
    },

    async getById(id) {
        const response = await http.get(`/livraisons/${id}`);
        return response.data?.data ?? response.data;
    },

    async create(payload) {
        const response = await http.post("/livraisons", payload);
        return response.data?.data ?? response.data;
    },

    async update(id, payload) {
        const response = await http.put(`/livraisons/${id}`, payload);
        return response.data?.data ?? response.data;
    },
};

export default deliveryService;
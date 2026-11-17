import http from "./http";

export const shipmentService = {
    async getAll(params = {}) {
        const response = await http.get("/expeditions", { params });
        return response.data?.data ?? response.data;
    },

    async getById(id) {
        const response = await http.get(`/expeditions/${id}`);
        return response.data?.data ?? response.data;
    },

    async create(payload) {
        const response = await http.post("/expeditions", payload);
        return response.data?.data ?? response.data;
    },

    async update(id, payload) {
        const response = await http.put(`/expeditions/${id}`, payload);
        return response.data?.data ?? response.data;
    },

    async delete(id) {
        const response = await http.delete(`/expeditions/${id}`);
        return response.data;
    },
};

export default shipmentService;
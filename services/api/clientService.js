import http from "./http";

export const clientService = {
    async getAll(params = {}) {
        const response = await http.get("/clients", { params });
        return response.data?.data ?? response.data;
    },

    async getById(id) {
        const response = await http.get(`/clients/${id}`);
        return response.data?.data ?? response.data;
    },

    async create(payload) {
        const response = await http.post("/clients", payload);
        return response.data?.data ?? response.data;
    },

    async update(id, payload) {
        const response = await http.put(`/clients/${id}`, payload);
        return response.data?.data ?? response.data;
    },

    async delete(id) {
        const response = await http.delete(`/clients/${id}`);
        return response.data;
    },

    async getMyProfile() {
        const response = await http.get("/me");
        const data = response.data?.data ?? response.data;
        return data.client ?? null;
    },
};

export default clientService;
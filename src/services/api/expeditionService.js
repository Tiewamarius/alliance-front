import http from "./http";

const expeditionService = {
  async getAll(params = {}) {
    const response = await http.get("/expeditions", {
      params,
    });

    // Laravel renvoie ici : { data: { current_page, data: [], ... } }
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
};

export default expeditionService;
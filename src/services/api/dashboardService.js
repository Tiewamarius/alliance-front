import http from "./http";

const dashboardService = {
  async getDashboard(params = {}) {
    const response = await http.get("/admin/dashboard", { params });

    // Compatible avec une réponse Laravel enveloppée dans data
    return response.data?.data ?? response.data;
  },
};

export default dashboardService;
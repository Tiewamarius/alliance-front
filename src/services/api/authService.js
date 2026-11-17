import http from "./http";

function unwrap(response) {
  return response?.data ?? response;
}

const authService = {
  async login(credentials) {
    const response = await http.post("/login", credentials);
    const data = unwrap(response.data);

    if (data.token) {
      localStorage.setItem("alliance_token", data.token);
    }

    return data;
  },

  async register(payload) {
    const response = await http.post("/register", payload);
    const data = unwrap(response.data);

    if (data.token) {
      localStorage.setItem("alliance_token", data.token);
    }

    return data;
  },

  async my() {
    const response = await http.get("/my");
    return unwrap(response.data);
  },

  async logout() {
    try {
      await http.post("/logout");
    } finally {
      localStorage.removeItem("alliance_token");
    }
  },

  async updateProfile(payload) {
    const response = await http.put("/my", payload);
    return unwrap(response.data);
  },
};

// Compatibilité avec les deux formes d'import.
export { authService };
export default authService;
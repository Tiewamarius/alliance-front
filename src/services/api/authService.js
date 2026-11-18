import http, { TOKEN_KEY } from "./http";
import ENDPOINTS from "./endpoints";
import { unwrap } from "./helpers";

function storeToken(data) {
    if (data?.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
    }
}

export const authService = {
    async login(credentials) {
        const response = await http.post(ENDPOINTS.auth.login, credentials);
        const data = unwrap(response.data);

        storeToken(data);

        return data;
    },

    async register(payload) {
        const response = await http.post(ENDPOINTS.auth.register, payload);
        const data = unwrap(response.data);

        storeToken(data);

        return data;
    },

    async my(config = {}) {
        const response = await http.get(ENDPOINTS.auth.me, config);

        return unwrap(response.data);
    },

    async logout() {
        try {
            await http.post(ENDPOINTS.auth.logout);
        } finally {
            localStorage.removeItem(TOKEN_KEY);
        }
    },

    async updateProfile(payload) {
        const response = await http.put(ENDPOINTS.auth.updateProfile, payload);

        return unwrap(response.data);
    },
};

export default authService;

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import authService from "../services/api/authService";

const AuthContext = createContext(null);

function normalizeUserResponse(response) {
    return {
        user: response?.user ?? null,
        personne: response?.personne ?? null,
        client: response?.client ?? null,
        roles: response?.roles ?? [],
    };
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [personne, setPersonne] = useState(null);
    const [client, setClient] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const applyProfile = useCallback((response) => {
        const profile = normalizeUserResponse(response);

        setUser(profile.user);
        setPersonne(profile.personne);
        setClient(profile.client);
        setRoles(profile.roles);

        return profile;
    }, []);

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem("alliance_token");

        if (!token) {
            setUser(null);
            setPersonne(null);
            setClient(null);
            setRoles([]);
            setLoading(false);
            return null;
        }

        try {
            const response = await authService.my();
            return applyProfile(response);
        } catch {
            localStorage.removeItem("alliance_token");
            setUser(null);
            setPersonne(null);
            setClient(null);
            setRoles([]);
            return null;
        } finally {
            setLoading(false);
        }
    }, [applyProfile]);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = async (credentials) => {
        const response = await authService.login(credentials);

        if (!response.token) {
            throw new Error("L'API n'a pas renvoyé de token d'authentification.");
        }

        applyProfile(response);

        // Si la réponse de connexion ne contient que le token et l'utilisateur,
        // récupérer les informations complètes depuis /me.
        if (!response.personne && !response.client) {
            await refreshUser();
        }

        return response;
    };

    const register = async (payload) => {
        const response = await authService.register(payload);

        if (response.token) {
            applyProfile(response);
        }

        return response;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
            setPersonne(null);
            setClient(null);
            setRoles([]);
        }
    };

    const value = {
        user,
        personne,
        client,
        roles,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth doit être utilisé dans AuthProvider.");
    }

    return context;
}
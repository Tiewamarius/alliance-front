import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import authService from "../services/api/authService";
import { TOKEN_KEY, UNAUTHORIZED_EVENT } from "../services/api/http";
import { getHomePath, getPrimaryRole, toRoleSlugs } from "../config/roles";

const AuthContext = createContext(null);

function normalizeUserResponse(response) {
    return {
        user: response?.user ?? null,
        personne: response?.personne ?? null,
        client: response?.client ?? null,
        roles: response?.roles ?? response?.user?.roles ?? [],
    };
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [personne, setPersonne] = useState(null);
    const [client, setClient] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const clearProfile = useCallback(() => {
        setUser(null);
        setPersonne(null);
        setClient(null);
        setRoles([]);
    }, []);

    const applyProfile = useCallback((response) => {
        const profile = normalizeUserResponse(response);

        setUser(profile.user);
        setPersonne(profile.personne);
        setClient(profile.client);
        setRoles(profile.roles);

        return profile;
    }, []);

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
            clearProfile();
            setLoading(false);
            return null;
        }

        try {
            const response = await authService.my();
            return applyProfile(response);
        } catch {
            localStorage.removeItem(TOKEN_KEY);
            clearProfile();
            return null;
        } finally {
            setLoading(false);
        }
    }, [applyProfile, clearProfile]);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    // Session expirée ou révoquée (401 détecté par http.js).
    useEffect(() => {
        window.addEventListener(UNAUTHORIZED_EVENT, clearProfile);

        return () => window.removeEventListener(UNAUTHORIZED_EVENT, clearProfile);
    }, [clearProfile]);

    const login = useCallback(
        async (credentials) => {
            const response = await authService.login(credentials);

            if (!response?.token) {
                throw new Error("L'API n'a pas renvoyé de token d'authentification.");
            }

            let profile = normalizeUserResponse(response);

            // Réponse de connexion incomplète : charger le profil complet
            // depuis /my avant de mettre à jour l'interface (une seule fois).
            if (!profile.personne && !profile.client) {
                try {
                    profile = normalizeUserResponse(await authService.my());
                } catch (error) {
                    localStorage.removeItem(TOKEN_KEY);
                    throw error;
                }
            }

            applyProfile(profile);

            return {
                ...response,
                ...profile,
                primaryRole: getPrimaryRole(profile.roles),
                homePath: getHomePath(profile.roles),
            };
        },
        [applyProfile]
    );

    const register = useCallback(
        async (payload) => {
            const response = await authService.register(payload);

            if (response?.token) {
                applyProfile(response);
            }

            return response;
        },
        [applyProfile]
    );

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch {
            // Le token local est supprimé dans tous les cas (voir authService).
        } finally {
            clearProfile();
        }
    }, [clearProfile]);

    const roleSlugs = useMemo(() => toRoleSlugs(roles), [roles]);

    const hasRole = useCallback(
        (...wanted) => wanted.flat().some((role) => roleSlugs.includes(role)),
        [roleSlugs]
    );

    const value = useMemo(
        () => ({
            user,
            personne,
            client,
            roles,
            roleSlugs,
            primaryRole: getPrimaryRole(roleSlugs),
            homePath: getHomePath(roleSlugs),
            loading,
            isAuthenticated: Boolean(user),
            hasRole,
            login,
            register,
            logout,
            refreshUser,
        }),
        [
            user,
            personne,
            client,
            roles,
            roleSlugs,
            loading,
            hasRole,
            login,
            register,
            logout,
            refreshUser,
        ]
    );

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
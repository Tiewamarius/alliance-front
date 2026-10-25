import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireRole({ allowedRoles = [] }) {
    const {
        user,
        roles,
        loading,
        isAuthenticated,
    } = useAuth();

    const location = useLocation();

    // Attendre la vérification de la session
    if (loading) {
        return (
            <main className="simple-page">
                <p>Vérification des autorisations...</p>
            </main>
        );
    }

    // Utilisateur non connecté
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/connexion"
                replace
                state={{ from: location }}
            />
        );
    }

    // Récupérer les rôles disponibles
    const userRoles = [
        ...(Array.isArray(roles) ? roles : []),
        ...(Array.isArray(user?.roles) ? user.roles : []),
    ];

    // Normaliser les rôles en slugs
    const userRoleSlugs = [
        ...new Set(
            userRoles
                .map((role) => {
                    if (typeof role === "string") {
                        return role;
                    }

                    return role?.slug ?? "";
                })
                .filter(Boolean)
        ),
    ];

    // Vérifier si l'utilisateur possède un rôle autorisé
    const hasPermission = allowedRoles.some((role) =>
        userRoleSlugs.includes(role)
    );

    if (!hasPermission) {
        return (
            <Navigate
                to="/acces-refuse"
                replace
            />
        );
    }

    return <Outlet />;
}
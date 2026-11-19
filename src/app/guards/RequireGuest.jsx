import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Réservé aux visiteurs non connectés (connexion, inscription...).
// Un utilisateur déjà connecté est renvoyé vers l'espace de son rôle,
// jamais vers une destination fixe : sinon un admin qui vient de se connecter
// serait envoyé vers /mon-compte puis refusé par RequireRole.
export default function RequireGuest({ children }) {
    const { isAuthenticated, loading, primaryRole, homePath } = useAuth();
    const location = useLocation();

    if (loading) {
        return null;
    }

    if (isAuthenticated) {
        const requestedDestination = location.state?.from?.pathname;
        const isAdmin = ["admin", "super_admin"].includes(primaryRole);

        return (
            <Navigate
                to={isAdmin ? "/admin" : requestedDestination || homePath}
                replace
            />
        );
    }

    return children ?? <Outlet />;
}
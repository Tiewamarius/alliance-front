import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute() {
    const {
        loading,
        isAuthenticated,
    } = useAuth();

    const location = useLocation();

    // Attendre que le contexte vérifie la session
    if (loading) {
        return (
            <main className="simple-page">
                <p>Vérification de votre session...</p>
            </main>
        );
    }

    // Rediriger les visiteurs non connectés
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/connexion"
                replace
                state={{ from: location }}
            />
        );
    }

    // Autoriser l'accès aux routes enfants
    return <Outlet />;
}
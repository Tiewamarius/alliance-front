import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth() {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <main className="simple-page">
                <p>Vérification de votre session...</p>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/connexion"
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
}
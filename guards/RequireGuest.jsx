import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireGuest() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="page-loading">Chargement...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/mon-compte" replace />;
    }

    return <Outlet />;
}
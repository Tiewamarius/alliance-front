import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequirePermission({
    permission,
    roles: allowedRoles = [],
}) {
    const { isAuthenticated, loading, roles, user } = useAuth();

    if (loading) {
        return <div className="page-loading">Vérification des accès...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/connexion" replace />;
    }

    const roleNames = roles.map((role) =>
        typeof role === "string" ? role : role.name
    );

    const permissions = [
        ...(user?.permissions ?? []),
        ...roles.flatMap((role) =>
            typeof role === "object" ? role.permissions ?? [] : []
        ),
    ].map((item) => (typeof item === "string" ? item : item.name));

    const roleAllowed =
        allowedRoles.length === 0 ||
        allowedRoles.some((role) => roleNames.includes(role));

    const permissionAllowed =
        !permission || permissions.includes(permission);

    if (!roleAllowed || !permissionAllowed) {
        return <Navigate to="/acces-refuse" replace />;
    }

    return <Outlet />;
}
import { useAuth } from "../contexts/AuthContext";

export default function usePermissions() {
    const { user, roles } = useAuth();

    const roleNames = roles.map((role) =>
        typeof role === "string" ? role : role.name
    );

    const permissions = [
        ...(user?.permissions ?? []),
        ...roles.flatMap((role) =>
            typeof role === "object" ? role.permissions ?? [] : []
        ),
    ].map((permission) =>
        typeof permission === "string" ? permission : permission.name
    );

    function hasRole(role) {
        return roleNames.includes(role);
    }

    function hasPermission(permission) {
        return permissions.includes(permission);
    }

    return {
        roles: roleNames,
        permissions,
        hasRole,
        hasPermission,
        isAdmin: hasRole("admin"),
    };
}
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const menus = {
    admin: [
        { label: "Tableau de bord", to: "/admin" },
        { label: "Utilisateurs", to: "/admin/utilisateurs" },
        { label: "Rôles", to: "/admin/roles" },
        { label: "Permissions", to: "/admin/permissions" },
    ],
    agence: [
        { label: "Tableau de bord", to: "/agence" },
        { label: "Expéditions", to: "/agence/expeditions" },
        { label: "Colis", to: "/agence/colis" },
    ],
    livraison: [
        { label: "Tableau de bord", to: "/livraison" },
        { label: "Livraisons", to: "/livraison/livraisons" },
        { label: "Preuves de livraison", to: "/livraison/preuves" },
    ],
    logistique: [
        { label: "Tableau de bord", to: "/logistique" },
        { label: "Expéditions", to: "/logistique/expeditions" },
        { label: "Conteneurs", to: "/logistique/conteneurs" },
    ],
};

export default function AdminLayout({ section = "admin" }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const links = menus[section] ?? menus.admin;

    async function handleLogout() {
        await logout();
        navigate("/connexion", { replace: true });
    }

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <NavLink to={`/${section}`} className="dashboard-brand">
                    ALLIANCE TRANSIT
                </NavLink>

                <nav className="dashboard-nav">
                    {links.map((item) => (
                        <NavLink key={item.to} to={item.to} end>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <button
                    type="button"
                    className="button-logout"
                    onClick={handleLogout}
                >
                    Déconnexion
                </button>
            </aside>

            <div className="dashboard-main">
                <header className="dashboard-header">
                    <span>
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                    </span>
                    <span>{user?.name ?? user?.email ?? "Utilisateur"}</span>
                </header>

                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
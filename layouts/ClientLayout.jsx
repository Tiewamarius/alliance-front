import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ClientLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/connexion", { replace: true });
    }

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <NavLink to="/mon-compte" className="dashboard-brand">
                    ALLIANCE TRANSIT
                </NavLink>

                <nav className="dashboard-nav">
                    <NavLink to="/mon-compte">Tableau de bord</NavLink>
                    <NavLink to="/mon-compte/expeditions">Mes expéditions</NavLink>
                    <NavLink to="/mon-compte/devis">Mes devis</NavLink>
                    <NavLink to="/mon-compte/factures">Mes factures</NavLink>
                    <NavLink to="/mon-compte/paiements">Mes paiements</NavLink>
                    <NavLink to="/mon-compte/documents">Mes documents</NavLink>
                    <NavLink to="/mon-compte/profil">Mon profil</NavLink>
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
                    <span>Espace client</span>
                    <span>{user?.name ?? user?.email ?? "Mon compte"}</span>
                </header>

                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
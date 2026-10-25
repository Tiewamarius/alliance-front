import { Link, NavLink, Outlet } from "react-router-dom";

export default function PublicLayout() {
    return (
        <div className="site-layout">
            <header className="site-header">
                <Link className="site-brand" to="/">
                    ALLIANCE <span>TRANSIT</span>
                </Link>

                <nav className="site-nav" aria-label="Navigation principale">
                    <NavLink to="/">Accueil</NavLink>
                    <NavLink to="/services">Services</NavLink>
                    <NavLink to="/agences">Nos agences</NavLink>
                    <NavLink to="/suivi">Suivre un colis</NavLink>
                    <NavLink to="/a-propos">À propos</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                </nav>

                <div className="site-actions">
                    <Link className="button-outline" to="/connexion">
                        Connexion
                    </Link>
                </div>
            </header>

            <Outlet />

            <footer className="site-footer">
                <p>
                    © {new Date().getFullYear()} Alliance Transit.
                    Tous droits réservés.
                </p>
                <Link to="/contact">Nous contacter</Link>
            </footer>
        </div>
    );
}
import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="auth-layout">
            <header className="auth-header">
                <Link to="/" className="site-brand">
                    ALLIANCE <span>TRANSIT</span>
                </Link>
            </header>

            <Outlet />

            <footer className="auth-layout-footer">
                <Link to="/">Retour au site</Link>
            </footer>
        </div>
    );
}
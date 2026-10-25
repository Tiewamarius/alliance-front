
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/admin-template/components/Sidebar";
import Header from "../components/admin-template/components/Header";

export default function AdminLayout({ section = "admin" }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate("/connexion", { replace: true });
        }
    };

    return (
        <div
            className={`min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 ${
                darkMode
                    ? "dark from-slate-900 via-slate-800 to-slate-900"
                    : ""
            } transition-all duration-500`}
        >
            <div className="flex h-screen overflow-hidden">
                <Sidebar
                    section={section}
                    user={user}
                    onLogout={handleLogout}
                    mobileOpen={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                />

                <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    <Header
                        section={section}
                        user={user}
                        onMenuToggle={() => setMobileOpen((value) => !value)}
                        darkMode={darkMode}
                        onToggleDarkMode={() => setDarkMode((value) => !value)}
                    />

                    <main className="min-h-0 flex-1 overflow-y-auto p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}

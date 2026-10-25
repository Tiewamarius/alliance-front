
import React from "react";
import {
    Menu,
    Search,
    Filter,
    Plus,
    Bell,
    Sun,
    Moon,
    Settings,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const pageTitles = {
    "/admin": "Dashboard",
    "/admin/clients": "Clients",
    "/admin/roles": "Rôles",
    "/admin/permissions": "Permissions",
    "/agence": "Dashboard",
    "/agence/expeditions": "Expéditions",
    "/agence/colis": "Colis",
    "/livraison": "Dashboard",
    "/livraison/livraisons": "Livraisons",
    "/livraison/preuves": "Preuves de livraison",
    "/logistique": "Dashboard",
    "/logistique/expeditions": "Expéditions",
    "/logistique/conteneurs": "Conteneurs",
};

function getUserName(user) {
    return (
        user?.name ??
        user?.nom_complet ??
        user?.nom ??
        user?.prenom ??
        user?.email ??
        "Utilisateur"
    );
}

function getUserRole(user, section) {
    const roles = user?.roles;

    if (Array.isArray(roles) && roles.length > 0) {
        return roles
            .map((role) =>
                typeof role === "string"
                    ? role
                    : role?.name ?? role?.nom
            )
            .filter(Boolean)
            .join(", ");
    }

    if (typeof user?.role === "string") return user.role;
    if (user?.role?.name) return user.role.name;
    if (user?.role?.nom) return user.role.nom;

    return section
        ? section.charAt(0).toUpperCase() + section.slice(1)
        : "Utilisateur";
}

export default function Header({
    section = "admin",
    user,
    onMenuToggle,
    darkMode = false,
    onToggleDarkMode,
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const pageTitle =
        pageTitles[location.pathname] ??
        location.pathname.split("/").filter(Boolean).pop() ??
        "Dashboard";

    const displayTitle =
        pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

    const name = getUserName(user);
    const role = getUserRole(user, section);

    const avatar =
        user?.photo_url ??
        user?.avatar_url ??
        user?.avatar ??
        user?.photo ??
        null;

    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");

    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={onMenuToggle}
                        aria-label="Ouvrir le menu"
                        className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="hidden md:block">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white">
                            {displayTitle}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Content de vous revoir, {name} !
                        </p>
                    </div>
                </div>

                {/* Center */}
                <div className="flex-1 max-w-md mx-8">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            placeholder="chercher"
                            aria-label="Rechercher"
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />

                        <button
                            type="button"
                            aria-label="Filtres de recherche"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center space-x-3">
                    {/* Quick Action */}
                    <button
                        type="button"
                        onClick={() => {
                            const createRoutes = {
                                admin: "/admin/utilisateurs",
                                agence: "/agence/expeditions",
                                livraison: "/livraison/livraisons",
                                logistique: "/logistique/expeditions",
                            };

                            navigate(createRoutes[section] ?? "/admin");
                        }}
                        className="hidden lg:flex items-center space-x-2 py-2 px-4 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">CRÉER</span>
                    </button>

                    {/* Toggle */}
                    <button
                        type="button"
                        onClick={onToggleDarkMode}
                        aria-label="Changer le thème"
                        className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        {darkMode ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>

                    {/* Notifications : pas de compteur fictif */}
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                    </button>

                    {/* Settings */}
                    <button
                        type="button"
                        onClick={() => navigate(`/${section}/parametres`)}
                        aria-label="Paramètres"
                        className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-700">
                        <div className="relative">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt={`Photo de ${name}`}
                                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-purple-500/20"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold ring-2 ring-purple-500/20">
                                    {initials || "U"}
                                </div>
                            )}

                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                        </div>

                        <div className="hidden md:block text-left">
                            <div className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">
                                {name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                {role}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

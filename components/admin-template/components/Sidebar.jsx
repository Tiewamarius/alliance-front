
import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    Zap,
    LayoutDashboard,
    BarChart3,
    Truck,
    Package,
    Users,
    FileText,
    Settings,
    ChevronDown,
    ChevronRight,
    Menu,
    X,
    Bell,
    HelpCircle,
    LogOut,
    UserRound,
    CreditCard,
    Activity,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

const menuItems = [
    {
        id: "dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/admin",
    },
    {
        id: "analytics",
        icon: BarChart3,
        label: "Analytics",
        submenu: [
            { id: "overview", label: "Vue générale", path: "/admin/analytics" },
            { id: "reports", label: "Rapports", path: "/admin/analytics/rapports" },
            { id: "insights", label: "Statistiques", path: "/admin/analytics/statistiques" },
        ],
    },
    {
        id: "expeditions",
        icon: Truck,
        label: "Expeditions",
        badge: "12",
        submenu: [
            { id: "all-expeditions", label: "Tous", path: "/admin/expeditions" },
            { id: "pending-orders", label: "En attente", path: "/admin/expeditions/en-attente" },
            { id: "completed-orders", label: "Terminées", path: "/admin/expeditions/terminees" },
        ],
    },
    {
        id: "colis",
        icon: Package,
        label: "Colis",
        submenu: [
            { id: "all-colis", label: "Tous les colis", path: "/admin/colis" },
            { id: "categories", label: "Catégories", path: "/admin/colis/categories" },
            { id: "inventory", label: "Inventaire", path: "/admin/colis/inventaire" },
        ],
    },
    {
        id: "customers",
        icon: Users,
        label: "Clients",
        badge: "New",
        path: "/admin/clients",
    },
    {
        id: "payments",
        icon: CreditCard,
        label: "Paiements",
        path: "/admin/paiements",
    },
    {
        id: "reports",
        icon: FileText,
        label: "Rapports",
        path: "/admin/rapports",
    },
];

const bottomItems = [
    {
        id: "notifications",
        icon: Bell,
        label: "Notifications",
        badge: "3",
        path: "/admin/notifications",
    },
    {
        id: "help",
        icon: HelpCircle,
        label: "Centre d'aide",
        path: "/admin/aide",
    },
    {
        id: "settings",
        icon: Settings,
        label: "Paramètres",
        submenu: [
            { id: "profile", label: "Mon profil", path: "/admin/parametres/profil" },
            { id: "team", label: "Equipes", path: "/admin/parametres/equipes" },
            { id: "security", label: "Sécurité", path: "/admin/parametres/securite" },
        ],
    },
];

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

function getUserRole(user) {
    if (Array.isArray(user?.roles) && user.roles.length) {
        return user.roles
            .map((role) =>
                typeof role === "string" ? role : role?.name ?? role?.nom
            )
            .filter(Boolean)
            .join(", ");
    }

    if (typeof user?.role === "string") return user.role;
    if (user?.role?.name) return user.role.name;
    if (user?.role?.nom) return user.role.nom;

    return "Utilisateur";
}

export default function Sidebar({ onLogout }) {
    const [openMenus, setOpenMenus] = useState(["analytics"]);
    const [mobileOpen, setMobileOpen] = useState(false);

    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const userName = getUserName(user);
    const userRole = getUserRole(user);

    const initials = userName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

    const toggleMenu = (id) => {
        setOpenMenus((previous) =>
            previous.includes(id)
                ? previous.filter((menuId) => menuId !== id)
                : [...previous, id]
        );
    };

    const goTo = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    const isPathActive = (path) => {
        if (!path) return false;
        if (path === "/admin") return location.pathname === "/admin";

        return (
            location.pathname === path ||
            location.pathname.startsWith(`${path}/`)
        );
    };

    const isActive = (item) =>
        isPathActive(item.path) ||
        item.submenu?.some((subitem) => isPathActive(subitem.path)) ||
        false;

    const renderMenuItem = (item) => {
        const Icon = item.icon;
        const active = isActive(item);
        const hasSubmenu = Boolean(item.submenu?.length);
        const expanded = openMenus.includes(item.id) || active;

        return (
            <div key={item.id} className="space-y-1">
                <button
                    type="button"
                    onClick={() =>
                        hasSubmenu
                            ? toggleMenu(item.id)
                            : goTo(item.path)
                    }
                    aria-expanded={hasSubmenu ? expanded : undefined}
                    aria-current={
                        active && !hasSubmenu ? "page" : undefined
                    }
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                        active
                            ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                >
                    <Icon
                        className={`h-5 w-5 shrink-0 ${
                            active
                                ? "text-white"
                                : "text-slate-500 group-hover:text-blue-600 dark:text-slate-400"
                        }`}
                    />

                    <span className="flex-1 text-left">{item.label}</span>

                    {item.badge && (
                        <span
                            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                                active
                                    ? "bg-white/20 text-white"
                                    : item.badge === "New"
                                    ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                                    : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                            }`}
                        >
                            {item.badge}
                        </span>
                    )}

                    {hasSubmenu &&
                        (expanded ? (
                            <ChevronDown className="h-4 w-4 shrink-0" />
                        ) : (
                            <ChevronRight className="h-4 w-4 shrink-0" />
                        ))}
                </button>

                {hasSubmenu && expanded && (
                    <div className="ml-5 space-y-1 border-l border-slate-200 pl-4 dark:border-slate-700">
                        {item.submenu.map((subitem) => {
                            const subActive = isPathActive(subitem.path);

                            return (
                                <button
                                    key={subitem.id}
                                    type="button"
                                    onClick={() => goTo(subitem.path)}
                                    aria-current={subActive ? "page" : undefined}
                                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                        subActive
                                            ? "bg-blue-50 font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                    }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                            subActive
                                                ? "bg-blue-600 dark:bg-blue-400"
                                                : "bg-slate-300 dark:bg-slate-600"
                                        }`}
                                    />
                                    {subitem.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Bouton mobile */}
            <button type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={mobileOpen}
                className="fixed left-4 top-4 z-50 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-white lg:hidden"
            >
                {mobileOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <Menu className="h-5 w-5" />
                )}
            </button>

            {/* Fond mobile */}
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Fermer le menu"
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200/70 bg-white/95 backdrop-blur-xl transition-transform duration-300 dark:border-slate-700/50 dark:bg-slate-900/95 lg:sticky lg:top-0 lg:z-20 lg:translate-x-0 ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Logo */}
                <div className="border-b border-slate-200/70 p-6 dark:border-slate-700/50">
                    <button
                        type="button"
                        onClick={() => goTo("/admin")}
                        className="flex w-full items-center gap-3 text-left"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20">
                            <Zap className="h-6 w-6 text-white" />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                                ALLIANCE TRANSIT
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Panneau d'administration
                            </p>
                        </div>
                    </button>
                </div>

                {/* Navigation */}
                <nav
                    aria-label="Navigation principale"
                    className="flex-1 space-y-1 overflow-y-auto p-4"
                >
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Menu principal
                    </p>

                    {menuItems.map(renderMenuItem)}

                    <div className="my-5 border-t border-slate-200/70 dark:border-slate-700/50" />

                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Préférences
                    </p>

                    {bottomItems.map(renderMenuItem)}
                </nav>

                {/* Carte d'aide */}
                <div className="px-4 pb-3">
                    <div className="rounded-xl border border-blue-100 bg-linear-to-br from-blue-50 to-purple-50 p-3 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800/50">
                        <div className="mb-2 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <p className="text-xs font-semibold text-slate-800 dark:text-white">
                                Besoin d'aide ?
                            </p>
                        </div>

                        <p className="mb-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            Consultez notre centre d'aide pour utiliser votre espace.
                        </p>

                        <button
                            type="button"
                            onClick={() => goTo("/admin/aide")}
                            className="w-full rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 dark:bg-slate-700 dark:text-blue-300 dark:hover:bg-slate-600"
                        >
                            Consulter l'aide
                        </button>
                    </div>
                </div>

                {/* Profil */}
                <div className="border-t border-slate-200/70 p-4 dark:border-slate-700/50">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-sm font-bold text-white ring-2 ring-blue-500/30">
                            {initials || "U"}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                                {userName}
                            </p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                {userRole}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => goTo("/admin/parametres/profil")}
                            title="Mon profil"
                            aria-label="Mon profil"
                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                            <UserRound className="h-4 w-4" />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={onLogout}
                        className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    >
                        <LogOut className="h-5 w-5" />
                        Déconnexion
                    </button>
                </div>
            </aside>
        </>
    );
}

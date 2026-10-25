import { Navigate, Route, Routes } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import ClientLayout from "../layouts/ClientLayout";
import AdminLayout from "../layouts/AdminLayout";

import RequireAuth from "../guards/RequireAuth";
import RequireGuest from "../guards/RequireGuest";
import RequireRole from "../guards/RequireRole";

import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import HomePage from "../pages/public/HomePage";
import AboutPage from "../pages/public/AboutPage";
import ServicesPage from "../pages/public/ServicesPage";
import AgenciesPage from "../pages/public/AgenciesPage";
import ContactPage from "../pages/public/ContactPage";
import TrackingPage from "../pages/public/TrackingPage";

import ClientDashboardPage from "../pages/client/DashboardPage";
import ClientShipmentsPage from "../pages/client/ShipmentsPage";
import ClientQuotesPage from "../pages/client/QuotesPage";
import ClientInvoicesPage from "../pages/client/InvoicesPage";
import ClientPaymentsPage from "../pages/client/PaymentsPage";
import ClientDocumentsPage from "../pages/client/DocumentsPage";
import ClientProfilePage from "../pages/client/ProfilePage";

import AdminDashboardPage from "../pages/admin/DashboardPage";
import AdminUsersPage from "../pages/admin/UsersPage";
import AdminRolesPage from "../pages/admin/RolesPage";
import AdminTeamsPage from "../pages/admin/AdminTeamsPage";
import AdminPermissionsPage from "../pages/admin/PermissionsPage";

import AgencyDashboardPage from "../pages/agency/DashboardPage";
import AgencyShipmentsPage from "../pages/agency/ShipmentsPage";
import AgencyPackagesPage from "../pages/agency/PackagesPage";

import DeliveryDashboardPage from "../pages/delivery/DashboardPage";
import DeliveriesPage from "../pages/delivery/DeliveriesPage";
import ProofsPage from "../pages/delivery/ProofsPage";

import LogisticsDashboardPage from "../pages/logistics/DashboardPage";
import LogisticsShipmentsPage from "../pages/logistics/ShipmentsPage";
import ContainersPage from "../pages/logistics/ContainersPage";

function AccessDeniedPage() {
    return (
        <main className="simple-page">
            <h1>Accès refusé</h1>
            <p>Vous ne disposez pas des autorisations nécessaires.</p>
        </main>
    );
}

function NotFoundPage() {
    return (
        <main className="simple-page">
            <h1>Page introuvable</h1>
            <p>La page demandée n’existe pas ou a été déplacée.</p>
            <a href="/">Retour à l’accueil</a>
        </main>
    );
}

export default function AppRouter() {
    return (
        <Routes>
            {/* Site public */}
            <Route element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="a-propos" element={<AboutPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="agences" element={<AgenciesPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="suivi" element={<TrackingPage />} />
            </Route>

            {/* Pages d'authentification */}
            <Route element={<RequireGuest />}>
                <Route element={<AuthLayout />}>
                    <Route path="connexion" element={<LoginPage />} />
                    <Route
                        path="mot-de-passe-oublie"
                        element={<ForgotPasswordPage />}
                    />
                    <Route
                        path="reinitialiser-mot-de-passe/:token"
                        element={<ResetPasswordPage />}
                    />
                </Route>
            </Route>

            {/* Espace client */}
            {/* Tous les espaces privés nécessitent une connexion */}
            <Route element={<RequireAuth />}>

                {/* ESPACE CLIENT */}
                <Route element={<RequireRole allowedRoles={["client"]} />}>
                    <Route path="mon-compte" element={<ClientLayout />}>
                        <Route index element={<ClientDashboardPage />} />
                        <Route path="expeditions" element={<ClientShipmentsPage />} />
                        <Route path="devis" element={<ClientQuotesPage />} />
                        <Route path="factures" element={<ClientInvoicesPage />} />
                        <Route path="paiements" element={<ClientPaymentsPage />} />
                        <Route path="documents" element={<ClientDocumentsPage />} />
                        <Route path="profil" element={<ClientProfilePage />} />
                    </Route>
                </Route>

                {/* ADMINISTRATION */}
                <Route
                    element={
                        <RequireRole
                            allowedRoles={["super_admin", "admin"]}
                        />
                    }
                >
                    <Route path="admin" element={<AdminLayout section="admin" />}>
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="clients" element={<AdminUsersPage />} />
                        <Route path="roles" element={<AdminRolesPage />} />
                        <Route path="equipes" element={<AdminTeamsPage />} />
                        <Route path="permissions" element={<AdminPermissionsPage />} />
                    </Route>
                </Route>

                {/* AGENCE */}
                <Route
                    element={
                        <RequireRole
                            allowedRoles={[
                                "super_admin",
                                "admin",
                                "responsable_agence",
                            ]}
                        />
                    }
                >
                    <Route path="agence" element={<AdminLayout section="agence" />}>
                        <Route index element={<AgencyDashboardPage />} />
                        <Route path="expeditions" element={<AgencyShipmentsPage />} />
                        <Route path="colis" element={<AgencyPackagesPage />} />
                    </Route>
                </Route>

                {/* LIVRAISON */}
                <Route
                    element={
                        <RequireRole
                            allowedRoles={[
                                "super_admin",
                                "admin",
                                "responsable_transport",
                                "livreur",
                            ]}
                        />
                    }
                >
                    <Route path="livraison" element={<AdminLayout section="livraison" />}>
                        <Route index element={<DeliveryDashboardPage />} />
                        <Route path="livraisons" element={<DeliveriesPage />} />
                        <Route path="preuves" element={<ProofsPage />} />
                    </Route>
                </Route>

                {/* LOGISTIQUE */}
                <Route
                    element={
                        <RequireRole
                            allowedRoles={[
                                "super_admin",
                                "admin",
                                "agent_exploitation",
                                "responsable_transport",
                            ]}
                        />
                    }
                >
                    <Route path="logistique" element={<AdminLayout section="logistique" />}>
                        <Route index element={<LogisticsDashboardPage />} />
                        <Route path="expeditions" element={<LogisticsShipmentsPage />} />
                        <Route path="conteneurs" element={<ContainersPage />} />
                    </Route>
                </Route>

            </Route>

            <Route path="acces-refuse" element={<AccessDeniedPage />} />
            <Route path="*" element={<NotFoundPage />} />

            <Route path="acces-refuse" element={<AccessDeniedPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
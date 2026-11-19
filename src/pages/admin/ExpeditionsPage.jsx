import { useMemo, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Eye,
    LayoutGrid,
    List,
    LoaderCircle,
    Package,
    Plus,
    RefreshCw,
    Search,
    Truck,
    X,
} from "lucide-react";

import expeditionService from "../../services/api/expeditionService";
import dashboardService from "../../services/api/dashboardService";
import useFetch from "../../hooks/useFetch";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import useExpeditionCatalogs from "../../features/expeditions/hooks/useExpeditionCatalogs";
import ExpeditionFormModal from "../../features/expeditions/components/ExpeditionFormModal";
import ExpeditionDetailsModal from "../../features/expeditions/components/ExpeditionDetailsModal";
import { buttonPrimary, buttonSecondary, inputClass } from "../../components/ui/formClasses";
import { getApiErrorMessage } from "../../utils/apiError";
import {
    formatDate,
    formatMoney,
    getClientName,
    getStatusName,
    statusClass,
    toRows,
} from "../../features/expeditions/utils";

const PER_PAGE = 12;

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">{title}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
                </div>
                <div className={`rounded-xl p-3 ${color}`}>
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ expedition }) {
    return (
        <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(expedition.statut)}`}
        >
            {getStatusName(expedition)}
        </span>
    );
}

function ExpeditionCard({ expedition, onOpen }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                        <Package size={21} />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900">
                            {expedition.numero_suivi || `Expédition #${expedition.id}`}
                        </p>
                        <p className="mt-1 truncate text-sm text-slate-500">
                            {getClientName(expedition.client)}
                        </p>
                    </div>
                </div>

                <StatusBadge expedition={expedition} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                    <p className="text-xs text-slate-400">Date d'expédition</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                        {formatDate(expedition.date_expedition || expedition.created_at)}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-400">Poids total</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                        {expedition.poids_total ?? "—"} kg
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-semibold text-slate-800">
                    {formatMoney(expedition.montant_ttc)}
                </span>

                <button
                    type="button"
                    onClick={() => onOpen(expedition)}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50"
                >
                    <Eye size={16} />
                    Détails
                </button>
            </div>
        </div>
    );
}

export default function ExpeditionsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statutId, setStatutId] = useState("");
    const [viewMode, setViewMode] = useState("grid");

    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState(null);

    const debouncedSearch = useDebouncedValue(search.trim());
    const catalogs = useExpeditionCatalogs();

    // Liste paginée par Laravel : page, recherche et statut sont envoyés au serveur.
    const list = useFetch(
        (signal) =>
            expeditionService.getAll(
                {
                    page,
                    per_page: PER_PAGE,
                    search: debouncedSearch || undefined,
                    statut_id: statutId || undefined,
                },
                { signal }
            ),
        [page, debouncedSearch, statutId]
    );

    // Compteurs globaux (toutes les expéditions, pas seulement la page affichée).
    const summary = useFetch(
        (signal) => dashboardService.getDashboard({ period: "6_months" }, { signal }),
        []
    );

    const rows = useMemo(() => toRows(list.data), [list.data]);
    const meta = list.data ?? {};
    const lastPage = meta.last_page ?? 1;
    const total = meta.total ?? rows.length;
    const initialLoading = list.loading && !list.data;

    const stats = summary.data?.stats;
    const statusCounts = summary.data?.expedition_status;
    const counter = (value) => (summary.data ? new Intl.NumberFormat("fr-FR").format(value ?? 0) : "—");

    const refreshAll = () => {
        list.reload();
        summary.reload();
        catalogs.reload();
    };

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleStatus = (value) => {
        setStatutId(value);
        setPage(1);
    };

    const handleCreated = () => {
        setShowForm(false);
        setPage(1);
        list.reload();
        summary.reload();
    };

    return (
        <div className="min-h-screen space-y-6 bg-linear-to-br from-slate-50 via-violet-50/30 to-indigo-50/30 p-4 sm:p-6">
            {/* En-tête */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Gestion des expéditions
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Suivez et gérez les expéditions de vos clients.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={refreshAll}
                        disabled={list.loading}
                        className={buttonSecondary}
                    >
                        <RefreshCw size={17} className={list.loading ? "animate-spin" : ""} />
                        Actualiser
                    </button>

                    <button type="button" onClick={() => setShowForm(true)} className={buttonPrimary}>
                        <Plus size={18} />
                        Nouvelle expédition
                    </button>
                </div>
            </div>

            {/* Erreurs et avertissements */}
            {list.error && (
                <div
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    role="alert"
                >
                    <AlertCircle size={19} className="mt-0.5 shrink-0" />
                    <p className="flex-1">
                        {getApiErrorMessage(list.error, "Impossible de charger les expéditions.")}
                    </p>
                    <button type="button" onClick={list.reload} className="font-semibold underline">
                        Réessayer
                    </button>
                </div>
            )}

            {catalogs.warning && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <p className="flex-1">{catalogs.warning}</p>
                    <button type="button" onClick={catalogs.reload} className="font-semibold underline">
                        Réessayer
                    </button>
                </div>
            )}

            {/* Statistiques */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total expéditions"
                    value={counter(stats?.expeditions?.total)}
                    icon={Package}
                    color="bg-violet-50 text-violet-600"
                />
                <StatCard
                    title="En attente"
                    value={counter(statusCounts?.en_attente)}
                    icon={Clock3}
                    color="bg-amber-50 text-amber-600"
                />
                <StatCard
                    title="En transit"
                    value={counter(statusCounts?.en_transit)}
                    icon={Truck}
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Livrées"
                    value={counter(statusCounts?.livree)}
                    icon={CheckCircle2}
                    color="bg-emerald-50 text-emerald-600"
                />
            </div>

            {/* Recherche et filtres */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => handleSearch(event.target.value)}
                            placeholder="Rechercher par numéro de suivi ou client..."
                            className={`${inputClass} pl-10`}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={statutId}
                            onChange={(event) => handleStatus(event.target.value)}
                            className={`${inputClass} min-w-44`}
                        >
                            <option value="">Tous les statuts</option>
                            {catalogs.statuts.map((statut) => (
                                <option key={statut.id} value={statut.id}>
                                    {statut.nom}
                                </option>
                            ))}
                        </select>

                        <div className="flex rounded-xl border border-slate-200 p-1">
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={`rounded-lg p-2 ${
                                    viewMode === "grid" ? "bg-violet-100 text-violet-700" : "text-slate-400"
                                }`}
                                aria-label="Vue cartes"
                            >
                                <LayoutGrid size={18} />
                            </button>

                            <button
                                type="button"
                                onClick={() => setViewMode("list")}
                                className={`rounded-lg p-2 ${
                                    viewMode === "list" ? "bg-violet-100 text-violet-700" : "text-slate-400"
                                }`}
                                aria-label="Vue tableau"
                            >
                                <List size={18} />
                            </button>
                        </div>

                        {(search || statutId) && (
                            <button
                                type="button"
                                onClick={() => {
                                    handleSearch("");
                                    handleStatus("");
                                }}
                                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
                            >
                                <X size={15} />
                                Réinitialiser
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Liste */}
            {initialLoading ? (
                <div className="flex items-center justify-center rounded-2xl bg-white p-16 text-slate-500">
                    <LoaderCircle className="mr-3 animate-spin" size={22} />
                    Chargement des expéditions...
                </div>
            ) : rows.length === 0 && !list.error ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                    <Package className="mx-auto text-slate-300" size={42} />
                    <h3 className="mt-4 font-semibold text-slate-800">Aucune expédition trouvée</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Modifiez vos filtres ou créez une nouvelle expédition.
                    </p>
                </div>
            ) : (
                <div className={list.loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                            {rows.map((expedition) => (
                                <ExpeditionCard
                                    key={expedition.id}
                                    expedition={expedition}
                                    onOpen={setSelected}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] text-left text-sm">
                                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                        <tr>
                                            <th className="px-5 py-4">Numéro de suivi</th>
                                            <th className="px-5 py-4">Client</th>
                                            <th className="px-5 py-4">Date</th>
                                            <th className="px-5 py-4">Poids</th>
                                            <th className="px-5 py-4">Montant TTC</th>
                                            <th className="px-5 py-4">Statut</th>
                                            <th className="px-5 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {rows.map((expedition) => (
                                            <tr key={expedition.id} className="hover:bg-slate-50/70">
                                                <td className="px-5 py-4 font-semibold text-slate-900">
                                                    {expedition.numero_suivi || `#${expedition.id}`}
                                                </td>
                                                <td className="px-5 py-4 text-slate-600">
                                                    {getClientName(expedition.client)}
                                                </td>
                                                <td className="px-5 py-4 text-slate-600">
                                                    {formatDate(expedition.date_expedition || expedition.created_at)}
                                                </td>
                                                <td className="px-5 py-4 text-slate-600">
                                                    {expedition.poids_total ?? "—"} kg
                                                </td>
                                                <td className="px-5 py-4 text-slate-600">
                                                    {formatMoney(expedition.montant_ttc)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <StatusBadge expedition={expedition} />
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelected(expedition)}
                                                        className="rounded-lg p-2 text-violet-600 hover:bg-violet-50"
                                                        title="Voir les détails"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {rows.length > 0 && (
                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <p className="text-sm text-slate-500">
                        {total} expédition(s) — Page {meta.current_page ?? page} sur {lastPage}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page <= 1 || list.loading}
                            onClick={() => setPage((current) => current - 1)}
                            className={buttonSecondary}
                        >
                            <ChevronLeft size={17} />
                            Précédent
                        </button>

                        <button
                            type="button"
                            disabled={page >= lastPage || list.loading}
                            onClick={() => setPage((current) => current + 1)}
                            className={buttonSecondary}
                        >
                            Suivant
                            <ChevronRight size={17} />
                        </button>
                    </div>
                </div>
            )}

            {showForm && (
                <ExpeditionFormModal
                    catalogs={catalogs}
                    onClose={() => setShowForm(false)}
                    onCreated={handleCreated}
                />
            )}

            {selected && (
                <ExpeditionDetailsModal expedition={selected} onClose={() => setSelected(null)} />
            )}
        </div>
    );
}
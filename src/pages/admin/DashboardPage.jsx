import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    Boxes,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    Package,
    RefreshCw,
    Search,
    Truck,
    Users,
} from "lucide-react";

import dashboardService from "../../services/api/dashboardService";
import useFetch from "../../hooks/useFetch";

/**
 * Tableau de bord administrateur.
 * Source : GET /api/v1/admin/dashboard (DashboardController).
 *
 * Forme des données renvoyées par l'API :
 * - stats.{expeditions,clients,colis,livraisons} : { total, variation }
 * - expedition_status : { brouillon, en_attente, en_transit, livree, annulee }
 * - monthly_activity : [{ period, month, expeditions, clients, livraisons }]
 * - recent_expeditions : [{ id, numero_suivi, client (texte), statut, statut_code,
 *                           service, date_expedition, created_at }]
 * - recent_activities : [{ id, description, code, numero_suivi, user, occurred_at }]
 */

const PERIODS = [
    { value: "6_months", label: "6 derniers mois", short: "6 mois" },
    { value: "12_months", label: "12 derniers mois", short: "12 mois" },
    { value: "30_days", label: "30 derniers jours", short: "30 jours" },
];

const EMPTY_DASHBOARD = {
    stats: {
        expeditions: { total: 0, variation: null },
        clients: { total: 0, variation: null },
        colis: { total: 0, variation: null },
        livraisons: { total: 0, variation: null },
    },
    expedition_status: {
        brouillon: 0,
        en_attente: 0,
        en_transit: 0,
        livree: 0,
        annulee: 0,
    },
    monthly_activity: [],
    recent_expeditions: [],
    recent_activities: [],
};

const STATUS = {
    brouillon: {
        label: "Brouillon",
        className: "bg-slate-100 text-slate-600",
        dot: "bg-slate-400",
    },
    en_attente: {
        label: "En attente",
        className: "bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
    },
    en_transit: {
        label: "En transit",
        className: "bg-blue-50 text-blue-700",
        dot: "bg-blue-500",
    },
    livree: {
        label: "Livrée",
        className: "bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
    },
    annulee: {
        label: "Annulée",
        className: "bg-rose-50 text-rose-700",
        dot: "bg-rose-500",
    },
};

// Codes des statuts d'expédition (table expedition_statuts) -> statut d'affichage.
const STATUS_BY_CODE = {
    DEPOSE: "en_attente",
    EN_COURS: "en_transit",
    LIVRE: "livree",
};

// Segments du graphique en anneau, dans l'ordre d'affichage.
const DONUT = [
    { key: "en_transit", label: "En transit", color: "#2563eb", dot: "bg-blue-500" },
    { key: "livree", label: "Livrées", color: "#10b981", dot: "bg-emerald-500" },
    { key: "en_attente", label: "En attente", color: "#f59e0b", dot: "bg-amber-500" },
    { key: "brouillon", label: "Brouillons", color: "#cbd5e1", dot: "bg-slate-300" },
    { key: "annulee", label: "Annulées", color: "#f43f5e", dot: "bg-rose-500" },
];

// Brouillons et annulées n'apparaissent dans la légende que s'il y en a.
const ALWAYS_LISTED = ["en_transit", "livree", "en_attente"];

function formatNumber(value) {
    return new Intl.NumberFormat("fr-FR").format(Number(value || 0));
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function formatDateTime(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

// Renvoie une clé de STATUS, ou null si le statut n'est pas reconnu.
function normalizeStatus(value) {
    if (!value) return null;

    const normalized = String(value)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\s-]+/g, "_");

    if (["livree", "livre", "delivered", "terminee", "termine"].includes(normalized)) return "livree";
    if (["en_transit", "transit", "in_transit", "en_cours", "expediee", "expedie"].includes(normalized)) return "en_transit";
    if (["en_attente", "attente", "pending", "depose", "en_preparation"].includes(normalized)) return "en_attente";
    if (["annulee", "annule", "cancelled", "canceled"].includes(normalized)) return "annulee";
    if (["brouillon", "draft"].includes(normalized)) return "brouillon";

    return null;
}

function resolveStatus(expedition) {
    return STATUS_BY_CODE[expedition?.statut_code] ?? normalizeStatus(expedition?.statut);
}

function asArray(value) {
    return Array.isArray(value) ? value : [];
}

function normalizeDashboard(data) {
    return {
        stats: { ...EMPTY_DASHBOARD.stats, ...(data?.stats ?? {}) },
        expedition_status: {
            ...EMPTY_DASHBOARD.expedition_status,
            ...(data?.expedition_status ?? {}),
        },
        monthly_activity: asArray(data?.monthly_activity),
        recent_expeditions: asArray(data?.recent_expeditions),
        recent_activities: asArray(data?.recent_activities),
    };
}

function buildDonut(counts) {
    const total = DONUT.reduce((sum, segment) => sum + Number(counts[segment.key] || 0), 0);

    if (!total) {
        return { total, background: "#f1f5f9" };
    }

    let cursor = 0;

    const stops = DONUT
        .filter((segment) => Number(counts[segment.key] || 0) > 0)
        .map((segment) => {
            const start = cursor;
            cursor += (Number(counts[segment.key]) / total) * 100;

            return `${segment.color} ${start}% ${cursor}%`;
        });

    return { total, background: `conic-gradient(${stops.join(", ")})` };
}

function getErrorMessage(error) {
    const status = error?.response?.status;

    if (status === 403) return "Vous n'avez pas accès au tableau de bord.";
    if (status === 404) return "La route /admin/dashboard est introuvable dans l'API.";
    if (!error?.response) return "Impossible de joindre le serveur.";

    return error.response?.data?.message || "Impossible de charger les données du tableau de bord.";
}

function StatCard({ title, subtitle, value, icon: Icon, tone = "blue", variation, href, loading }) {
    const tones = {
        blue: "bg-blue-50 text-blue-600 ring-blue-100",
        violet: "bg-violet-50 text-violet-600 ring-violet-100",
        amber: "bg-amber-50 text-amber-600 ring-amber-100",
        emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    };

    const hasVariation = variation !== null && variation !== undefined;
    const positive = Number(variation) >= 0;

    return (
        <Link
            to={href}
            className="group block cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100 sm:p-6"
            aria-label={`Ouvrir la page ${title}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500 transition group-hover:text-blue-600">
                        {title}
                    </p>

                    {loading ? (
                        <span className="mt-3 block h-9 w-20 animate-pulse rounded-lg bg-slate-100" />
                    ) : (
                        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                            {formatNumber(value)}
                        </p>
                    )}

                    <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
                </div>

                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 transition duration-200 group-hover:scale-110 ${tones[tone]}`}
                >
                    <Icon size={22} strokeWidth={1.9} />
                </div>
            </div>

            {!loading && hasVariation && (
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold">
                    {positive ? (
                        <ArrowUpRight size={15} className="text-emerald-600" />
                    ) : (
                        <ArrowDownRight size={15} className="text-rose-600" />
                    )}

                    <span className={positive ? "text-emerald-600" : "text-rose-600"}>
                        {Math.abs(Number(variation))}%
                    </span>

                    <span className="font-normal text-slate-400">
                        par rapport à la période précédente
                    </span>
                </div>
            )}

            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600">
                Voir les détails
                <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                />
            </div>
        </Link>
    );
}

function StatusBadge({ status, fallbackLabel }) {
    const config = STATUS[status];

    // Statut inconnu : badge neutre avec le libellé renvoyé par l'API.
    if (!config) {
        return (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                {fallbackLabel || "—"}
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

function EmptyState({ icon: Icon = Package, title, description }) {
    return (
        <div className="flex min-h-48 flex-col items-center justify-center px-5 py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Icon size={22} />
            </div>
            <p className="text-sm font-semibold text-slate-700">{title}</p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">{description}</p>
        </div>
    );
}

function ActivityChart({ items }) {
    const bars = useMemo(
        () =>
            items.map((item) => ({
                label: item.month ?? item.label ?? "",
                value: Number(item.expeditions ?? item.value ?? item.total ?? 0),
            })),
        [items]
    );

    if (!bars.length) {
        return (
            <EmptyState
                icon={Truck}
                title="Aucune donnée d'activité"
                description="L'activité apparaîtra ici dès l'enregistrement des premières expéditions."
            />
        );
    }

    const max = Math.max(...bars.map((bar) => bar.value), 1);
    const dense = bars.length > 12; // période de 30 jours : une barre par jour

    return (
        <div className="px-5 pb-5 pt-2 sm:px-6">
            <div className={`flex h-52 items-end ${dense ? "gap-1" : "gap-2 sm:gap-4"}`}>
                {bars.map((bar, index) => {
                    const height = bar.value > 0 ? Math.max((bar.value / max) * 100, 5) : 3;
                    const showLabel = !dense || index % 5 === 0 || index === bars.length - 1;

                    return (
                        <div
                            key={`${bar.label}-${index}`}
                            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                        >
                            <span className="h-4 text-[11px] font-semibold text-slate-500">
                                {!dense && bar.value ? formatNumber(bar.value) : ""}
                            </span>
                            <div className="flex h-[72%] w-full items-end overflow-hidden rounded-t-lg bg-slate-50">
                                <div
                                    className="w-full rounded-t-lg bg-linear-to-t from-blue-600 to-cyan-400 transition-all duration-500"
                                    style={{ height: `${height}%` }}
                                    title={`${bar.label} : ${bar.value}`}
                                />
                            </div>
                            <span className="h-4 whitespace-nowrap text-[10px] font-medium text-slate-400 sm:text-[11px]">
                                {showLabel ? bar.label : ""}
                            </span>
                        </div>
                    );
                })}
            </div>

            {!bars.some((bar) => bar.value > 0) && (
                <p className="mt-3 text-center text-xs text-slate-400">
                    Aucune expédition enregistrée sur cette période.
                </p>
            )}
        </div>
    );
}

export default function DashboardPage() {
    const [period, setPeriod] = useState("6_months");
    const [search, setSearch] = useState("");

    const { data, error, loading, reload } = useFetch(
        (signal) => dashboardService.getDashboard({ period }, { signal }),
        [period]
    );

    const dashboard = useMemo(() => normalizeDashboard(data), [data]);
    const initialLoading = loading && !data;

    const { stats, expedition_status: statusCounts } = dashboard;
    const donut = useMemo(() => buildDonut(statusCounts), [statusCounts]);
    const periodLabel = PERIODS.find((item) => item.value === period)?.short;

    const expeditions = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return dashboard.recent_expeditions;

        return dashboard.recent_expeditions.filter((item) =>
            [item.numero_suivi, item.client, item.service, item.statut]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(term))
        );
    }, [dashboard.recent_expeditions, search]);

    return (
        <div className="min-h-full bg-linear-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 p-4 sm:p-3 lg:p-3">
            <div className="mx-auto max-w-[1600px] space-y-2">
                {/* En-tête */}
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                            Espace administration
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Tableau de bord
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Vue d'ensemble de l'activité Alliance Transit.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={period}
                            onChange={(event) => setPeriod(event.target.value)}
                            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        >
                            {PERIODS.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={reload}
                            disabled={loading}
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            Actualiser
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-full bg-amber-100 p-1.5 text-amber-700">
                                <Clock3 size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-amber-900">Données indisponibles</p>
                                <p className="mt-0.5 text-xs text-amber-800">{getErrorMessage(error)}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={reload}
                            className="self-start text-xs font-bold text-amber-800 underline underline-offset-4 sm:self-center"
                        >
                            Réessayer
                        </button>
                    </div>
                )}

                {/* Indicateurs principaux */}
                <section className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Expéditions"
                        subtitle="Total enregistré"
                        value={stats.expeditions?.total}
                        variation={stats.expeditions?.variation}
                        icon={Truck}
                        tone="blue"
                        href="/admin/expeditions"
                        loading={initialLoading}
                    />
                    <StatCard
                        title="Clients"
                        subtitle="Comptes clients"
                        value={stats.clients?.total}
                        variation={stats.clients?.variation}
                        icon={Users}
                        tone="violet"
                        href="/admin/clients"
                        loading={initialLoading}
                    />
                    <StatCard
                        title="Colis"
                        subtitle="Pris en charge"
                        value={stats.colis?.total}
                        variation={stats.colis?.variation}
                        icon={Boxes}
                        tone="amber"
                        href="/admin/colis"
                        loading={initialLoading}
                    />
                    <StatCard
                        title="Livraisons"
                        subtitle="Enregistrées"
                        value={stats.livraisons?.total}
                        variation={stats.livraisons?.variation}
                        icon={CheckCircle2}
                        tone="emerald"
                        href="/livraison/livraisons"
                        loading={initialLoading}
                    />
                </section>

                {/* Graphique et répartition */}
                <section className="grid grid-cols-1 gap-2 xl:grid-cols-[1.55fr_1fr]">
                    <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                            <div>
                                <h2 className="font-bold text-slate-800">Activité des expéditions</h2>
                                <p className="mt-1 text-xs text-slate-400">Évolution du volume d'expéditions</p>
                            </div>
                            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                                {periodLabel}
                            </span>
                        </div>
                        <ActivityChart items={dashboard.monthly_activity} />
                    </article>

                    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="font-bold text-slate-800">État des expéditions</h2>
                                <p className="mt-1 text-xs text-slate-400">Répartition par statut</p>
                            </div>
                            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                                <Package size={19} />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-5">
                            <div
                                className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
                                style={{ background: donut.background }}
                            >
                                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white">
                                    <span className="text-2xl font-bold text-slate-900">
                                        {formatNumber(donut.total)}
                                    </span>
                                    <span className="text-[10px] text-slate-400">au total</span>
                                </div>
                            </div>

                            <div className="min-w-0 flex-1 space-y-3">
                                {DONUT.filter(
                                    (segment) =>
                                        ALWAYS_LISTED.includes(segment.key) ||
                                        Number(statusCounts[segment.key] || 0) > 0
                                ).map((segment) => (
                                    <div key={segment.key} className="flex items-center justify-between gap-2 text-xs">
                                        <span className="flex items-center gap-2 text-slate-500">
                                            <span className={`h-2 w-2 rounded-full ${segment.dot}`} />
                                            {segment.label}
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {formatNumber(statusCounts[segment.key])}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {!donut.total && (
                            <p className="mt-5 rounded-xl bg-slate-50 px-3 py-2.5 text-center text-xs text-slate-400">
                                Aucun statut à afficher pour le moment.
                            </p>
                        )}
                    </article>
                </section>

                {/* Dernières expéditions */}
                <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h2 className="font-bold text-slate-800">Dernières expéditions</h2>
                            <p className="mt-1 text-xs text-slate-400">Suivi des opérations les plus récentes</p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <label className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Rechercher une expédition..."
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:w-64"
                                />
                            </label>
                            <Link
                                to="/admin/expeditions"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                            >
                                Toutes les expéditions <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {initialLoading ? (
                        <div className="space-y-3 p-6">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="h-14 animate-pulse rounded-xl bg-slate-100" />
                            ))}
                        </div>
                    ) : expeditions.length ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-190 text-left">
                                    <thead className="bg-slate-50/80">
                                        <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            <th className="px-6 py-4">Référence</th>
                                            <th className="px-6 py-4">Client</th>
                                            <th className="px-6 py-4">Service</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Statut</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {expeditions.map((item) => (
                                            <tr key={item.id} className="transition hover:bg-slate-50/70">
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-slate-800">
                                                        {item.numero_suivi || `EXP-${item.id}`}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                                    {item.client || "Client non renseigné"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {item.service || "—"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {formatDate(item.date_expedition || item.created_at)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge
                                                        status={resolveStatus(item)}
                                                        fallbackLabel={item.statut}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        to="/admin/expeditions"
                                                        title="Voir les expéditions"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <Eye size={17} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
                                {expeditions.length} expédition(s) affichée(s)
                            </div>
                        </>
                    ) : (
                        <EmptyState
                            icon={Truck}
                            title={search ? "Aucun résultat" : "Aucune expédition pour le moment"}
                            description={
                                search
                                    ? "Essayez avec une autre référence, un autre client ou un autre service."
                                    : "Les expéditions créées dans Alliance Transit apparaîtront ici automatiquement."
                            }
                        />
                    )}
                </section>

                {/* Activités récentes */}
                <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
                        <div>
                            <h2 className="font-bold text-slate-800">Activités récentes</h2>
                            <p className="mt-1 text-xs text-slate-400">Les derniers événements de la plateforme</p>
                        </div>
                        <CalendarDays size={19} className="text-slate-400" />
                    </div>

                    {dashboard.recent_activities.length ? (
                        <div className="divide-y divide-slate-100">
                            {dashboard.recent_activities.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 px-5 py-4 sm:px-6">
                                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Clock3 size={17} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-slate-700">
                                            {activity.description || activity.code || "Nouvelle activité"}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            {[activity.numero_suivi, activity.user, formatDateTime(activity.occurred_at)]
                                                .filter(Boolean)
                                                .join(" · ")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={CalendarDays}
                            title="Aucune activité récente"
                            description="L'historique des opérations apparaîtra ici dès les premières actions des utilisateurs."
                        />
                    )}
                </section>

                <p className="pb-2 text-center text-[11px] text-slate-400">
                    Alliance Transit · Tableau de bord administratif
                </p>
            </div>
        </div>
    );
}
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import dashboardService from "../../../../services/api/dashboardService";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Package,
  Plus,
  RefreshCw,
  Search,
  Truck,
  Users,
  Wallet,
} from "lucide-react";

/**
 * Dashboard administrateur Alliance Transit
 *
 * - Même langage visuel que la page Expéditions : cartes arrondies,
 *   bordures slate, badges de statut, espaces généreux et Tailwind.
 * - Source réelle : GET /api/admin/dashboard
 * - Sans données API : affichage de zéros et d'états vides (pas de faux chiffres).
 *
 * Variables facultatives dans .env :
 * VITE_API_URL=http://127.0.0.1:8000/api
 *
 * Le token est recherché dans localStorage sous "token" ou "auth_token".
 * Si votre useAuth utilise une autre clé, adaptez getAuthToken().
 */

 

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

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

function formatNumber(value) {
  return new Intl.NumberFormat("fr-FR").format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function normalizeStatus(value) {
  if (!value) return "brouillon";
  const normalized = String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s-]+/g, "_");

  if (["livree", "livre", "delivered", "terminee", "termine"].includes(normalized)) return "livree";
  if (["en_transit", "transit", "in_transit", "expediee", "expedie"].includes(normalized)) return "en_transit";
  if (["en_attente", "attente", "pending", "en_preparation"].includes(normalized)) return "en_attente";
  if (["annulee", "annule", "cancelled", "canceled"].includes(normalized)) return "annulee";
  return "brouillon";
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "blue",
  variation,
  href,
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  };

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

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {formatNumber(value)}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 transition duration-200 group-hover:scale-110 ${tones[tone]}`}
        >
          <Icon size={22} strokeWidth={1.9} />
        </div>
      </div>

      {variation !== null && variation !== undefined && (
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

function StatusBadge({ status }) {
  const config = STATUS[normalizeStatus(status)] || STATUS.brouillon;
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

function ActivityChart({ items = [] }) {
  const chartItems = useMemo(() => {
    if (items.length) {
      return items.slice(-6).map((item) => ({
        label: item.label || item.month || MONTHS[new Date().getMonth()],
        value: Number(item.value ?? item.total ?? item.expeditions ?? 0),
      }));
    }

    const currentMonth = new Date().getMonth();
    return Array.from({ length: 6 }, (_, index) => ({
      label: MONTHS[(currentMonth - 5 + index + 12) % 12],
      value: 0,
    }));
  }, [items]);

  const max = Math.max(...chartItems.map((item) => item.value), 1);

  return (
    <div className="px-5 pb-5 pt-2 sm:px-6">
      <div className="flex h-52 items-end gap-3 sm:gap-5">
        {chartItems.map((item, index) => {
          const height = item.value > 0 ? Math.max((item.value / max) * 100, 5) : 3;
          return (
            <div key={`${item.label}-${index}`} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-[11px] font-semibold text-slate-500">
                {item.value ? formatNumber(item.value) : ""}
              </span>
              <div className="flex h-[72%] w-full items-end overflow-hidden rounded-t-lg bg-slate-50">
                <div
                  className="w-full rounded-t-lg bg-linear-to-t from-blue-600 to-cyan-400 transition-all duration-500"
                  style={{ height: `${height}%` }}
                  title={`${item.label} : ${item.value}`}
                />
              </div>
              <span className="text-[11px] font-medium text-slate-400">{item.label}</span>
            </div>
          );
        })}
      </div>
      {!items.length && (
        <p className="mt-3 text-center text-xs text-slate-400">
          L'activité apparaîtra ici dès l'enregistrement des premières expéditions.
        </p>
      )}
    </div>
  );
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("6_months");

 const loadDashboard = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    const data = await dashboardService.getDashboard({ period });

    setDashboard({
      ...EMPTY_DASHBOARD,
      ...data,

      stats: {
        ...EMPTY_DASHBOARD.stats,
        ...(data?.stats || {}),
      },

      expedition_status: {
        ...EMPTY_DASHBOARD.expedition_status,
        ...(data?.expedition_status || {}),
      },

      monthly_activity: Array.isArray(data?.monthly_activity)
        ? data.monthly_activity
        : [],

      recent_expeditions: Array.isArray(data?.recent_expeditions)
        ? data.recent_expeditions
        : [],

      recent_activities: Array.isArray(data?.recent_activities)
        ? data.recent_activities
        : [],
    });
  } catch (err) {
    setDashboard({
      ...EMPTY_DASHBOARD,
      stats: { ...EMPTY_DASHBOARD.stats },
      expedition_status: { ...EMPTY_DASHBOARD.expedition_status },
      monthly_activity: [],
      recent_expeditions: [],
      recent_activities: [],
    });

    if (err.response?.status === 404) {
      setError("La route /api/v1/admin/dashboard n'existe pas encore dans Laravel.");
    } else if (
      err.response?.status === 401 ||
      err.response?.status === 403
    ) {
      setError("Votre session a expiré ou vous n'avez pas accès au tableau de bord.");
    } else {
      setError(
        err.response?.data?.message ||
        "Impossible de charger les données du tableau de bord."
      );
    }
  } finally {
    setLoading(false);
  }
}, [period]);

  useEffect(() => {
  loadDashboard();
}, [loadDashboard]);

  const stats = dashboard.stats || EMPTY_DASHBOARD.stats;
  const expeditions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return dashboard.recent_expeditions;
    return dashboard.recent_expeditions.filter((item) =>
      [
  item.numero_suivi,
  item.reference,
  item.client?.nom,
  item.client?.name,
  item.client?.personne?.nom,
  item.client?.personne?.prenom,
  item.destination,
]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [dashboard.recent_expeditions, search]);

  const statusCounts = dashboard.expedition_status;
  const statusTotal = Object.values(statusCounts).reduce((sum, value) => sum + Number(value || 0), 0);

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
              <option value="6_months">6 derniers mois</option>
              <option value="12_months">12 derniers mois</option>
              <option value="30_days">30 derniers jours</option>
            </select>
            <button
              type="button"
              onClick={loadDashboard}
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
                <p className="mt-0.5 text-xs text-amber-800">{error}</p>
              </div>
            </div>
            <button onClick={loadDashboard} className="self-start text-xs font-bold text-amber-800 underline underline-offset-4 sm:self-center">
              Réessayer
            </button>
          </div>
        )}

        {/* Indicateurs principaux */}
        <section className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">

  {/* Expéditions */}
  <StatCard
    title="Expéditions total"
    value={stats.expeditions?.total}
    // subtitle="Nombre total d'expéditions"
    icon={Truck}
    tone="blue"
    // variation={stats.expeditions?.variation}
    href="/admin/expeditions"
  />

  {/* Clients */}
  <StatCard
    title="Clients enregistrés"
    value={stats.clients?.total}
    // subtitle="Comptes clients enregistrés"
    icon={Users}
    tone="violet"
    // variation={stats.clients?.variation}
    href="/admin/clients"
  />

  {/* Colis */}
  <StatCard
    title="Colis pris en charge"
    value={stats.colis?.total}
    // subtitle="Colis pris en charge"
    icon={Boxes}
    tone="amber"
    // variation={stats.colis?.variation}
    href="/admin/colis"
  />

  {/* Livraisons */}
  <StatCard
    title="Livraisons enregistrées"
    value={stats.livraisons?.total}
    // subtitle="Livraisons enregistrées"
    icon={CheckCircle2}
    tone="emerald"
    // variation={stats.livraisons?.variation}
    href="/admin/livraisons"
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
                {period === "30_days" ? "30 jours" : period === "12_months" ? "12 mois" : "6 mois"}
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
                style={{
                  background: statusTotal
                    ? `conic-gradient(#2563eb 0% ${((statusCounts.en_transit || 0) / statusTotal) * 100}%, #10b981 ${((statusCounts.en_transit || 0) / statusTotal) * 100}% ${(((statusCounts.en_transit || 0) + (statusCounts.livree || 0)) / statusTotal) * 100}%, #f59e0b ${(((statusCounts.en_transit || 0) + (statusCounts.livree || 0)) / statusTotal) * 100}% ${(((statusCounts.en_transit || 0) + (statusCounts.livree || 0) + (statusCounts.en_attente || 0)) / statusTotal) * 100}%, #cbd5e1 ${(((statusCounts.en_transit || 0) + (statusCounts.livree || 0) + (statusCounts.en_attente || 0)) / statusTotal) * 100}% 100%)`
                    : "#f1f5f9",
                }}
              >
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-2xl font-bold text-slate-900">{formatNumber(statusTotal)}</span>
                  <span className="text-[10px] text-slate-400">au total</span>
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                {[
                  ["En transit", statusCounts.en_transit, "bg-blue-500"],
                  ["Livrées", statusCounts.livree, "bg-emerald-500"],
                  ["En attente", statusCounts.en_attente, "bg-amber-500"],
                  ["Brouillons", statusCounts.brouillon, "bg-slate-300"],
                ].map(([label, value, color]) => (
                  <div key={label} className="flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-2 text-slate-500">
                      <span className={`h-2 w-2 rounded-full ${color}`} />
                      {label}
                    </span>
                    <span className="font-bold text-slate-800">{formatNumber(value)}</span>
                  </div>
                ))}
              </div>
            </div>
            {!statusTotal && (
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
>Toutes les expéditions <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {loading ? (
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
                      <th className="px-6 py-4">Destination</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expeditions.map((item, index) => (
                      <tr key={item.id ?? item.uuid ?? index} className="transition hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-800">
                            {item.numero_suivi || item.reference || `EXP-${item.id ?? "—"}`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-700">
                            {item.client?.nom || item.client?.name || item.client_nom || "Client non renseigné"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{item.destination || "—"}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{formatDate(item.created_at || item.date_expedition)}</td>
                        <td className="px-6 py-4"><StatusBadge status={item.statut?.slug || item.statut || item.status} /></td>
                        <td className="px-6 py-4 text-right">
                          <a
                            href={`/admin/expeditions/${item.id}`}
                            title="Voir l'expédition"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={17} />
                          </a>
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
                  ? "Essayez avec une autre référence, un autre client ou une autre destination."
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
              {dashboard.recent_activities.slice(0, 5).map((activity, index) => (
                <div key={activity.id ?? index} className="flex items-start gap-3 px-5 py-4 sm:px-6">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Clock3 size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-700">{activity.description || activity.message || "Nouvelle activité"}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatDate(activity.created_at)}</p>
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

export default DashboardPage;

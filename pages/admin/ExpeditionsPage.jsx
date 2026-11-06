
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Package,
  MapPin,
  CalendarDays,
  Truck,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  X,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
} from "lucide-react";

// ======================================================
// DONNÉES DE DÉMONSTRATION
// À remplacer par les données de l'API Laravel
// ======================================================

const demoExpeditions = [
  {
    id: 1,
    reference: "EXP-2026-001",
    client: "Jean Kouassi",
    email: "jean.kouassi@gmail.com",
    origin: "Abidjan",
    destination: "Paris",
    date: "2026-11-02",
    packages: 4,
    weight: 28.5,
    service: "Express",
    amount: 185000,
    currency: "FCFA",
    status: "in_transit",
    progress: 65,
    transport: "Aérien",
  },
  {
    id: 2,
    reference: "EXP-2026-002",
    client: "Entreprise Ivoire Tech",
    email: "contact@ivoiretech.ci",
    origin: "Abidjan",
    destination: "Dakar",
    date: "2026-11-03",
    packages: 12,
    weight: 85,
    service: "Standard",
    amount: 95000,
    currency: "FCFA",
    status: "pending",
    progress: 15,
    transport: "Routier",
  },
  {
    id: 3,
    reference: "EXP-2026-003",
    client: "Marie N'Guessan",
    email: "marie@gmail.com",
    origin: "Yamoussoukro",
    destination: "Lyon",
    date: "2026-10-28",
    packages: 2,
    weight: 12,
    service: "Express",
    amount: 120000,
    currency: "FCFA",
    status: "delivered",
    progress: 100,
    transport: "Aérien",
  },
  {
    id: 4,
    reference: "EXP-2026-004",
    client: "Société Bâtir CI",
    email: "contact@batir.ci",
    origin: "Abidjan",
    destination: "Bamako",
    date: "2026-11-04",
    packages: 8,
    weight: 150,
    service: "Économique",
    amount: 250000,
    currency: "FCFA",
    status: "pending",
    progress: 25,
    transport: "Routier",
  },
  {
    id: 5,
    reference: "EXP-2026-005",
    client: "Paul Yao",
    email: "paul.yao@gmail.com",
    origin: "Bouaké",
    destination: "Abidjan",
    date: "2026-11-01",
    packages: 1,
    weight: 5,
    service: "Standard",
    amount: 15000,
    currency: "FCFA",
    status: "delivered",
    progress: 100,
    transport: "Routier",
  },
  {
    id: 6,
    reference: "EXP-2026-006",
    client: "Global Commerce",
    email: "info@globalcommerce.com",
    origin: "Abidjan",
    destination: "Bruxelles",
    date: "2026-11-05",
    packages: 20,
    weight: 230,
    service: "Express",
    amount: 450000,
    currency: "FCFA",
    status: "draft",
    progress: 0,
    transport: "Aérien",
  },
  {
    id: 7,
    reference: "EXP-2026-007",
    client: "Adjoua Traoré",
    email: "adjoua@gmail.com",
    origin: "Abidjan",
    destination: "Accra",
    date: "2026-10-30",
    packages: 3,
    weight: 18,
    service: "Standard",
    amount: 45000,
    currency: "FCFA",
    status: "cancelled",
    progress: 0,
    transport: "Routier",
  },
];

// ======================================================
// CONFIGURATION DES STATUTS
// ======================================================

const statusConfig = {
  draft: {
    label: "Brouillon",
    color: "bg-slate-100 text-slate-600",
    dot: "bg-slate-500",
    icon: FileText,
  },
  pending: {
    label: "En attente",
    color: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
    icon: Clock,
  },
  in_transit: {
    label: "En transit",
    color: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
    icon: Truck,
  },
  delivered: {
    label: "Livrée",
    color: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Annulée",
    color: "bg-red-50 text-red-600",
    dot: "bg-red-500",
    icon: XCircle,
  },
};

const filters = [
  { value: "all", label: "Toutes" },
  { value: "draft", label: "Brouillons" },
  { value: "pending", label: "En attente" },
  { value: "in_transit", label: "En transit" },
  { value: "delivered", label: "Livrées" },
  { value: "cancelled", label: "Annulées" },
];

const formatMoney = (amount) =>
  new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";

const formatDate = (date) =>
  new Date(date + "T00:00:00").toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ======================================================
// BADGE STATUT
// ======================================================

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${config.color}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}

// ======================================================
// CARTE EXPÉDITION
// ======================================================

function ExpeditionCard({ expedition, onView }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Package size={22} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-800">
              {expedition.reference}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {formatDate(expedition.date)}
            </p>
          </div>
        </div>

        <button
          onClick={() => onView(expedition)}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-violet-600"
          aria-label="Voir l'expédition"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Client */}
      <div className="mt-5 border-b border-slate-100 pb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Client
        </p>
        <p className="mt-1 font-semibold text-slate-800">
          {expedition.client}
        </p>
        <p className="mt-1 truncate text-sm text-slate-500">
          {expedition.email}
        </p>
      </div>

      {/* Trajet */}
      <div className="my-5 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin size={16} className="shrink-0 text-violet-500" />
            <span className="truncate font-semibold">
              {expedition.origin}
            </span>
          </div>
          <p className="ml-6 mt-1 text-xs text-slate-400">Origine</p>
        </div>

        <ArrowRight className="shrink-0 text-slate-300" size={20} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin size={16} className="shrink-0 text-emerald-500" />
            <span className="truncate font-semibold">
              {expedition.destination}
            </span>
          </div>
          <p className="ml-6 mt-1 text-xs text-slate-400">Destination</p>
        </div>
      </div>

      {/* Informations */}
      <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3">
        <div>
          <p className="text-xs text-slate-400">Colis</p>
          <p className="mt-1 font-semibold text-slate-700">
            {expedition.packages}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Poids</p>
          <p className="mt-1 font-semibold text-slate-700">
            {expedition.weight} kg
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Transport</p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-700">
            {expedition.transport}
          </p>
        </div>
      </div>

      {/* Progression */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            Progression
          </span>
          <span className="text-xs font-bold text-slate-700">
            {expedition.progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-violet-600 transition-all"
            style={{ width: `${expedition.progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <StatusBadge status={expedition.status} />

        <p className="font-bold text-slate-800">
          {formatMoney(expedition.amount)}
        </p>
      </div>

      <button
        onClick={() => onView(expedition)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
      >
        <Eye size={16} />
        Voir les détails
      </button>
    </article>
  );
}

// ======================================================
// TABLEAU EXPÉDITIONS
// ======================================================

function ExpeditionTable({ expeditions, onView }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              {[
                "Référence",
                "Client",
                "Trajet",
                "Date",
                "Colis",
                "Montant",
                "Statut",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {expeditions.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 transition hover:bg-slate-50/80 last:border-0"
              >
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Package size={19} />
                    </div>
                    <span className="whitespace-nowrap font-semibold text-slate-800">
                      {item.reference}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-5">
                  <p className="font-medium text-slate-800">
                    {item.client}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.email}
                  </p>
                </td>

                <td className="px-5 py-5">
                  <p className="text-sm text-slate-700">
                    {item.origin}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <ArrowRight size={12} />
                    {item.destination}
                  </p>
                </td>

                <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-600">
                  {formatDate(item.date)}
                </td>

                <td className="px-5 py-5 text-sm text-slate-600">
                  {item.packages}
                </td>

                <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-800">
                  {formatMoney(item.amount)}
                </td>

                <td className="px-5 py-5">
                  <StatusBadge status={item.status} />
                </td>

                <td className="px-5 py-5">
                  <button
                    onClick={() => onView(item)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-violet-50 hover:text-violet-600"
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
  );
}

// ======================================================
// PAGE PRINCIPALE
// ======================================================

export default function ExpeditionsPage() {
  const [expeditions, setExpeditions] = useState(demoExpeditions);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [view, setView] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedExpedition, setSelectedExpedition] = useState(null);

  const [form, setForm] = useState({
    client: "",
    origin: "",
    destination: "",
    packages: 1,
    weight: "",
    service: "Standard",
    amount: "",
    transport: "Aérien",
  });

  // Comptage des statuts
  const counts = useMemo(() => {
    return {
      all: expeditions.length,
      ...Object.keys(statusConfig).reduce((acc, key) => {
        acc[key] = expeditions.filter((e) => e.status === key).length;
        return acc;
      }, {}),
    };
  }, [expeditions]);

  // Recherche et filtrage
  const filteredExpeditions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return expeditions.filter((item) => {
      const matchesSearch = [
        item.reference,
        item.client,
        item.email,
        item.origin,
        item.destination,
        item.service,
        item.transport,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );

      const matchesStatus =
        status === "all" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [expeditions, search, status]);

  // Création locale d'une expédition de démonstration
  const handleAddExpedition = (event) => {
    event.preventDefault();

    const newExpedition = {
      id: Date.now(),
      reference: `EXP-2026-${String(expeditions.length + 1).padStart(3, "0")}`,
      client: form.client,
      email: "À renseigner",
      origin: form.origin,
      destination: form.destination,
      date: new Date().toISOString().slice(0, 10),
      packages: Number(form.packages),
      weight: Number(form.weight),
      service: form.service,
      amount: Number(form.amount),
      currency: "FCFA",
      status: "draft",
      progress: 0,
      transport: form.transport,
    };

    setExpeditions((previous) => [newExpedition, ...previous]);
    setStatus("all");
    setSearch("");
    setShowAddForm(false);

    setForm({
      client: "",
      origin: "",
      destination: "",
      packages: 1,
      weight: "",
      service: "Standard",
      amount: "",
      transport: "Aérien",
    });
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
  };

  return (
    <div className="min-h-full bg-slate-50 p-5 md:p-6">

      {/* ==================================================
          TITRE DE LA PAGE
      ================================================== */}

      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <Package size={22} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              EXPÉDITIONS
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Gérez et suivez toutes les expéditions de votre entreprise.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
        >
          <Plus size={19} />
          Nouvelle expédition
        </button>
      </div>

      {/* ==================================================
          INDICATEURS
      ================================================== */}

      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Total expéditions</span>
            <Package className="text-violet-500" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-800">
            {counts.all}
          </p>
          <p className="mt-1 text-xs text-slate-400">Toutes les opérations</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">En attente</span>
            <Clock className="text-amber-500" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-800">
            {counts.pending}
          </p>
          <p className="mt-1 text-xs text-slate-400">À traiter</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">En transit</span>
            <Truck className="text-blue-500" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-800">
            {counts.in_transit}
          </p>
          <p className="mt-1 text-xs text-slate-400">En cours d'acheminement</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Livrées</span>
            <CheckCircle2 className="text-emerald-500" size={21} />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-800">
            {counts.delivered}
          </p>
          <p className="mt-1 text-xs text-slate-400">Livraisons terminées</p>
        </div>
      </div>

      {/* ==================================================
          RECHERCHE ET FILTRES
      ================================================== */}

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">

        <div className="flex flex-wrap items-center gap-3">

          {/* Search */}
          <div className="relative min-w-[220px] flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une expédition, un client, une destination..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {/* Toggle Filters */}
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
              showFilters
                ? "border-violet-300 bg-violet-50 text-violet-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ArrowUpDown size={17} />
            Filtres
          </button>

          {/* Toggle Grid / List */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              aria-label="Vue en grille"
              onClick={() => setView("grid")}
              className={`rounded-lg p-2.5 transition ${
                view === "grid"
                  ? "bg-violet-600 text-white shadow"
                  : "text-slate-500 hover:bg-white"
              }`}
            >
              <LayoutGrid size={18} />
            </button>

            <button
              type="button"
              aria-label="Vue en liste"
              onClick={() => setView("list")}
              className={`rounded-lg p-2.5 transition ${
                view === "list"
                  ? "bg-violet-600 text-white shadow"
                  : "text-slate-500 hover:bg-white"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Tabs toggle */}
        <div className="mt-5 flex gap-2 overflow-x-auto border-b border-slate-100 pb-3">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatus(filter.value)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                status === filter.value
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {filter.label}

              <span
                className={`rounded-md px-1.5 py-0.5 text-xs ${
                  status === filter.value
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts[filter.value]}
              </span>
            </button>
          ))}
        </div>

        {/* Additional filters */}
        {showFilters && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Filtres actifs
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Statut : {filters.find((f) => f.value === status)?.label}
                {search && ` • Recherche : ${search}`}
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-violet-600 hover:text-violet-800"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* ==================================================
          RÉSULTATS
      ================================================== */}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Affichage de{" "}
          <span className="font-semibold text-slate-800">
            {filteredExpeditions.length}
          </span>{" "}
          sur {expeditions.length} expédition(s)
        </p>

        <span className="text-xs text-slate-400">
          Vue {view === "grid" ? "grille" : "liste"}
        </span>
      </div>

      {filteredExpeditions.length > 0 ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredExpeditions.map((expedition) => (
              <ExpeditionCard
                key={expedition.id}
                expedition={expedition}
                onView={setSelectedExpedition}
              />
            ))}
          </div>
        ) : (
          <ExpeditionTable
            expeditions={filteredExpeditions}
            onView={setSelectedExpedition}
          />
        )
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Package size={27} />
          </div>

          <h3 className="mt-4 font-semibold text-slate-800">
            Aucune expédition trouvée
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Modifiez votre recherche ou choisissez un autre statut.
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 text-sm font-semibold text-violet-600 hover:text-violet-800"
          >
            Réinitialiser la recherche
          </button>
        </div>
      )}

      {/* ==================================================
          MODAL NOUVELLE EXPÉDITION
      ================================================== */}

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Nouvelle expédition
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Renseignez les informations de l'expédition.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleAddExpedition} className="space-y-5 p-6">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Client
                </label>
                <input
                  required
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  placeholder="Nom du client"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Ville de départ
                  </label>
                  <input
                    required
                    value={form.origin}
                    onChange={(e) => setForm({ ...form, origin: e.target.value })}
                    placeholder="Ex : Abidjan"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Destination
                  </label>
                  <input
                    required
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    placeholder="Ex : Paris"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Nombre de colis
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.packages}
                    onChange={(e) => setForm({ ...form, packages: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Poids total (kg)
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    required
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    placeholder="Ex : 25.5"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Type de service
                  </label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                  >
                    <option>Standard</option>
                    <option>Express</option>
                    <option>Économique</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Mode de transport
                  </label>
                  <select
                    value={form.transport}
                    onChange={(e) => setForm({ ...form, transport: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                  >
                    <option>Aérien</option>
                    <option>Routier</option>
                    <option>Maritime</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Montant (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Ex : 150000"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  <Plus size={17} />
                  Créer l'expédition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL DÉTAILS EXPÉDITION
      ================================================== */}

      {selectedExpedition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">
                  Détails de l'expédition
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedExpedition.reference}
                </h2>
              </div>

              <button
                onClick={() => setSelectedExpedition(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5">
              <StatusBadge status={selectedExpedition.status} />
            </div>

            <div className="space-y-4">
              {[
                ["Client", selectedExpedition.client],
                ["Origine", selectedExpedition.origin],
                ["Destination", selectedExpedition.destination],
                ["Date", formatDate(selectedExpedition.date)],
                ["Nombre de colis", selectedExpedition.packages],
                ["Poids", `${selectedExpedition.weight} kg`],
                ["Service", selectedExpedition.service],
                ["Transport", selectedExpedition.transport],
                ["Montant", formatMoney(selectedExpedition.amount)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3"
                >
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="text-right text-sm font-semibold text-slate-800">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedExpedition(null)}
              className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

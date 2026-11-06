
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Package,
  MapPin,
  Weight,
  Box,
  X,
  Eye,
  MoreHorizontal,
  Truck,
  AlertTriangle,
  Thermometer,
  Ruler,
  Container,
  ArrowRight,
  RefreshCcw,
  Tag,
} from "lucide-react";

// ======================================================
// DONNÉES DE DÉMONSTRATION
// Correspondance avec la table Laravel colis
// ======================================================

const demoColis = [
  {
    id: 1,
    uuid: "550e8400-e29b-41d4-a716-446655440001",
    numero_colis: "COL-2026-0001",
    expedition_id: 1,
    expedition: "EXP-2026-001",
    conteneur_id: 1,
    conteneur: "CONT-001",
    type_colis_id: 1,
    type: "Carton",
    designation: "Matériel informatique",
    description: "Ordinateurs et accessoires informatiques",
    quantite: 5,
    longueur: 60,
    largeur: 40,
    hauteur: 35,
    poids: 28.5,
    volume: 0.084,
    valeur_declaree: 750000,
    emballage: "Carton renforcé",
    fragile: true,
    perissable: false,
    instructions: "Manipuler avec précaution",
    notes: "",
  },
  {
    id: 2,
    uuid: "550e8400-e29b-41d4-a716-446655440002",
    numero_colis: "COL-2026-0002",
    expedition_id: 2,
    expedition: "EXP-2026-002",
    conteneur_id: null,
    conteneur: null,
    type_colis_id: 2,
    type: "Palette",
    designation: "Produits alimentaires",
    description: "Produits alimentaires emballés",
    quantite: 12,
    longueur: 120,
    largeur: 100,
    hauteur: 150,
    poids: 85,
    volume: 1.8,
    valeur_declaree: 350000,
    emballage: "Palette filmée",
    fragile: false,
    perissable: true,
    instructions: "Conserver à température adaptée",
    notes: "Livraison rapide",
  },
  {
    id: 3,
    uuid: "550e8400-e29b-41d4-a716-446655440003",
    numero_colis: "COL-2026-0003",
    expedition_id: 1,
    expedition: "EXP-2026-001",
    conteneur_id: 1,
    conteneur: "CONT-001",
    type_colis_id: 1,
    type: "Carton",
    designation: "Téléphones mobiles",
    description: "Smartphones et accessoires",
    quantite: 10,
    longueur: 40,
    largeur: 30,
    hauteur: 25,
    poids: 12,
    volume: 0.03,
    valeur_declaree: 2500000,
    emballage: "Carton sécurisé",
    fragile: true,
    perissable: false,
    instructions: "Ne pas exposer à l'humidité",
    notes: "",
  },
  {
    id: 4,
    uuid: "550e8400-e29b-41d4-a716-446655440004",
    numero_colis: "COL-2026-0004",
    expedition_id: 3,
    expedition: "EXP-2026-003",
    conteneur_id: 2,
    conteneur: "CONT-002",
    type_colis_id: 3,
    type: "Sac",
    designation: "Documents administratifs",
    description: "Dossiers et documents",
    quantite: 2,
    longueur: 35,
    largeur: 25,
    hauteur: 10,
    poids: 5,
    volume: 0.009,
    valeur_declaree: 50000,
    emballage: "Enveloppe sécurisée",
    fragile: false,
    perissable: false,
    instructions: "Garder au sec",
    notes: "",
  },
  {
    id: 5,
    uuid: "550e8400-e29b-41d4-a716-446655440005",
    numero_colis: "COL-2026-0005",
    expedition_id: 4,
    expedition: "EXP-2026-004",
    conteneur_id: null,
    conteneur: null,
    type_colis_id: 1,
    type: "Carton",
    designation: "Pièces automobiles",
    description: "Pièces détachées automobiles",
    quantite: 8,
    longueur: 80,
    largeur: 50,
    hauteur: 40,
    poids: 150,
    volume: 0.16,
    valeur_declaree: 850000,
    emballage: "Carton industriel",
    fragile: false,
    perissable: false,
    instructions: "",
    notes: "",
  },
  {
    id: 6,
    uuid: "550e8400-e29b-41d4-a716-446655440006",
    numero_colis: "COL-2026-0006",
    expedition_id: 5,
    expedition: "EXP-2026-005",
    conteneur_id: 2,
    conteneur: "CONT-002",
    type_colis_id: 2,
    type: "Palette",
    designation: "Produits cosmétiques",
    description: "Produits cosmétiques emballés",
    quantite: 6,
    longueur: 50,
    largeur: 40,
    hauteur: 35,
    poids: 18,
    volume: 0.07,
    valeur_declaree: 420000,
    emballage: "Carton standard",
    fragile: true,
    perissable: false,
    instructions: "Éviter les chocs",
    notes: "",
  },
];

// Références temporaires pour le formulaire
const expeditions = [
  { id: 1, reference: "EXP-2026-001", client: "Jean Kouassi" },
  { id: 2, reference: "EXP-2026-002", client: "Entreprise Ivoire Tech" },
  { id: 3, reference: "EXP-2026-003", client: "Marie N'Guessan" },
  { id: 4, reference: "EXP-2026-004", client: "Société Bâtir CI" },
  { id: 5, reference: "EXP-2026-005", client: "Paul Yao" },
];

const conteneurs = [
  { id: 1, reference: "CONT-001" },
  { id: 2, reference: "CONT-002" },
];

const typesColis = [
  { id: 1, label: "Carton" },
  { id: 2, label: "Palette" },
  { id: 3, label: "Sac" },
  { id: 4, label: "Caisse" },
];

// ======================================================
// HELPERS
// ======================================================

const formatMoney = (value) =>
  value == null
    ? "—"
    : new Intl.NumberFormat("fr-FR").format(value) + " FCFA";

const formatNumber = (value, digits = 2) =>
  value == null
    ? "—"
    : Number(value).toLocaleString("fr-FR", {
        maximumFractionDigits: digits,
      });

const getDimensions = (item) => {
  if (
    item.longueur == null ||
    item.largeur == null ||
    item.hauteur == null
  ) {
    return "Non renseignées";
  }

  return `${item.longueur} × ${item.largeur} × ${item.hauteur} cm`;
};

// ======================================================
// BADGE
// ======================================================

function FlagBadge({ active, label, color }) {
  if (!active) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}

// ======================================================
// CARTE COLIS
// ======================================================

function ColisCard({ colis, onView }) {
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
              {colis.numero_colis}
            </h3>
            <p className="mt-1 truncate text-xs text-slate-400">
              {colis.expedition}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onView(colis)}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-violet-600"
          aria-label="Voir le colis"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Désignation */}
      <div className="mt-5">
        <h4 className="text-lg font-semibold text-slate-800">
          {colis.designation || "Sans désignation"}
        </h4>

        <p className="mt-1 line-clamp-2 min-h-10 text-sm text-slate-500">
          {colis.description || "Aucune description"}
        </p>
      </div>

      {/* Flags */}
      <div className="mt-4 flex flex-wrap gap-2">
        <FlagBadge
          active={colis.fragile}
          label="Fragile"
          color="bg-amber-50 text-amber-700"
        />

        <FlagBadge
          active={colis.perissable}
          label="Périssable"
          color="bg-rose-50 text-rose-600"
        />

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {colis.type || "Non défini"}
        </span>
      </div>

      {/* Informations */}
      <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4">
        <div>
          <p className="text-xs text-slate-400">Quantité</p>
          <p className="mt-1 font-semibold text-slate-800">
            {colis.quantite}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Poids</p>
          <p className="mt-1 font-semibold text-slate-800">
            {formatNumber(colis.poids, 3)} kg
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Volume</p>
          <p className="mt-1 font-semibold text-slate-800">
            {colis.volume != null
              ? `${formatNumber(colis.volume, 4)} m³`
              : "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Emballage</p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-800">
            {colis.emballage || "—"}
          </p>
        </div>
      </div>

      {/* Conteneur */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm text-slate-500">
          <Container size={16} />
          Conteneur
        </span>

        {colis.conteneur ? (
          <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
            {colis.conteneur}
          </span>
        ) : (
          <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
            Non affecté
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-400">Valeur déclarée</p>
          <p className="mt-1 font-bold text-slate-800">
            {formatMoney(colis.valeur_declaree)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onView(colis)}
          className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-800"
        >
          Détails
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

// ======================================================
// TABLEAU COLIS
// ======================================================

function ColisTable({ colis, onView }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">

          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              {[
                "Numéro / Désignation",
                "Expédition",
                "Type",
                "Poids",
                "Quantité",
                "Conteneur",
                "Valeur déclarée",
                "Caractéristiques",
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
            {colis.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 transition hover:bg-slate-50/80 last:border-0"
              >
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Package size={19} />
                    </div>

                    <div>
                      <p className="whitespace-nowrap font-semibold text-slate-800">
                        {item.numero_colis}
                      </p>
                      <p className="mt-1 max-w-48 truncate text-xs text-slate-500">
                        {item.designation || "Sans désignation"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-5">
                  <span className="whitespace-nowrap text-sm font-medium text-violet-600">
                    {item.expedition}
                  </span>
                </td>

                <td className="px-5 py-5 text-sm text-slate-600">
                  {item.type || "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-700">
                  {formatNumber(item.poids, 3)} kg
                </td>

                <td className="px-5 py-5 text-sm text-slate-600">
                  {item.quantite}
                </td>

                <td className="px-5 py-5">
                  {item.conteneur ? (
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600">
                      {item.conteneur}
                    </span>
                  ) : (
                    <span className="text-xs text-amber-600">
                      Non affecté
                    </span>
                  )}
                </td>

                <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-700">
                  {formatMoney(item.valeur_declaree)}
                </td>

                <td className="px-5 py-5">
                  <div className="flex flex-wrap gap-1">
                    {item.fragile && (
                      <span className="rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700">
                        Fragile
                      </span>
                    )}

                    {item.perissable && (
                      <span className="rounded-md bg-rose-50 px-2 py-1 text-xs text-rose-600">
                        Périssable
                      </span>
                    )}

                    {!item.fragile && !item.perissable && (
                      <span className="text-xs text-slate-400">Standard</span>
                    )}
                  </div>
                </td>

                <td className="px-5 py-5">
                  <button
                    type="button"
                    onClick={() => onView(item)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
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

export default function Colis() {
  const [colis, setColis] = useState(demoColis);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedColis, setSelectedColis] = useState(null);

  const initialForm = {
    expedition_id: "",
    conteneur_id: "",
    type_colis_id: "",
    designation: "",
    description: "",
    quantite: 1,
    longueur: "",
    largeur: "",
    hauteur: "",
    poids: "",
    valeur_declaree: "",
    emballage: "",
    fragile: false,
    perissable: false,
    instructions: "",
    notes: "",
  };

  const [form, setForm] = useState(initialForm);

  // ====================================================
  // INDICATEURS
  // ====================================================

  const stats = useMemo(() => {
    return {
      total: colis.length,

      weight: colis.reduce(
        (sum, item) => sum + Number(item.poids || 0),
        0
      ),

      fragile: colis.filter((item) => item.fragile).length,

      unassigned: colis.filter(
        (item) => !item.conteneur_id
      ).length,

      perishable: colis.filter((item) => item.perissable).length,
    };
  }, [colis]);

  // ====================================================
  // FILTRAGE
  // ====================================================

  const filteredColis = useMemo(() => {
    const term = search.trim().toLowerCase();

    return colis.filter((item) => {
      const matchesSearch = [
        item.numero_colis,
        item.designation,
        item.description,
        item.expedition,
        item.conteneur,
        item.type,
        item.emballage,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );

      let matchesFilter = true;

      switch (filter) {
        case "unassigned":
          matchesFilter = !item.conteneur_id;
          break;

        case "assigned":
          matchesFilter = Boolean(item.conteneur_id);
          break;

        case "fragile":
          matchesFilter = item.fragile;
          break;

        case "perishable":
          matchesFilter = item.perissable;
          break;

        default:
          matchesFilter = true;
      }

      return matchesSearch && matchesFilter;
    });
  }, [colis, search, filter]);

  // ====================================================
  // COMPTEURS DES ONGLETS
  // ====================================================

  const filters = [
    {
      value: "all",
      label: "Tous les colis",
      count: stats.total,
    },
    {
      value: "unassigned",
      label: "Sans conteneur",
      count: stats.unassigned,
    },
    {
      value: "assigned",
      label: "Affectés",
      count: stats.total - stats.unassigned,
    },
    {
      value: "fragile",
      label: "Fragiles",
      count: stats.fragile,
    },
    {
      value: "perishable",
      label: "Périssables",
      count: stats.perishable,
    },
  ];

  // ====================================================
  // CRÉATION LOCALE
  // ====================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    const expedition = expeditions.find(
      (item) => item.id === Number(form.expedition_id)
    );

    const conteneur = conteneurs.find(
      (item) => item.id === Number(form.conteneur_id)
    );

    const type = typesColis.find(
      (item) => item.id === Number(form.type_colis_id)
    );

    const longueur = Number(form.longueur) || null;
    const largeur = Number(form.largeur) || null;
    const hauteur = Number(form.hauteur) || null;

    const volume =
      longueur && largeur && hauteur
        ? Number(
            ((longueur * largeur * hauteur) / 1000000).toFixed(4)
          )
        : null;

    const newColis = {
      id: Date.now(),
      uuid: crypto.randomUUID(),
      numero_colis: `COL-${new Date().getFullYear()}-${String(
        colis.length + 1
      ).padStart(4, "0")}`,

      expedition_id: Number(form.expedition_id),
      expedition: expedition?.reference || "—",

      conteneur_id: form.conteneur_id
        ? Number(form.conteneur_id)
        : null,
      conteneur: conteneur?.reference || null,

      type_colis_id: form.type_colis_id
        ? Number(form.type_colis_id)
        : null,
      type: type?.label || null,

      designation: form.designation,
      description: form.description,
      quantite: Number(form.quantite),
      longueur,
      largeur,
      hauteur,
      poids: Number(form.poids),
      volume,
      valeur_declaree: form.valeur_declaree
        ? Number(form.valeur_declaree)
        : null,
      emballage: form.emballage,
      fragile: form.fragile,
      perissable: form.perissable,
      instructions: form.instructions,
      notes: form.notes,
    };

    setColis((previous) => [newColis, ...previous]);
    setFilter("all");
    setSearch("");
    setForm(initialForm);
    setShowForm(false);
  };

  const resetFilters = () => {
    setSearch("");
    setFilter("all");
  };

  // ====================================================
  // RENDU
  // ====================================================

  return (
    <div className="min-h-full bg-slate-50 p-5 md:p-6">

      {/* ================================================
          HEADER
      ================================================ */}

      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <Package size={22} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              COLIS
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Gérez les colis, leurs caractéristiques et leur affectation aux conteneurs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
        >
          <Plus size={19} />
          Nouveau colis
        </button>
      </div>

      {/* ================================================
          STATISTIQUES
      ================================================ */}

      <div className="mb-7 grid grid-cols-2 gap-4 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Total colis</span>
            <Package size={21} className="text-violet-500" />
          </div>

          <p className="mt-3 text-2xl font-bold text-slate-800">
            {stats.total}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Colis enregistrés
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Poids total</span>
            <Weight size={21} className="text-blue-500" />
          </div>

          <p className="mt-3 text-2xl font-bold text-slate-800">
            {formatNumber(stats.weight, 3)} kg
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Poids cumulé
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Colis fragiles</span>
            <AlertTriangle size={21} className="text-amber-500" />
          </div>

          <p className="mt-3 text-2xl font-bold text-slate-800">
            {stats.fragile}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Manipulation délicate
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Non affectés</span>
            <Container size={21} className="text-orange-500" />
          </div>

          <p className="mt-3 text-2xl font-bold text-slate-800">
            {stats.unassigned}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Sans conteneur
          </p>
        </div>
      </div>

      {/* ================================================
          RECHERCHE ET FILTRES
      ================================================ */}

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">

        <div className="flex flex-wrap items-center gap-3">

          <div className="relative min-w-[220px] flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par numéro, désignation, expédition..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
              showFilters
                ? "border-violet-300 bg-violet-50 text-violet-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <RefreshCcw size={17} />
            Filtres
          </button>

          {/* Toggle Grid / List */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Vue grille"
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
              onClick={() => setView("list")}
              aria-label="Vue liste"
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

        {/* Tabs */}
        <div className="mt-5 flex gap-2 overflow-x-auto border-b border-slate-100 pb-3">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                filter === item.value
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {item.label}

              <span
                className={`rounded-md px-1.5 py-0.5 text-xs ${
                  filter === item.value
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Filtres actifs
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {filters.find((item) => item.value === filter)?.label}
                {search && ` • Recherche : ${search}`}
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-violet-600 hover:text-violet-800"
            >
              Réinitialiser
            </button>
          </div>
        )}
      </div>

      {/* ================================================
          LISTE DES RÉSULTATS
      ================================================ */}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Affichage de{" "}
          <strong className="text-slate-800">
            {filteredColis.length}
          </strong>{" "}
          sur {colis.length} colis
        </p>

        <span className="text-xs text-slate-400">
          Vue {view === "grid" ? "grille" : "liste"}
        </span>
      </div>

      {filteredColis.length > 0 ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredColis.map((item) => (
              <ColisCard
                key={item.id}
                colis={item}
                onView={setSelectedColis}
              />
            ))}
          </div>
        ) : (
          <ColisTable
            colis={filteredColis}
            onView={setSelectedColis}
          />
        )
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Package size={27} />
          </div>

          <h3 className="mt-4 font-semibold text-slate-800">
            Aucun colis trouvé
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Modifiez votre recherche ou choisissez un autre filtre.
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 text-sm font-semibold text-violet-600 hover:text-violet-800"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* ================================================
          MODAL NOUVEAU COLIS
      ================================================ */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">

          <div className="my-auto w-full max-w-3xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Nouveau colis
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enregistrez les informations et caractéristiques du colis.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[75vh] space-y-6 overflow-y-auto p-6"
            >

              {/* Relations */}
              <section>
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
                  <Truck size={18} className="text-violet-600" />
                  Rattachement
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Expédition <span className="text-red-500">*</span>
                    </label>

                    <select
                      required
                      value={form.expedition_id}
                      onChange={(e) =>
                        setForm({ ...form, expedition_id: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                    >
                      <option value="">Sélectionner une expédition</option>

                      {expeditions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.reference} — {item.client}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Conteneur
                    </label>

                    <select
                      value={form.conteneur_id}
                      onChange={(e) =>
                        setForm({ ...form, conteneur_id: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                    >
                      <option value="">Non affecté</option>

                      {conteneurs.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.reference}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>
              </section>

              <div className="border-t border-slate-100" />

              {/* Informations générales */}
              <section>
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
                  <Package size={18} className="text-violet-600" />
                  Informations générales
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Désignation <span className="text-red-500">*</span>
                    </label>

                    <input
                      required
                      value={form.designation}
                      onChange={(e) =>
                        setForm({ ...form, designation: e.target.value })
                      }
                      placeholder="Ex : Matériel informatique"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Description
                    </label>

                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Description détaillée du colis..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Type de colis
                    </label>

                    <select
                      value={form.type_colis_id}
                      onChange={(e) =>
                        setForm({ ...form, type_colis_id: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                    >
                      <option value="">Sélectionner un type</option>

                      {typesColis.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Emballage
                    </label>

                    <input
                      value={form.emballage}
                      onChange={(e) =>
                        setForm({ ...form, emballage: e.target.value })
                      }
                      placeholder="Ex : Carton renforcé"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Quantité
                    </label>

                    <input
                      type="number"
                      min="1"
                      required
                      value={form.quantite}
                      onChange={(e) =>
                        setForm({ ...form, quantite: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Poids (kg)
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      required
                      value={form.poids}
                      onChange={(e) =>
                        setForm({ ...form, poids: e.target.value })
                      }
                      placeholder="Ex : 25.500"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                    />
                  </div>

                </div>
              </section>

              <div className="border-t border-slate-100" />

              {/* Dimensions */}
              <section>
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
                  <Ruler size={18} className="text-violet-600" />
                  Dimensions (cm)
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["longueur", "Longueur"],
                    ["largeur", "Largeur"],
                    ["hauteur", "Hauteur"],
                  ].map(([field, label]) => (
                    <div key={field}>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        {label}
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form[field]}
                        onChange={(e) =>
                          setForm({ ...form, [field]: e.target.value })
                        }
                        placeholder="0"
                        className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-violet-400"
                      />
                    </div>
                  ))}
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Le volume sera calculé automatiquement à partir des trois dimensions renseignées.
                </p>
              </section>

              <div className="border-t border-slate-100" />

              {/* Valeur et précautions */}
              <section>
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
                  <Tag size={18} className="text-violet-600" />
                  Valeur et précautions
                </h3>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Valeur déclarée (FCFA)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.valeur_declaree}
                    onChange={(e) =>
                      setForm({ ...form, valeur_declaree: e.target.value })
                    }
                    placeholder="Ex : 250000"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-amber-50">
                    <input
                      type="checkbox"
                      checked={form.fragile}
                      onChange={(e) =>
                        setForm({ ...form, fragile: e.target.checked })
                      }
                      className="h-4 w-4 accent-violet-600"
                    />

                    <div className="flex items-center gap-2">
                      <AlertTriangle size={18} className="text-amber-500" />
                      <span className="text-sm font-medium text-slate-700">
                        Colis fragile
                      </span>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-rose-50">
                    <input
                      type="checkbox"
                      checked={form.perissable}
                      onChange={(e) =>
                        setForm({ ...form, perissable: e.target.checked })
                      }
                      className="h-4 w-4 accent-violet-600"
                    />

                    <div className="flex items-center gap-2">
                      <Thermometer size={18} className="text-rose-500" />
                      <span className="text-sm font-medium text-slate-700">
                        Produit périssable
                      </span>
                    </div>
                  </label>

                </div>
              </section>

              {/* Instructions */}
              <section>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Instructions de manipulation
                </label>

                <textarea
                  rows={2}
                  value={form.instructions}
                  onChange={(e) =>
                    setForm({ ...form, instructions: e.target.value })
                  }
                  placeholder="Instructions particulières..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                />

                <label className="mb-2 mt-4 block text-sm font-medium text-slate-700">
                  Notes internes
                </label>

                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  placeholder="Notes complémentaires..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                />
              </section>

              {/* Actions */}
              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  <Plus size={17} />
                  Enregistrer le colis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================
          MODAL DÉTAILS COLIS
      ================================================ */}

      {selectedColis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">

          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Fiche détaillée du colis
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedColis.numero_colis}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedColis(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              <FlagBadge
                active={selectedColis.fragile}
                label="Fragile"
                color="bg-amber-50 text-amber-700"
              />

              <FlagBadge
                active={selectedColis.perissable}
                label="Périssable"
                color="bg-rose-50 text-rose-600"
              />
            </div>

            <div className="space-y-5">

              <section>
                <h3 className="mb-3 font-semibold text-slate-800">
                  Informations générales
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Désignation", selectedColis.designation],
                    ["Type", selectedColis.type],
                    ["Expédition", selectedColis.expedition],
                    ["Conteneur", selectedColis.conteneur || "Non affecté"],
                    ["Quantité", selectedColis.quantite],
                    ["Emballage", selectedColis.emballage],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                        {value || "—"}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Description</p>
                  <p className="mt-1 text-sm text-slate-700">
                    {selectedColis.description || "Aucune description"}
                  </p>
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-slate-800">
                  Dimensions et poids
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Dimensions", getDimensions(selectedColis)],
                    ["Poids", `${formatNumber(selectedColis.poids, 3)} kg`],
                    [
                      "Volume",
                      selectedColis.volume != null
                        ? `${formatNumber(selectedColis.volume, 4)} m³`
                        : "—",
                    ],
                    [
                      "Valeur déclarée",
                      formatMoney(selectedColis.valeur_declaree),
                    ],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 font-semibold text-slate-800">
                  Instructions et notes
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-400">Instructions</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {selectedColis.instructions || "Aucune instruction"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Notes internes</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {selectedColis.notes || "Aucune note"}
                    </p>
                  </div>
                </div>
              </section>

            </div>

            <button
              type="button"
              onClick={() => setSelectedColis(null)}
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

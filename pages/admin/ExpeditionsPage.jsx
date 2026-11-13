import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  PlusCircle,
  Search,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  X,
  Package,
  Truck,
  UserRound,
  Box,
  CalendarDays,
  MapPin,
  Weight,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import http from "../../services/api/http";
import expeditionService from "../../services/api/expeditionService";

const PAGE_SIZE = 8;

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50";

const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50";

const emptyForm = () => ({
  numero_suivi: "",
  client_id: "",
  statut_id: "",
  service_id: "",
  adresse_expediteur_id: "",
  adresse_destinataire_id: "",
  objet: "",
  description: "",
  date_expedition: "",
  date_livraison_prevue: "",
  montant_total: "",
  montant_paye: "",
  instructions: "",
  notes: "",
  colis: [newPackage()],
});

function newPackage() {
  return {
    type_colis_id: "",
    designation: "",
    quantite: 1,
    longueur: "",
    largeur: "",
    hauteur: "",
    poids: "",
    valeur_declaree: "",
    fragile: false,
    perissable: false,
    instructions: "",
    notes: "",
  };
}

function extractRows(response) {
  const root = response?.data ?? response;
  const nested = root?.data ?? root;

  if (Array.isArray(nested)) return nested;
  if (Array.isArray(nested?.data)) return nested.data;

  return [];
}

function extractOne(response) {
  const root = response?.data ?? response;
  return root?.data ?? root;
}

function toNumberOrNull(value) {
  if (value === "" || value === null || value === undefined) return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("fr-FR");
}

function formatMoney(value) {
  if (value === null || value === undefined || value === "") return "—";

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function getClientName(client) {
  const personne = client?.personne;

  return (
    client?.raison_sociale ||
    client?.nom_complet ||
    personne?.nom_complet ||
    [personne?.prenom, personne?.nom].filter(Boolean).join(" ") ||
    client?.name ||
    `Client #${client?.id}`
  );
}

function getStatusName(item) {
  return (
    item?.statut?.libelle ||
    item?.statut?.name ||
    item?.statut?.nom ||
    item?.statut?.titre ||
    "Non défini"
  );
}

function getAddressName(address) {
  if (!address) return "—";

  return (
    address?.libelle ||
    address?.adresse_complete ||
    address?.adresse ||
    [
      address?.ligne1,
      address?.commune?.nom,
      address?.ville?.nom,
    ]
      .filter(Boolean)
      .join(", ") ||
    `Adresse #${address?.id}`
  );
}

function Field({ label, required = false, children, className = "" }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function Modal({ title, subtitle, onClose, children, size = "max-w-4xl", actions }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6">
      <div
        className={`flex max-h-[94vh] w-full ${size} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>

          {actions}

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

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

export default function ExpeditionsPage() {
  const [expeditions, setExpeditions] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [statuts, setStatuts] = useState([]);
  const [adresses, setAdresses] = useState([]);
  const [typesColis, setTypesColis] = useState([]);
  const [conteneurs, setConteneurs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [catalogueLoading, setCatalogueLoading] = useState(false);

  const [error, setError] = useState("");
  const [catalogueWarning, setCatalogueWarning] = useState("");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedExpedition, setSelectedExpedition] = useState(null);

  const [showClientModal, setShowClientModal] = useState(false);
  const [showConteneurModal, setShowConteneurModal] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const [clientForm, setClientForm] = useState({
    type_client: "particulier",
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    raison_sociale: "",
    numero_contribuable: "",
    email_facturation: "",
    telephone_facturation: "",
  });

  const [conteneurForm, setConteneurForm] = useState({
    numero: "",
    nom: "",
    description: "",
    capacite_poids: "",
    capacite_volume: "",
  });

  const [clientSaving, setClientSaving] = useState(false);
  const [conteneurSaving, setConteneurSaving] = useState(false);

  const loadExpeditions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await expeditionService.getAll({
        per_page: 100,
      });

      setExpeditions(
        Array.isArray(result) ? result : result?.data ?? []
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Impossible de charger les expéditions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCatalogues = useCallback(async () => {
    setCatalogueLoading(true);
    setCatalogueWarning("");

    const endpoints = [
      ["clients", "/clients"],
      ["services", "/services"],
      ["statuts", "/expedition-statuts"],
      ["adresses", "/adresses"],
      ["typesColis", "/types-colis"],
      ["conteneurs", "/conteneurs"],
    ];

    const results = await Promise.allSettled(
      endpoints.map(([, path]) => http.get(path))
    );

    const setters = {
      clients: setClients,
      services: setServices,
      statuts: setStatuts,
      adresses: setAdresses,
      typesColis: setTypesColis,
      conteneurs: setConteneurs,
    };

    const errors = [];

    results.forEach((result, index) => {
      const [name, path] = endpoints[index];

      if (result.status === "fulfilled") {
        setters[name](extractRows(result.value));
      } else {
        setters[name]([]);
        errors.push(path);
      }
    });

    if (errors.length) {
      setCatalogueWarning(
        `Certains catalogues sont indisponibles : ${errors.join(", ")}.`
      );
    }

    setCatalogueLoading(false);
  }, []);

  useEffect(() => {
    loadExpeditions();
    loadCatalogues();
  }, [loadExpeditions, loadCatalogues]);

  const updateForm = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const updatePackage = (index, name, value) => {
    setForm((previous) => ({
      ...previous,
      colis: previous.colis.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      ),
    }));
  };

  const addColis = () => {
    setForm((previous) => ({
      ...previous,
      colis: [...previous.colis, newPackage()],
    }));
  };

  const removeColis = (index) => {
    setForm((previous) => ({
      ...previous,
      colis:
        previous.colis.length <= 1
          ? previous.colis
          : previous.colis.filter((_, i) => i !== index),
    }));
  };

  const totals = useMemo(() => {
    return form.colis.reduce(
      (acc, item) => {
        const quantity = Math.max(0, Number(item.quantite) || 0);
        const weight = Math.max(0, Number(item.poids) || 0);

        acc.quantity += quantity;
        acc.weight += quantity * weight;

        const length = Number(item.longueur) || 0;
        const width = Number(item.largeur) || 0;
        const height = Number(item.hauteur) || 0;

        if (length && width && height) {
          acc.volume +=
            (length * width * height * quantity) / 1_000_000;
        }

        return acc;
      },
      { quantity: 0, weight: 0, volume: 0 }
    );
  }, [form.colis]);

  const filteredExpeditions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return expeditions.filter((item) => {
      const clientName = getClientName(item.client).toLowerCase();
      const statusName = getStatusName(item).toLowerCase();

      const matchesSearch =
        !term ||
        String(item.numero_suivi || "").toLowerCase().includes(term) ||
        clientName.includes(term) ||
        statusName.includes(term);

      const matchesStatus =
        filterStatus === "all" ||
        String(item.statut_id) === String(filterStatus);

      return matchesSearch && matchesStatus;
    });
  }, [expeditions, search, filterStatus]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredExpeditions.length / PAGE_SIZE)
  );

  const paginatedExpeditions = filteredExpeditions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus]);

  const statusColor = (name) => {
    const value = String(name || "").toLowerCase();

    if (value.includes("livr")) {
      return "bg-emerald-50 text-emerald-700";
    }

    if (value.includes("annul")) {
      return "bg-red-50 text-red-700";
    }

    if (value.includes("cours") || value.includes("transit")) {
      return "bg-blue-50 text-blue-700";
    }

    if (value.includes("attente")) {
      return "bg-amber-50 text-amber-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  const resetForm = () => {
    setForm(emptyForm());
  };

  const handleCreateExpedition = async (event) => {
    event.preventDefault();
    setError("");

    if (!statuts.length) {
      setError(
        "Création impossible : la liste des statuts est indisponible. Vérifie la route /api/v1/expedition-statuts."
      );
      return;
    }

    if (!form.statut_id) {
      setError("Veuillez sélectionner un statut.");
      return;
    }

    if (!form.client_id) {
      setError("Veuillez sélectionner un client.");
      return;
    }

    if (!form.numero_suivi.trim()) {
      setError("Le numéro de suivi est obligatoire.");
      return;
    }

    if (!form.colis.length) {
      setError("Ajoutez au moins un colis.");
      return;
    }

    for (let index = 0; index < form.colis.length; index += 1) {
      const item = form.colis[index];

      if (!item.quantite || Number(item.quantite) < 1) {
        setError(`La quantité du colis ${index + 1} doit être au moins égale à 1.`);
        return;
      }

      if (item.poids === "" || Number(item.poids) < 0) {
        setError(`Le poids du colis ${index + 1} est obligatoire et doit être positif ou nul.`);
        return;
      }
    }

    const payload = {
      numero_suivi: form.numero_suivi.trim(),
      client_id: Number(form.client_id),
      statut_id: Number(form.statut_id),
      service_id: toNumberOrNull(form.service_id),
      adresse_expediteur_id: toNumberOrNull(form.adresse_expediteur_id),
      adresse_destinataire_id: toNumberOrNull(form.adresse_destinataire_id),
      objet: form.objet.trim() || null,
      description: form.description.trim() || null,
      date_expedition: form.date_expedition || null,
      date_livraison_prevue: form.date_livraison_prevue || null,
      montant_total: toNumberOrNull(form.montant_total),
      montant_paye: toNumberOrNull(form.montant_paye),
      instructions: form.instructions.trim() || null,
      notes: form.notes.trim() || null,

      colis: form.colis.map((item) => ({
        type_colis_id: toNumberOrNull(item.type_colis_id),
        designation: item.designation.trim() || null,
        quantite: Number(item.quantite),
        longueur: toNumberOrNull(item.longueur),
        largeur: toNumberOrNull(item.largeur),
        hauteur: toNumberOrNull(item.hauteur),
        poids: Number(item.poids),
        valeur_declaree: toNumberOrNull(item.valeur_declaree),
        fragile: Boolean(item.fragile),
        perissable: Boolean(item.perissable),
        instructions: item.instructions.trim() || null,
        notes: item.notes.trim() || null,
      })),
    };

    setSaving(true);

    try {
      await expeditionService.create(payload);

      setShowAddForm(false);
      resetForm();

      await loadExpeditions();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Une erreur est survenue lors de la création de l'expédition."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCreateClient = async (event) => {
    event.preventDefault();

    setClientSaving(true);
    setError("");

    try {
      const payload = {
        ...clientForm,
        nom: clientForm.nom.trim(),
        prenom: clientForm.prenom.trim() || null,
        telephone: clientForm.telephone.trim(),
        email: clientForm.email.trim(),
        raison_sociale:
          clientForm.type_client === "entreprise"
            ? clientForm.raison_sociale.trim()
            : null,
        numero_contribuable:
          clientForm.numero_contribuable.trim() || null,
        email_facturation:
          clientForm.email_facturation.trim() || null,
        telephone_facturation:
          clientForm.telephone_facturation.trim() || null,
      };

      const response = await http.post("/clients", payload);
      const created = extractOne(response);

      await loadCatalogues();

      if (created?.id) {
        updateForm("client_id", String(created.id));
      }

      setShowClientModal(false);
      setClientForm({
        type_client: "particulier",
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        raison_sociale: "",
        numero_contribuable: "",
        email_facturation: "",
        telephone_facturation: "",
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Impossible de créer le client. Vérifiez la validation du ClientController."
      );
    } finally {
      setClientSaving(false);
    }
  };

  const handleCreateConteneur = async (event) => {
    event.preventDefault();

    setConteneurSaving(true);
    setError("");

    try {
      const payload = {
        numero: conteneurForm.numero.trim(),
        nom: conteneurForm.nom.trim() || null,
        description: conteneurForm.description.trim() || null,
        capacite_poids: toNumberOrNull(conteneurForm.capacite_poids),
        capacite_volume: toNumberOrNull(conteneurForm.capacite_volume),
      };

      await http.post("/conteneurs", payload);

      await loadCatalogues();

      setShowConteneurModal(false);
      setConteneurForm({
        numero: "",
        nom: "",
        description: "",
        capacite_poids: "",
        capacite_volume: "",
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Impossible de créer le conteneur. Vérifiez les champs attendus par le ConteneurController."
      );
    } finally {
      setConteneurSaving(false);
    }
  };

  const openDetails = (item) => {
    setSelectedExpedition(item);
    setShowDetails(true);
  };

  const renderExpeditionCard = (item) => (
    <div
      key={item.id}
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
            <Package size={21} />
          </div>

          <div className="min-w-0">
            <p className="truncate font-bold text-slate-900">
              {item.numero_suivi || `Expédition #${item.id}`}
            </p>
            <p className="mt-1 truncate text-sm text-slate-500">
              {getClientName(item.client)}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
            getStatusName(item)
          )}`}
        >
          {getStatusName(item)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-400">Date d'expédition</p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {formatDate(item.date_expedition || item.created_at)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Poids total</p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {item.poids_total ?? "—"} kg
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-sm font-semibold text-slate-800">
          {formatMoney(item.montant_total)}
        </span>

        <button
          type="button"
          onClick={() => openDetails(item)}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50"
        >
          <Eye size={16} />
          Détails
        </button>
      </div>
    </div>
  );

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
            onClick={() => {
              loadExpeditions();
              loadCatalogues();
            }}
            className={buttonSecondary}
          >
            <RefreshCw size={17} />
            Actualiser
          </button>

          <button
            type="button"
            onClick={() => {
              setError("");
              setShowAddForm(true);
            }}
            className={buttonPrimary}
          >
            <Plus size={18} />
            Nouvelle expédition
          </button>
        </div>
      </div>

      {/* Erreurs et avertissements */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <p className="flex-1">{error}</p>
          <button type="button" onClick={() => setError("")}>
            <X size={17} />
          </button>
        </div>
      )}

      {catalogueWarning && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {catalogueWarning}
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total expéditions"
          value={expeditions.length}
          icon={Package}
          color="bg-violet-50 text-violet-600"
        />

        <StatCard
          title="En transit"
          value={expeditions.filter((item) =>
            getStatusName(item).toLowerCase().includes("transit")
          ).length}
          icon={Truck}
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Livrées"
          value={expeditions.filter((item) =>
            getStatusName(item).toLowerCase().includes("livr")
          ).length}
          icon={CheckCircle2}
          color="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Clients"
          value={clients.length}
          icon={UserRound}
          color="bg-amber-50 text-amber-600"
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
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher par numéro, client ou statut..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
              className={`${inputClass} min-w-44`}
            >
              <option value="all">Tous les statuts</option>
              {statuts.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.libelle ||
                    status.name ||
                    status.nom ||
                    status.titre ||
                    `Statut #${status.id}`}
                </option>
              ))}
            </select>

            <div className="flex rounded-xl border border-slate-200 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg p-2 ${
                  viewMode === "grid"
                    ? "bg-violet-100 text-violet-700"
                    : "text-slate-400"
                }`}
                aria-label="Vue cartes"
              >
                <LayoutGrid size={18} />
              </button>

              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`rounded-lg p-2 ${
                  viewMode === "list"
                    ? "bg-violet-100 text-violet-700"
                    : "text-slate-400"
                }`}
                aria-label="Vue tableau"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex items-center justify-center rounded-2xl bg-white p-16 text-slate-500">
          <LoaderCircle className="mr-3 animate-spin" size={22} />
          Chargement des expéditions...
        </div>
      ) : filteredExpeditions.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <Package className="mx-auto text-slate-300" size={42} />
          <h3 className="mt-4 font-semibold text-slate-800">
            Aucune expédition trouvée
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Modifiez vos filtres ou créez une nouvelle expédition.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {paginatedExpeditions.map(renderExpeditionCard)}
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
                  <th className="px-5 py-4">Montant</th>
                  <th className="px-5 py-4">Statut</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {paginatedExpeditions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {item.numero_suivi || `#${item.id}`}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {getClientName(item.client)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(item.date_expedition || item.created_at)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {item.poids_total ?? "—"} kg
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatMoney(item.montant_total)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                          getStatusName(item)
                        )}`}
                      >
                        {getStatusName(item)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openDetails(item)}
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

      {/* Pagination */}
      {!loading && filteredExpeditions.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-slate-500">
            {filteredExpeditions.length} expédition(s) — Page {currentPage} sur{" "}
            {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((page) => page - 1)}
              className={buttonSecondary}
            >
              <ChevronLeft size={17} />
              Précédent
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
              className={buttonSecondary}
            >
              Suivant
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}

      {/* Modal création expédition */}
      {showAddForm && (
        <Modal
          title="Nouvelle expédition"
          subtitle="Renseignez les informations du transport et ajoutez les colis."
          onClose={() => !saving && setShowAddForm(false)}
          size="max-w-6xl"
          actions={
            <button
              type="button"
              onClick={addColis}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 sm:px-4"
            >
              <PlusCircle size={17} />
              <span className="hidden sm:inline">Ajouter un colis</span>
              <span className="sm:hidden">Colis</span>
            </button>
          }
        >
          <form onSubmit={handleCreateExpedition} className="space-y-7">
            {/* Informations générales */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                <Package className="text-violet-600" size={19} />
                Informations générales
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Numéro de suivi" required>
                  <input
                    required
                    value={form.numero_suivi}
                    onChange={(event) =>
                      updateForm("numero_suivi", event.target.value)
                    }
                    placeholder="Ex. AT-2026-00001"
                    className={inputClass}
                  />
                </Field>

                <Field label="Client" required>
                  <div className="flex gap-2">
                    <select
                      required
                      value={form.client_id}
                      onChange={(event) =>
                        updateForm("client_id", event.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Sélectionner un client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {getClientName(client)}
                          {client.code_client
                            ? ` — ${client.code_client}`
                            : ""}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setShowClientModal(true)}
                      className="shrink-0 rounded-xl bg-violet-100 px-3 text-violet-700 hover:bg-violet-200"
                      title="Créer un client"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </Field>

                <Field label="Statut" required>
                  <select
                    required
                    value={form.statut_id}
                    onChange={(event) =>
                      updateForm("statut_id", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Sélectionner un statut</option>
                    {statuts.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.libelle ||
                          status.name ||
                          status.nom ||
                          status.titre ||
                          `Statut #${status.id}`}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Service">
                  <select
                    value={form.service_id}
                    onChange={(event) =>
                      updateForm("service_id", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Aucun service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.nom ||
                          service.name ||
                          service.libelle ||
                          `Service #${service.id}`}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Adresse de l'expéditeur">
                  <select
                    value={form.adresse_expediteur_id}
                    onChange={(event) =>
                      updateForm("adresse_expediteur_id", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Sélectionner une adresse</option>
                    {adresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {getAddressName(address)}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Adresse du destinataire">
                  <select
                    value={form.adresse_destinataire_id}
                    onChange={(event) =>
                      updateForm("adresse_destinataire_id", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Sélectionner une adresse</option>
                    {adresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {getAddressName(address)}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Objet">
                  <input
                    value={form.objet}
                    onChange={(event) => updateForm("objet", event.target.value)}
                    className={inputClass}
                    placeholder="Objet de l'expédition"
                  />
                </Field>

                <Field label="Date d'expédition">
                  <input
                    type="date"
                    value={form.date_expedition}
                    onChange={(event) =>
                      updateForm("date_expedition", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Livraison prévue">
                  <input
                    type="date"
                    value={form.date_livraison_prevue}
                    onChange={(event) =>
                      updateForm("date_livraison_prevue", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Montant total (FCFA)">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.montant_total}
                    onChange={(event) =>
                      updateForm("montant_total", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Montant payé (FCFA)">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.montant_paye}
                    onChange={(event) =>
                      updateForm("montant_paye", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Description">
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Instructions et notes">
                  <textarea
                    rows={3}
                    value={form.instructions}
                    onChange={(event) =>
                      updateForm("instructions", event.target.value)
                    }
                    className={inputClass}
                    placeholder="Instructions de transport..."
                  />
                </Field>
              </div>
            </section>

            {/* Colis */}
            <section className="border-t border-slate-100 pt-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-slate-900">
                    <Box className="text-violet-600" size={19} />
                    Colis de l'expédition
                    <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-700">
                      {form.colis.length}
                    </span>
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Ajoutez les colis et leurs caractéristiques.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {form.colis.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-sm font-bold text-violet-700">
                          {index + 1}
                        </span>
                        <h4 className="font-semibold text-slate-800">
                          Colis {index + 1}
                        </h4>
                      </div>

                      <button
                        type="button"
                        disabled={form.colis.length === 1}
                        onClick={() => removeColis(index)}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-30"
                        title="Supprimer ce colis"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <Field label="Type de colis">
                        <select
                          value={item.type_colis_id}
                          onChange={(event) =>
                            updatePackage(
                              index,
                              "type_colis_id",
                              event.target.value
                            )
                          }
                          className={inputClass}
                        >
                          <option value="">Sélectionner un type</option>
                          {typesColis.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.nom ||
                                type.name ||
                                type.libelle ||
                                `Type #${type.id}`}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Désignation">
                        <input
                          value={item.designation}
                          onChange={(event) =>
                            updatePackage(index, "designation", event.target.value)
                          }
                          className={inputClass}
                          placeholder="Ex. Carton de vêtements"
                        />
                      </Field>

                      <Field label="Quantité" required>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantite}
                          onChange={(event) =>
                            updatePackage(index, "quantite", event.target.value)
                          }
                          className={inputClass}
                        />
                      </Field>

                      <Field label="Poids unitaire (kg)" required>
                        <input
                          type="number"
                          min="0"
                          step="0.001"
                          required
                          value={item.poids}
                          onChange={(event) =>
                            updatePackage(index, "poids", event.target.value)
                          }
                          className={inputClass}
                        />
                      </Field>

                      <Field label="Longueur (cm)">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.longueur}
                          onChange={(event) =>
                            updatePackage(index, "longueur", event.target.value)
                          }
                          className={inputClass}
                        />
                      </Field>

                      <Field label="Largeur (cm)">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.largeur}
                          onChange={(event) =>
                            updatePackage(index, "largeur", event.target.value)
                          }
                          className={inputClass}
                        />
                      </Field>

                      <Field label="Hauteur (cm)">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.hauteur}
                          onChange={(event) =>
                            updatePackage(index, "hauteur", event.target.value)
                          }
                          className={inputClass}
                        />
                      </Field>

                      <Field label="Valeur déclarée (FCFA)">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={item.valeur_declaree}
                          onChange={(event) =>
                            updatePackage(
                              index,
                              "valeur_declaree",
                              event.target.value
                            )
                          }
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-5">
                      <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={item.fragile}
                          onChange={(event) =>
                            updatePackage(index, "fragile", event.target.checked)
                          }
                          className="h-4 w-4 accent-violet-600"
                        />
                        Fragile
                      </label>

                      <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={item.perissable}
                          onChange={(event) =>
                            updatePackage(
                              index,
                              "perissable",
                              event.target.checked
                            )
                          }
                          className="h-4 w-4 accent-violet-600"
                        />
                        Périssable
                      </label>
                    </div>

                    <div className="mt-4">
                      <Field label="Instructions pour ce colis">
                        <input
                          value={item.instructions}
                          onChange={(event) =>
                            updatePackage(
                              index,
                              "instructions",
                              event.target.value
                            )
                          }
                          className={inputClass}
                          placeholder="Précautions particulières..."
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totaux calculés */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-violet-50 p-4">
                  <p className="text-xs text-violet-600">Quantité totale</p>
                  <p className="mt-1 text-xl font-bold text-violet-900">
                    {totals.quantity}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-xs text-blue-600">Poids total indicatif</p>
                  <p className="mt-1 text-xl font-bold text-blue-900">
                    {totals.weight.toFixed(3)} kg
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs text-emerald-600">Volume indicatif</p>
                  <p className="mt-1 text-xl font-bold text-emerald-900">
                    {totals.volume.toFixed(4)} m³
                  </p>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Les totaux sont calculés à titre indicatif. Laravel les recalculera à partir des colis enregistrés.
              </p>
            </section>

            <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                disabled={saving}
                className={buttonSecondary}
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={saving || catalogueLoading}
                className={buttonPrimary}
              >
                {saving ? (
                  <>
                    <LoaderCircle className="animate-spin" size={17} />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    Créer l'expédition
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal création client */}
      {showClientModal && (
        <Modal
          title="Nouveau client"
          subtitle="Créer un client sans quitter le formulaire d'expédition."
          onClose={() => !clientSaving && setShowClientModal(false)}
          size="max-w-2xl"
        >
          <form onSubmit={handleCreateClient} className="space-y-5">
            <Field label="Type de client" required>
              <select
                required
                value={clientForm.type_client}
                onChange={(event) =>
                  setClientForm((previous) => ({
                    ...previous,
                    type_client: event.target.value,
                  }))
                }
                className={inputClass}
              >
                <option value="particulier">Particulier</option>
                <option value="entreprise">Entreprise</option>
              </select>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nom" required>
                <input
                  required
                  value={clientForm.nom}
                  onChange={(event) =>
                    setClientForm((previous) => ({
                      ...previous,
                      nom: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Prénom">
                <input
                  value={clientForm.prenom}
                  onChange={(event) =>
                    setClientForm((previous) => ({
                      ...previous,
                      prenom: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              {clientForm.type_client === "entreprise" && (
                <Field label="Raison sociale" required className="sm:col-span-2">
                  <input
                    required
                    value={clientForm.raison_sociale}
                    onChange={(event) =>
                      setClientForm((previous) => ({
                        ...previous,
                        raison_sociale: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </Field>
              )}

              <Field label="Téléphone" required>
                <input
                  required
                  value={clientForm.telephone}
                  onChange={(event) =>
                    setClientForm((previous) => ({
                      ...previous,
                      telephone: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Email" required>
                <input
                  type="email"
                  required
                  value={clientForm.email}
                  onChange={(event) =>
                    setClientForm((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Numéro contribuable">
                <input
                  value={clientForm.numero_contribuable}
                  onChange={(event) =>
                    setClientForm((previous) => ({
                      ...previous,
                      numero_contribuable: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Email de facturation">
                <input
                  type="email"
                  value={clientForm.email_facturation}
                  onChange={(event) =>
                    setClientForm((previous) => ({
                      ...previous,
                      email_facturation: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Téléphone de facturation">
                <input
                  value={clientForm.telephone_facturation}
                  onChange={(event) =>
                    setClientForm((previous) => ({
                      ...previous,
                      telephone_facturation: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setShowClientModal(false)}
                disabled={clientSaving}
                className={buttonSecondary}
              >
                Annuler
              </button>

              <button type="submit" disabled={clientSaving} className={buttonPrimary}>
                {clientSaving ? "Création..." : "Créer le client"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal création conteneur */}
      {showConteneurModal && (
        <Modal
          title="Nouveau conteneur"
          subtitle="Créer un conteneur dans le catalogue."
          onClose={() => !conteneurSaving && setShowConteneurModal(false)}
          size="max-w-2xl"
        >
          <form onSubmit={handleCreateConteneur} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Numéro du conteneur" required>
                <input
                  required
                  value={conteneurForm.numero}
                  onChange={(event) =>
                    setConteneurForm((previous) => ({
                      ...previous,
                      numero: event.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="Ex. CONT-001"
                />
              </Field>

              <Field label="Nom">
                <input
                  value={conteneurForm.nom}
                  onChange={(event) =>
                    setConteneurForm((previous) => ({
                      ...previous,
                      nom: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Capacité poids (kg)">
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={conteneurForm.capacite_poids}
                  onChange={(event) =>
                    setConteneurForm((previous) => ({
                      ...previous,
                      capacite_poids: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Capacité volume (m³)">
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={conteneurForm.capacite_volume}
                  onChange={(event) =>
                    setConteneurForm((previous) => ({
                      ...previous,
                      capacite_volume: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Description" className="sm:col-span-2">
                <textarea
                  rows={3}
                  value={conteneurForm.description}
                  onChange={(event) =>
                    setConteneurForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setShowConteneurModal(false)}
                disabled={conteneurSaving}
                className={buttonSecondary}
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={conteneurSaving}
                className={buttonPrimary}
              >
                {conteneurSaving ? "Création..." : "Créer le conteneur"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Détails expédition */}
      {showDetails && selectedExpedition && (
        <Modal
          title={`Expédition ${selectedExpedition.numero_suivi || `#${selectedExpedition.id}`}`}
          subtitle="Informations détaillées sur l'expédition."
          onClose={() => setShowDetails(false)}
          size="max-w-4xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Client</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {getClientName(selectedExpedition.client)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Statut</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {getStatusName(selectedExpedition)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Date d'expédition</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(
                    selectedExpedition.date_expedition ||
                      selectedExpedition.created_at
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Poids total</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {selectedExpedition.poids_total ?? "—"} kg
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Montant total</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatMoney(selectedExpedition.montant_total)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Livraison prévue</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(selectedExpedition.date_livraison_prevue)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-100 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <MapPin size={16} className="text-violet-600" />
                  Adresse expéditeur
                </p>
                <p className="text-sm text-slate-600">
                  {getAddressName(selectedExpedition.adresseExpediteur)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <MapPin size={16} className="text-violet-600" />
                  Adresse destinataire
                </p>
                <p className="text-sm text-slate-600">
                  {getAddressName(selectedExpedition.adresseDestinataire)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-bold text-slate-900">
                Colis ({selectedExpedition.colis?.length ?? 0})
              </h3>

              {selectedExpedition.colis?.length ? (
                <div className="space-y-3">
                  {selectedExpedition.colis.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-100 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-800">
                          {item.designation || `Colis #${item.id}`}
                        </p>
                        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                          {item.typeColis?.nom ||
                            item.typeColis?.name ||
                            "Type non précisé"}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                        <p>
                          <span className="text-slate-400">Quantité</span>
                          <br />
                          <strong>{item.quantite}</strong>
                        </p>
                        <p>
                          <span className="text-slate-400">Poids</span>
                          <br />
                          <strong>{item.poids} kg</strong>
                        </p>
                        <p>
                          <span className="text-slate-400">Dimensions</span>
                          <br />
                          <strong>
                            {[
                              item.longueur,
                              item.largeur,
                              item.hauteur,
                            ]
                              .filter(Boolean)
                              .join(" × ") || "—"}
                          </strong>
                        </p>
                        <p>
                          <span className="text-slate-400">Valeur déclarée</span>
                          <br />
                          <strong>{formatMoney(item.valeur_declaree)}</strong>
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.fragile && (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-700">
                            Fragile
                          </span>
                        )}
                        {item.perissable && (
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
                            Périssable
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  Les informations des colis ne sont pas disponibles dans cette réponse API.
                </p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
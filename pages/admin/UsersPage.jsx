import { useMemo, useState } from "react";
import {
    Search,
    Plus,
    Filter,
    LayoutGrid,
    List,
    Building2,
    Mail,
    Phone,
    MapPin,
    Tag,
    X,
} from "lucide-react";

// Remplacez ces données de démonstration par les données de l'API Laravel.
const demoClients = [
    {
        id: 1,
        name: "Alex Chen",
        position: "CTO",
        company: "Acme Corp",
        email: "alex@acme.io",
        phone: "+1 (415) 234-5678",
        location: "San Francisco, CA",
        status: "active",
        tags: ["Enterprise", "Tech"],
        deals: 3,
        value: 42000,
        lastActive: "2 hours ago",
        initials: "AC",
        color: "purple",
    },
    {
        id: 2,
        name: "Sarah Kim",
        position: "Product Manager",
        company: "Pixel Co",
        email: "sarah@pixel.co",
        phone: "+1 (628) 901-2345",
        location: "New York, NY",
        status: "active",
        tags: ["Pro", "Design"],
        deals: 1,
        value: 5000,
        lastActive: "1 day ago",
        initials: "SK",
        color: "cyan",
    },
    {
        id: 3,
        name: "Marcus Webb",
        position: "CEO",
        company: "Loop Dev",
        email: "marcus@loop.dev",
        phone: "+44 20 7123 4567",
        location: "London, UK",
        status: "prospect",
        tags: ["Enterprise", "Prospect"],
        deals: 0,
        value: null,
        lastActive: "3 days ago",
        initials: "MW",
        color: "amber",
    },
];

const statusLabels = {
    active: "Active",
    inactive: "Inactive",
    prospect: "Prospect",
};

const statusStyles = {
    active: "bg-emerald-100 text-emerald-600",
    inactive: "bg-slate-200 text-slate-600",
    prospect: "bg-blue-100 text-blue-500",
};

const avatarStyles = {
    purple: "bg-violet-600",
    cyan: "bg-cyan-500",
    amber: "bg-amber-500",
    green: "bg-emerald-500",
};

function formatValue(value) {
    if (value == null) return "—";
    if (value >= 1000) {
        const thousands = value / 1000;
        return `$${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`;
    }
    return `$${value}`;
}

function ClientCard({ client }) {
    const name = client.name ?? "Client";
    const initials =
        client.initials ??
        name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

    return (
        <article className="rounded-[18px] border border-slate-200 bg-white/80 p-7 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="relative shrink-0">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-white text-xl font-bold text-white shadow-sm ring-2 ring-slate-200 ${avatarStyles[client.color] ?? "bg-violet-600"
                                }`}
                        >
                            {initials}
                        </div>

                        <span
                            className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${client.status === "active"
                                    ? "bg-emerald-500"
                                    : "bg-slate-500"
                                }`}
                        />
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate text-xl font-semibold text-slate-800">
                            {name}
                        </h3>
                        <p className="truncate text-base text-slate-500">
                            {client.position ?? "—"}
                        </p>
                    </div>
                </div>

                <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${statusStyles[client.status] ?? statusStyles.inactive
                        }`}
                >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {statusLabels[client.status] ?? client.status ?? "Inactive"}
                </span>
            </div>

            <div className="mt-6 space-y-3 text-base text-slate-600">
                <p className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 shrink-0 text-slate-400" />
                    <span className="truncate">{client.company ?? "—"}</span>
                </p>

                <p className="flex items-center gap-3">
                    <Mail className="h-5 w-5 shrink-0 text-slate-400" />
                    <a
                        href={`mailto:${client.email}`}
                        className="truncate hover:text-violet-600"
                    >
                        {client.email ?? "—"}
                    </a>
                </p>

                <p className="flex items-center gap-3">
                    <Phone className="h-5 w-5 shrink-0 text-slate-400" />
                    <span className="truncate">{client.phone ?? "—"}</span>
                </p>

                <p className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 shrink-0 text-slate-400" />
                    <span className="truncate">{client.location ?? "—"}</span>
                </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
                <Tag className="mr-1 h-4 w-4 text-slate-400" />
                {(client.tags ?? []).map((tag) => (
                    <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-200 pt-6 text-center">
                <div>
                    <p className="text-xl font-semibold text-slate-800">
                        {client.deals ?? 0}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">Deals</p>
                </div>

                <div>
                    <p className="text-xl font-semibold text-slate-800">
                        {formatValue(client.value)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">Value</p>
                </div>

                <div>
                    <p className="truncate text-sm text-slate-600">
                        {client.lastActive ?? "—"}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">Last active</p>
                </div>
            </div>
        </article>
    );
}


function ClientListTable({ clients }) {
    return (
        <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] table-fixed border-collapse text-left">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="w-[20%] px-7 py-5 text-sm font-semibold uppercase tracking-wide text-slate-400">
                                Contact
                            </th>
                            <th className="w-[15%] px-5 py-5 text-sm font-semibold uppercase tracking-wide text-slate-400">
                                Company
                            </th>
                            <th className="w-[15%] px-5 py-5 text-sm font-semibold uppercase tracking-wide text-slate-400">
                                Location
                            </th>
                            <th className="w-[12%] px-5 py-5 text-sm font-semibold uppercase tracking-wide text-slate-400">
                                Status
                            </th>
                            <th className="w-[15%] px-5 py-5 text-sm font-semibold uppercase tracking-wide text-slate-400">
                                Tags
                            </th>
                            <th className="w-[10%] px-5 py-5 text-sm font-semibold uppercase tracking-wide text-slate-400">
                                Value
                            </th>
                            <th className="w-[13%] px-5 py-5 text-sm font-semibold uppercase tracking-wide text-slate-400">
                                Last active
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {clients.map((client) => {
                            const name = client.name ?? "Client";

                            const initials =
                                client.initials ??
                                name
                                    .split(/\s+/)
                                    .map((part) => part[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase();

                            return (
                                <tr
                                    key={client.id}
                                    className="border-b border-slate-200 transition-colors last:border-b-0 hover:bg-slate-50/80"
                                >
                                    {/* Contact */}
                                    <td className="px-7 py-5">
                                        <div className="flex min-w-0 items-center gap-4">
                                            <div className="relative shrink-0">
                                                <div
                                                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white shadow-sm ring-1 ring-slate-200 ${
                                                        avatarStyles[client.color] ??
                                                        "bg-violet-600"
                                                    }`}
                                                >
                                                    {initials}
                                                </div>

                                                <span
                                                    className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${
                                                        client.status === "active"
                                                            ? "bg-emerald-500"
                                                            : client.status === "prospect"
                                                              ? "bg-slate-500"
                                                              : "bg-slate-400"
                                                    }`}
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-lg font-medium text-slate-800">
                                                    {name}
                                                </p>

                                                <a
                                                    href={`mailto:${client.email ?? ""}`}
                                                    className="block truncate text-base text-slate-500 hover:text-violet-600"
                                                >
                                                    {client.email ?? "—"}
                                                </a>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Company */}
                                    <td className="px-5 py-5">
                                        <p className="break-words text-lg text-slate-700">
                                            {client.company ?? "—"}
                                        </p>
                                        <p className="mt-1 break-words text-base text-slate-500">
                                            {client.position ?? "—"}
                                        </p>
                                    </td>

                                    {/* Location */}
                                    <td className="px-5 py-5">
                                        <p className="break-words text-lg text-slate-600">
                                            {client.location ?? "—"}
                                        </p>
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-5">
                                        <span
                                            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${
                                                statusStyles[client.status] ??
                                                statusStyles.inactive
                                            }`}
                                        >
                                            <span className="h-2 w-2 rounded-full bg-current" />
                                            {statusLabels[client.status] ??
                                                client.status ??
                                                "Inactive"}
                                        </span>
                                    </td>

                                    {/* Tags */}
                                    <td className="px-5 py-5">
                                        <div className="flex flex-wrap gap-1.5">
                                            {(client.tags ?? []).length > 0 ? (
                                                client.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-full bg-slate-200/80 px-3 py-1.5 text-sm text-slate-600"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-400">
                                                    —
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Value */}
                                    <td className="px-5 py-5">
                                        <p className="whitespace-nowrap text-lg font-medium text-slate-700">
                                            {formatValue(client.value)}
                                        </p>
                                    </td>

                                    {/* Last active */}
                                    <td className="px-5 py-5">
                                        <p className="text-lg text-slate-600">
                                            {client.lastActive ?? "—"}
                                        </p>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function Clients() {
    const [clients] = useState(demoClients);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [view, setView] = useState("grid");
    const [showFilters, setShowFilters] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const filteredClients = useMemo(() => {
        const term = search.trim().toLowerCase();

        return clients.filter((client) => {
            const matchesSearch = [
                client.name,
                client.company,
                client.email,
                client.phone,
                client.location,
            ].some((value) => String(value ?? "").toLowerCase().includes(term));

            const matchesStatus =
                status === "all" || client.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [clients, search, status]);

    const filters = [
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "prospect", label: "Prospect" },
    ];

    return (
        <div className="min-h-full bg-slate-50 p-5 md:p-6">
            {/* Page title */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        CLIENTS
                    </h1>
                    <p className="mt-1.5 text-base text-slate-500">
                        {clients.length} total contacts
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-3 rounded-xl bg-violet-600 px-6 py-3 text-lg font-medium text-white shadow-md transition hover:bg-violet-700"
                >
                    <Plus className="h-5 w-5" />
                    Add Contact
                </button>
            </div>

            {/* Search and filters */}
            <div className="mb-8 flex flex-wrap items-center gap-4">
                <div className="relative min-w-[220px] flex-1">
                    <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search contacts..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-100/80 py-2.5 pl-12 pr-4 text-base text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1.5">
                    {filters.map((filter) => (
                        <button
                            key={filter.value}
                            type="button"
                            onClick={() => setStatus(filter.value)}
                            className={`rounded-lg px-3.5 py-1.5 text-sm transition ${
    status === filter.value
        ? "bg-violet-600 font-semibold text-white shadow"
        : "text-slate-600 hover:bg-white"
}`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => setShowFilters((value) => !value)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 hover:bg-white">
                    <Filter className="h-5 w-5" />
                    Filters
                </button>

                <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1.5">
                    <button
                        type="button"
                        aria-label="Vue en grille"
                        onClick={() => setView("grid")}
                        className={`rounded-lg p-2 ${view === "grid"
                                ? "bg-violet-600 text-white"
                                : "text-slate-500"
                            }`}
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        aria-label="Vue en liste"
                        onClick={() => setView("list")}
                        className={`rounded-lg p-2 ${view === "list"
                                ? "bg-violet-600 text-white"
                                : "text-slate-500"
                            }`}
                    >
                        <List className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-600">
                        Filtre par statut : {statusLabels[status] ?? "Tous"}
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setStatus("all");
                            setSearch("");
                        }}
                        className="text-sm font-medium text-violet-600 hover:text-violet-800"
                    >
                        Réinitialiser
                    </button>
                </div>
            )}

            <p className="mb-7 text-base text-slate-400">
                Showing {filteredClients.length} of {clients.length} contacts
            </p>

            
{filteredClients.length ? (
    view === "grid" ? (
        <div className="grid grid-cols-3 gap-6 xl:grid-cols-3 2xl:grid-cols-3">
            {filteredClients.map((client) => (
                <ClientCard key={client.id} client={client} />
            ))}
        </div>
    ) : (
        <ClientListTable clients={filteredClients} />
    )
) : (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
        <p className="text-lg font-semibold text-slate-700">
            Aucun contact trouvé
        </p>
        <p className="mt-2 text-slate-500">
            Modifiez votre recherche ou choisissez un autre statut.
        </p>
    </div>
)}

                

            {/* Formulaire visuel d'ajout */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">
                                Add Contact
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                aria-label="Fermer"
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <p className="text-sm leading-6 text-slate-500">
                            Le formulaire d'ajout sera relié à votre API Laravel
                            lorsque nous connaîtrons les champs et l'endpoint
                            utilisés pour créer un client.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 font-medium text-white hover:bg-violet-700"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

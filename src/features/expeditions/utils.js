// Fonctions communes aux écrans d'expéditions.
// Les relations Laravel arrivent en snake_case (adresse_expediteur, type_colis...).

export function toRows(result) {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;

    return [];
}

export function toNumberOrNull(value) {
    if (value === "" || value === null || value === undefined) return null;

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
}

export function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("fr-FR");
}

export function formatMoney(value) {
    if (value === null || value === undefined || value === "") return "—";

    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);
}

export function getClientName(client) {
    if (!client) return "—";

    const personne = client.personne;

    return (
        client.raison_sociale ||
        [personne?.prenom, personne?.nom].filter(Boolean).join(" ") ||
        client.code_client ||
        `Client #${client.id}`
    );
}

export function getAddressLabel(address) {
    if (!address) return "—";

    return (
        [
            address.nom_contact,
            address.adresse_ligne_1,
            address.commune?.nom,
            address.ville?.nom,
        ]
            .filter(Boolean)
            .join(", ") || `Adresse #${address.id}`
    );
}

export function getStatusName(expedition) {
    return expedition?.statut?.nom || "Non défini";
}

// Couleur du badge de statut : par code d'abord, puis par mots du libellé.
const STATUS_CLASS_BY_CODE = {
    DEPOSE: "bg-amber-50 text-amber-700",
    EN_COURS: "bg-blue-50 text-blue-700",
    LIVRE: "bg-emerald-50 text-emerald-700",
};

export function statusClass(statut) {
    if (statut?.code && STATUS_CLASS_BY_CODE[statut.code]) {
        return STATUS_CLASS_BY_CODE[statut.code];
    }

    const name = String(statut?.nom || "").toLowerCase();

    if (name.includes("livr")) return "bg-emerald-50 text-emerald-700";
    if (name.includes("annul")) return "bg-red-50 text-red-700";
    if (name.includes("cours") || name.includes("transit")) return "bg-blue-50 text-blue-700";
    if (name.includes("attente") || name.includes("depos") || name.includes("dépos")) {
        return "bg-amber-50 text-amber-700";
    }

    return "bg-slate-100 text-slate-600";
}

export function generateTrackingNumber() {
    const number = Math.floor(10000 + Math.random() * 90000);

    return `SU-${number}`;
}
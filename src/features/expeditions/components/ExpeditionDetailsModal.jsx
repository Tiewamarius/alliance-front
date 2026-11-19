import { MapPin } from "lucide-react";

import Modal from "../../../components/ui/Modal";
import {
    formatDate,
    formatMoney,
    getAddressLabel,
    getClientName,
    getStatusName,
    statusClass,
} from "../utils";

function InfoCard({ label, children }) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">{label}</p>
            <div className="mt-1 font-semibold text-slate-900">{children}</div>
        </div>
    );
}

function AddressCard({ title, address }) {
    return (
        <div className="rounded-xl border border-slate-100 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <MapPin size={16} className="text-violet-600" />
                {title}
            </p>
            <p className="text-sm text-slate-600">{getAddressLabel(address)}</p>
        </div>
    );
}

/**
 * Détails d'une expédition, à partir de la ligne déjà chargée dans la liste
 * (le contrôleur renvoie client, statut, service, adresses, colis et conteneurs).
 */
export default function ExpeditionDetailsModal({ expedition, onClose }) {
    const colis = expedition.colis ?? [];
    const conteneurs = (expedition.affectations_conteneurs ?? [])
        .map((affectation) => affectation.conteneur?.numero)
        .filter(Boolean);

    return (
        <Modal
            title={`Expédition ${expedition.numero_suivi || `#${expedition.id}`}`}
            subtitle={expedition.objet || "Informations détaillées sur l'expédition."}
            onClose={onClose}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoCard label="Client">{getClientName(expedition.client)}</InfoCard>

                    <InfoCard label="Statut">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(expedition.statut)}`}
                        >
                            {getStatusName(expedition)}
                        </span>
                    </InfoCard>

                    <InfoCard label="Service">{expedition.service?.nom || "—"}</InfoCard>

                    <InfoCard label="Date d'expédition">
                        {formatDate(expedition.date_expedition || expedition.created_at)}
                    </InfoCard>

                    <InfoCard label="Livraison prévue">
                        {formatDate(expedition.date_livraison_prevue)}
                    </InfoCard>

                    <InfoCard label="Colis">{expedition.nombre_colis ?? colis.length}</InfoCard>

                    <InfoCard label="Poids total">{expedition.poids_total ?? "—"} kg</InfoCard>

                    <InfoCard label="Volume total">{expedition.volume_total ?? "—"} m³</InfoCard>

                    <InfoCard label="Conteneur(s)">{conteneurs.length ? conteneurs.join(", ") : "—"}</InfoCard>

                    <InfoCard label="Montant HT">{formatMoney(expedition.montant_ht)}</InfoCard>

                    <InfoCard label="Taxe">{formatMoney(expedition.montant_taxe)}</InfoCard>

                    <InfoCard label="Montant TTC">{formatMoney(expedition.montant_ttc)}</InfoCard>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <AddressCard title="Adresse expéditeur" address={expedition.adresse_expediteur} />
                    <AddressCard title="Adresse destinataire" address={expedition.adresse_destinataire} />
                </div>

                {(expedition.description || expedition.instructions) && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {expedition.description && (
                            <div className="rounded-xl border border-slate-100 p-4">
                                <p className="mb-1 text-sm font-semibold text-slate-800">Description</p>
                                <p className="text-sm text-slate-600">{expedition.description}</p>
                            </div>
                        )}
                        {expedition.instructions && (
                            <div className="rounded-xl border border-slate-100 p-4">
                                <p className="mb-1 text-sm font-semibold text-slate-800">Instructions</p>
                                <p className="text-sm text-slate-600">{expedition.instructions}</p>
                            </div>
                        )}
                    </div>
                )}

                <div>
                    <h3 className="mb-3 font-bold text-slate-900">Colis ({colis.length})</h3>

                    {colis.length ? (
                        <div className="space-y-3">
                            {colis.map((item) => (
                                <div key={item.id} className="rounded-xl border border-slate-100 p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="font-semibold text-slate-800">
                                            {item.designation || item.numero_colis || `Colis #${item.id}`}
                                        </p>
                                        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                                            {item.type_colis?.nom || "Type non précisé"}
                                        </span>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                                        <p>
                                            <span className="text-slate-400">Quantité</span>
                                            <br />
                                            <strong>{item.quantite}</strong>
                                        </p>
                                        <p>
                                            <span className="text-slate-400">Poids unitaire</span>
                                            <br />
                                            <strong>{item.poids} kg</strong>
                                        </p>
                                        <p>
                                            <span className="text-slate-400">Dimensions (cm)</span>
                                            <br />
                                            <strong>
                                                {[item.longueur, item.largeur, item.hauteur]
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

                                    {(item.fragile || item.perissable) && (
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
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                            Aucun colis enregistré pour cette expédition.
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );
}
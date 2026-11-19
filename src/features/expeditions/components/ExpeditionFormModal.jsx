import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    Box,
    CheckCircle2,
    LoaderCircle,
    Package,
    Plus,
    PlusCircle,
    Shuffle,
    Trash2,
    X,
} from "lucide-react";

import Modal from "../../../components/ui/Modal";
import Field from "../../../components/ui/Field";
import {
    buttonPrimary,
    buttonSecondary,
    inputClass,
} from "../../../components/ui/formClasses";
import expeditionService from "../../../services/api/expeditionService";
import adresseService from "../../../services/api/adresseService";
import useFetch from "../../../hooks/useFetch";
import ClientFormModal from "../../clients/components/ClientFormModal";
import AddressFormModal from "../../adresses/components/AddressFormModal";
import { getApiErrorMessage } from "../../../utils/apiError";
import {
    generateTrackingNumber,
    getAddressLabel,
    getClientName,
    toNumberOrNull,
    toRows,
} from "../utils";

function newPackage() {
    return {
        _key: crypto.randomUUID?.() ?? String(Math.random()),
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
    };
}

function emptyForm() {
    return {
        numero_suivi: "",
        reference_client: "",
        client_id: "",
        statut_id: "",
        service_id: "",
        adresse_expediteur_id: "",
        adresse_destinataire_id: "",
        objet: "",
        description: "",
        date_expedition: "",
        date_livraison_prevue: "",
        montant_ht: "",
        montant_taxe: "",
        montant_ttc: "",
        instructions: "",
        colis: [newPackage()],
    };
}

/**
 * Formulaire de création d'une expédition avec ses colis.
 * Champs et règles : ExpeditionController::$storeRules (Laravel).
 *
 * @param catalogs  { clients, statuts, services, typesColis, loading, reload }
 *                  Les adresses sont celles du carnet du client choisi.
 * @param onCreated appelé avec l'expédition créée
 */
export default function ExpeditionFormModal({ catalogs, onClose, onCreated }) {
    const { clients, statuts, services, typesColis, loading } = catalogs;

    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [showClientModal, setShowClientModal] = useState(false);
    const [addressTarget, setAddressTarget] = useState(null); // "expediteur" | "destinataire"

    // Carnet d'adresses du client choisi (les adresses appartiennent à sa personne).
    const selectedClient = clients.find((client) => String(client.id) === String(form.client_id));
    const personneId = selectedClient?.personne_id ?? null;

    const addressList = useFetch(
        (signal) => adresseService.getAll({ personne_id: personneId, per_page: 100 }, { signal }),
        [personneId],
        { enabled: Boolean(personneId) }
    );

    // Pas d'adresses d'un autre client pendant le rechargement.
    const adresses = personneId && !addressList.loading ? toRows(addressList.data) : [];

    // Statut « Déposé » présélectionné dès que la liste est disponible.
    useEffect(() => {
        const defaultStatut = statuts.find((statut) => statut.code === "DEPOSE");

        if (defaultStatut) {
            setForm((previous) =>
                previous.statut_id ? previous : { ...previous, statut_id: String(defaultStatut.id) }
            );
        }
    }, [statuts]);

    const nestedOpen = showClientModal || addressTarget !== null;

    const close = () => {
        if (!saving && !nestedOpen) onClose();
    };

    const handleClientChange = (value) => {
        // Les adresses dépendent du client : on repart d'une sélection vide.
        setForm((previous) => ({
            ...previous,
            client_id: value,
            adresse_expediteur_id: "",
            adresse_destinataire_id: "",
        }));
    };

    const handleClientCreated = async (created) => {
        setShowClientModal(false);
        await catalogs.reload?.();
        handleClientChange(String(created.id));
    };

    const handleAddressCreated = (created) => {
        const field =
            addressTarget === "expediteur" ? "adresse_expediteur_id" : "adresse_destinataire_id";

        setAddressTarget(null);
        addressList.reload();
        updateForm(field, String(created.id));
    };

    const updateForm = (name, value) => {
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const updatePackage = (index, name, value) => {
        setForm((previous) => ({
            ...previous,
            colis: previous.colis.map((item, i) => (i === index ? { ...item, [name]: value } : item)),
        }));
    };

    const addPackage = () => {
        setForm((previous) => ({ ...previous, colis: [...previous.colis, newPackage()] }));
    };

    const removePackage = (index) => {
        setForm((previous) => ({
            ...previous,
            colis:
                previous.colis.length <= 1
                    ? previous.colis
                    : previous.colis.filter((_, i) => i !== index),
        }));
    };

    // Totaux affichés à titre indicatif : Laravel les recalcule à l'enregistrement.
    const totals = useMemo(
        () =>
            form.colis.reduce(
                (sum, item) => {
                    const quantity = Math.max(0, Number(item.quantite) || 0);
                    const weight = Math.max(0, Number(item.poids) || 0);
                    const length = Number(item.longueur) || 0;
                    const width = Number(item.largeur) || 0;
                    const height = Number(item.hauteur) || 0;

                    sum.quantity += quantity;
                    sum.weight += quantity * weight;

                    if (length && width && height) {
                        sum.volume += (length * width * height * quantity) / 1_000_000;
                    }

                    return sum;
                },
                { quantity: 0, weight: 0, volume: 0 }
            ),
        [form.colis]
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const montantHt = toNumberOrNull(form.montant_ht);
        const montantTaxe = toNumberOrNull(form.montant_taxe);
        let montantTtc = toNumberOrNull(form.montant_ttc);

        // TTC non saisi : HT + taxe.
        if (montantTtc === null && montantHt !== null) {
            montantTtc = montantHt + (montantTaxe ?? 0);
        }

        const payload = {
            numero_suivi: form.numero_suivi.trim(),
            reference_client: form.reference_client.trim() || null,
            client_id: Number(form.client_id),
            statut_id: Number(form.statut_id),
            service_id: toNumberOrNull(form.service_id),
            adresse_expediteur_id: toNumberOrNull(form.adresse_expediteur_id),
            adresse_destinataire_id: toNumberOrNull(form.adresse_destinataire_id),
            objet: form.objet.trim() || null,
            description: form.description.trim() || null,
            date_expedition: form.date_expedition || null,
            date_livraison_prevue: form.date_livraison_prevue || null,
            montant_ht: montantHt,
            montant_taxe: montantTaxe,
            montant_ttc: montantTtc,
            instructions: form.instructions.trim() || null,

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
            })),
        };

        setSaving(true);

        try {
            const created = await expeditionService.create(payload);

            onCreated?.(created);
        } catch (err) {
            setError(getApiErrorMessage(err, "Création de l'expédition impossible."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
        <Modal
            title="Nouvelle expédition"
            subtitle="Renseignez les informations du transport et ajoutez les colis."
            onClose={close}
            size="max-w-6xl"
            actions={
                <button
                    type="button"
                    onClick={addPackage}
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 sm:px-4"
                >
                    <PlusCircle size={17} />
                    <span className="hidden sm:inline">Ajouter un colis</span>
                    <span className="sm:hidden">Colis</span>
                </button>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-7">
                {error && (
                    <div
                        className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        role="alert"
                    >
                        <AlertCircle size={19} className="mt-0.5 shrink-0" />
                        <p className="flex-1">{error}</p>
                        <button type="button" onClick={() => setError("")} aria-label="Masquer">
                            <X size={17} />
                        </button>
                    </div>
                )}

                {/* Informations générales */}
                <section>
                    <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                        <Package className="text-violet-600" size={19} />
                        Informations générales
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <Field label="Numéro de suivi" required>
                            <div className="flex gap-2">
                                <input
                                    required
                                    value={form.numero_suivi}
                                    onChange={(event) => updateForm("numero_suivi", event.target.value)}
                                    placeholder="Ex. SU-12345"
                                    className={inputClass}
                                />
                                <button
                                    type="button"
                                    onClick={() => updateForm("numero_suivi", generateTrackingNumber())}
                                    className="shrink-0 rounded-xl bg-violet-100 px-3 text-violet-700 hover:bg-violet-200"
                                    title="Générer un numéro"
                                >
                                    <Shuffle size={18} />
                                </button>
                            </div>
                        </Field>

                        <Field label="Client" required>
                            <div className="flex gap-2">
                                <select
                                    required
                                    value={form.client_id}
                                    onChange={(event) => handleClientChange(event.target.value)}
                                    className={inputClass}
                                >
                                    <option value="">Sélectionner un client</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {getClientName(client)}
                                            {client.code_client ? ` — ${client.code_client}` : ""}
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
                                onChange={(event) => updateForm("statut_id", event.target.value)}
                                className={inputClass}
                            >
                                <option value="">Sélectionner un statut</option>
                                {statuts.map((statut) => (
                                    <option key={statut.id} value={statut.id}>
                                        {statut.nom}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Service">
                            <select
                                value={form.service_id}
                                onChange={(event) => updateForm("service_id", event.target.value)}
                                className={inputClass}
                            >
                                <option value="">Aucun service</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.nom}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Adresse de l'expéditeur">
                            <div className="flex gap-2">
                                <select
                                    value={form.adresse_expediteur_id}
                                    onChange={(event) => updateForm("adresse_expediteur_id", event.target.value)}
                                    disabled={!personneId}
                                    className={inputClass}
                                >
                                    <option value="">
                                        {personneId ? "Sélectionner une adresse" : "Choisissez d'abord un client"}
                                    </option>
                                    {adresses.map((address) => (
                                        <option key={address.id} value={address.id}>
                                            {getAddressLabel(address)}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    disabled={!personneId}
                                    onClick={() => setAddressTarget("expediteur")}
                                    className="shrink-0 rounded-xl bg-violet-100 px-3 text-violet-700 hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-40"
                                    title="Ajouter une adresse"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </Field>

                        <Field label="Adresse du destinataire">
                            <div className="flex gap-2">
                                <select
                                    value={form.adresse_destinataire_id}
                                    onChange={(event) => updateForm("adresse_destinataire_id", event.target.value)}
                                    disabled={!personneId}
                                    className={inputClass}
                                >
                                    <option value="">
                                        {personneId ? "Sélectionner une adresse" : "Choisissez d'abord un client"}
                                    </option>
                                    {adresses.map((address) => (
                                        <option key={address.id} value={address.id}>
                                            {getAddressLabel(address)}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    disabled={!personneId}
                                    onClick={() => setAddressTarget("destinataire")}
                                    className="shrink-0 rounded-xl bg-violet-100 px-3 text-violet-700 hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-40"
                                    title="Ajouter une adresse"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </Field>

                        <Field label="Objet">
                            <input
                                value={form.objet}
                                onChange={(event) => updateForm("objet", event.target.value)}
                                className={inputClass}
                                placeholder="Objet de l'expédition"
                            />
                        </Field>

                        <Field label="Référence client">
                            <input
                                value={form.reference_client}
                                onChange={(event) => updateForm("reference_client", event.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Date d'expédition">
                            <input
                                type="date"
                                value={form.date_expedition}
                                onChange={(event) => updateForm("date_expedition", event.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Livraison prévue">
                            <input
                                type="date"
                                value={form.date_livraison_prevue}
                                onChange={(event) => updateForm("date_livraison_prevue", event.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Montant HT (FCFA)">
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={form.montant_ht}
                                onChange={(event) => updateForm("montant_ht", event.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Taxe (FCFA)">
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={form.montant_taxe}
                                onChange={(event) => updateForm("montant_taxe", event.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Montant TTC (FCFA)">
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={form.montant_ttc}
                                onChange={(event) => updateForm("montant_ttc", event.target.value)}
                                className={inputClass}
                                placeholder="HT + taxe si vide"
                            />
                        </Field>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="Description">
                            <textarea
                                rows={3}
                                value={form.description}
                                onChange={(event) => updateForm("description", event.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Instructions de transport">
                            <textarea
                                rows={3}
                                value={form.instructions}
                                onChange={(event) => updateForm("instructions", event.target.value)}
                                className={inputClass}
                            />
                        </Field>
                    </div>
                </section>

                {/* Colis */}
                <section className="border-t border-slate-100 pt-6">
                    <div className="mb-4">
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

                    <div className="space-y-4">
                        {form.colis.map((item, index) => (
                            <div
                                key={item._key}
                                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-sm font-bold text-violet-700">
                                            {index + 1}
                                        </span>
                                        <h4 className="font-semibold text-slate-800">Colis {index + 1}</h4>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={form.colis.length === 1}
                                        onClick={() => removePackage(index)}
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
                                            onChange={(event) => updatePackage(index, "type_colis_id", event.target.value)}
                                            className={inputClass}
                                        >
                                            <option value="">Sélectionner un type</option>
                                            {typesColis.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>

                                    <Field label="Désignation">
                                        <input
                                            value={item.designation}
                                            onChange={(event) => updatePackage(index, "designation", event.target.value)}
                                            className={inputClass}
                                            placeholder="Ex. Carton de vêtements"
                                        />
                                    </Field>

                                    <Field label="Quantité" required>
                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            required
                                            value={item.quantite}
                                            onChange={(event) => updatePackage(index, "quantite", event.target.value)}
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
                                            onChange={(event) => updatePackage(index, "poids", event.target.value)}
                                            className={inputClass}
                                        />
                                    </Field>

                                    <Field label="Longueur (cm)">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.longueur}
                                            onChange={(event) => updatePackage(index, "longueur", event.target.value)}
                                            className={inputClass}
                                        />
                                    </Field>

                                    <Field label="Largeur (cm)">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.largeur}
                                            onChange={(event) => updatePackage(index, "largeur", event.target.value)}
                                            className={inputClass}
                                        />
                                    </Field>

                                    <Field label="Hauteur (cm)">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.hauteur}
                                            onChange={(event) => updatePackage(index, "hauteur", event.target.value)}
                                            className={inputClass}
                                        />
                                    </Field>

                                    <Field label="Valeur déclarée (FCFA)">
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={item.valeur_declaree}
                                            onChange={(event) => updatePackage(index, "valeur_declaree", event.target.value)}
                                            className={inputClass}
                                        />
                                    </Field>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-5">
                                    <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={item.fragile}
                                            onChange={(event) => updatePackage(index, "fragile", event.target.checked)}
                                            className="h-4 w-4 accent-violet-600"
                                        />
                                        Fragile
                                    </label>

                                    <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                                        <input
                                            type="checkbox"
                                            checked={item.perissable}
                                            onChange={(event) => updatePackage(index, "perissable", event.target.checked)}
                                            className="h-4 w-4 accent-violet-600"
                                        />
                                        Périssable
                                    </label>
                                </div>

                                <div className="mt-4">
                                    <Field label="Instructions pour ce colis">
                                        <input
                                            value={item.instructions}
                                            onChange={(event) => updatePackage(index, "instructions", event.target.value)}
                                            className={inputClass}
                                            placeholder="Précautions particulières..."
                                        />
                                    </Field>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-violet-50 p-4">
                            <p className="text-xs text-violet-600">Quantité totale</p>
                            <p className="mt-1 text-xl font-bold text-violet-900">{totals.quantity}</p>
                        </div>

                        <div className="rounded-xl bg-blue-50 p-4">
                            <p className="text-xs text-blue-600">Poids total indicatif</p>
                            <p className="mt-1 text-xl font-bold text-blue-900">{totals.weight.toFixed(3)} kg</p>
                        </div>

                        <div className="rounded-xl bg-emerald-50 p-4">
                            <p className="text-xs text-emerald-600">Volume indicatif</p>
                            <p className="mt-1 text-xl font-bold text-emerald-900">{totals.volume.toFixed(4)} m³</p>
                        </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                        Les totaux sont indicatifs : Laravel les recalcule à partir des colis enregistrés.
                    </p>
                </section>

                <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                    <button type="button" onClick={close} disabled={saving} className={buttonSecondary}>
                        Annuler
                    </button>

                    <button type="submit" disabled={saving || loading} className={buttonPrimary}>
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

        {showClientModal && (
            <ClientFormModal onClose={() => setShowClientModal(false)} onCreated={handleClientCreated} />
        )}

        {addressTarget && (
            <AddressFormModal
                personneId={personneId}
                title={
                    addressTarget === "expediteur"
                        ? "Nouvelle adresse de l'expéditeur"
                        : "Nouvelle adresse du destinataire"
                }
                onClose={() => setAddressTarget(null)}
                onCreated={handleAddressCreated}
            />
        )}
        </>
    );
}
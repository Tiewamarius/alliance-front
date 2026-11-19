import { useState } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";

import Modal from "../../../components/ui/Modal";
import Field from "../../../components/ui/Field";
import { buttonPrimary, buttonSecondary, inputClass } from "../../../components/ui/formClasses";
import adresseService from "../../../services/api/adresseService";
import referenceService from "../../../services/api/referenceService";
import useFetch from "../../../hooks/useFetch";
import { getApiErrorMessage } from "../../../utils/apiError";
import { toNumberOrNull, toRows } from "../../expeditions/utils";

const EMPTY = {
    nom_contact: "",
    telephone: "",
    adresse_ligne_1: "",
    adresse_ligne_2: "",
    pays_id: "",
    ville_id: "",
    commune_id: "",
    zone_id: "",
    code_postal: "",
    instructions: "",
    is_default: false,
};

const clean = (value) => value.trim() || null;
const PER_PAGE = { per_page: 100 };

function GeoSelect({ label, value, onChange, options }) {
    return (
        <Field label={label}>
            <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
                <option value="">—</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.nom}
                    </option>
                ))}
            </select>
        </Field>
    );
}

/**
 * Création d'une adresse dans le carnet d'une personne (POST /adresses).
 *
 * @param personneId propriétaire du carnet (personne du client). Indispensable
 *                   pour le personnel ; ignoré côté serveur pour un client.
 * @param title      « Adresse de l'expéditeur », « Adresse du destinataire »...
 * @param onCreated  appelé avec l'adresse créée
 */
export default function AddressFormModal({ personneId, title = "Nouvelle adresse", onClose, onCreated }) {
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Référentiels mis en cache par referenceService.
    const geo = useFetch(
        () =>
            Promise.all([
                referenceService.pays.getAll(PER_PAGE),
                referenceService.villes.getAll(PER_PAGE),
                referenceService.communes.getAll(PER_PAGE),
                referenceService.zones.getAll(PER_PAGE),
            ]),
        []
    );

    const [pays, villes, communes, zones] = (geo.data ?? []).map(toRows);

    const update = (name, value) => setForm((previous) => ({ ...previous, [name]: value }));

    const close = () => {
        if (!saving) onClose();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);

        try {
            const created = await adresseService.create({
                ...(personneId ? { personne_id: personneId } : {}),
                nom_contact: clean(form.nom_contact),
                telephone: clean(form.telephone),
                adresse_ligne_1: form.adresse_ligne_1.trim(),
                adresse_ligne_2: clean(form.adresse_ligne_2),
                pays_id: toNumberOrNull(form.pays_id),
                ville_id: toNumberOrNull(form.ville_id),
                commune_id: toNumberOrNull(form.commune_id),
                zone_id: toNumberOrNull(form.zone_id),
                code_postal: clean(form.code_postal),
                instructions: clean(form.instructions),
                is_default: form.is_default,
            });

            onCreated(created);
        } catch (err) {
            setError(getApiErrorMessage(err, "Création de l'adresse impossible."));
            setSaving(false);
        }
    };

    return (
        <Modal
            title={title}
            subtitle="L'adresse est enregistrée dans le carnet d'adresses du client."
            onClose={close}
            size="max-w-2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div
                        className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        role="alert"
                    >
                        <AlertCircle size={19} className="mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Nom du contact">
                        <input
                            value={form.nom_contact}
                            onChange={(event) => update("nom_contact", event.target.value)}
                            className={inputClass}
                            placeholder="Personne à contacter sur place"
                        />
                    </Field>

                    <Field label="Téléphone du contact">
                        <input
                            type="tel"
                            value={form.telephone}
                            onChange={(event) => update("telephone", event.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Adresse" required className="sm:col-span-2">
                        <input
                            required
                            value={form.adresse_ligne_1}
                            onChange={(event) => update("adresse_ligne_1", event.target.value)}
                            className={inputClass}
                            placeholder="Rue, quartier, repère..."
                        />
                    </Field>

                    <Field label="Complément d'adresse" className="sm:col-span-2">
                        <input
                            value={form.adresse_ligne_2}
                            onChange={(event) => update("adresse_ligne_2", event.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <GeoSelect
                        label="Pays"
                        value={form.pays_id}
                        onChange={(value) => update("pays_id", value)}
                        options={pays ?? []}
                    />
                    <GeoSelect
                        label="Ville"
                        value={form.ville_id}
                        onChange={(value) => update("ville_id", value)}
                        options={villes ?? []}
                    />
                    <GeoSelect
                        label="Commune"
                        value={form.commune_id}
                        onChange={(value) => update("commune_id", value)}
                        options={communes ?? []}
                    />
                    <GeoSelect
                        label="Zone"
                        value={form.zone_id}
                        onChange={(value) => update("zone_id", value)}
                        options={zones ?? []}
                    />

                    <Field label="Code postal">
                        <input
                            value={form.code_postal}
                            onChange={(event) => update("code_postal", event.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-slate-600">
                        <input
                            type="checkbox"
                            checked={form.is_default}
                            onChange={(event) => update("is_default", event.target.checked)}
                            className="h-4 w-4 accent-violet-600"
                        />
                        Définir comme adresse par défaut
                    </label>

                    <Field label="Instructions de livraison" className="sm:col-span-2">
                        <textarea
                            rows={2}
                            value={form.instructions}
                            onChange={(event) => update("instructions", event.target.value)}
                            className={inputClass}
                        />
                    </Field>
                </div>

                {geo.error && (
                    <p className="text-xs text-amber-700">
                        Les listes pays, villes, communes et zones n'ont pas pu être chargées : vous pouvez
                        enregistrer l'adresse sans elles.
                    </p>
                )}

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                    <button type="button" onClick={close} disabled={saving} className={buttonSecondary}>
                        Annuler
                    </button>

                    <button type="submit" disabled={saving} className={buttonPrimary}>
                        {saving ? (
                            <>
                                <LoaderCircle className="animate-spin" size={17} />
                                Enregistrement...
                            </>
                        ) : (
                            "Enregistrer l'adresse"
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

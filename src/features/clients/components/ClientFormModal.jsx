import { useState } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";

import Modal from "../../../components/ui/Modal";
import Field from "../../../components/ui/Field";
import { buttonPrimary, buttonSecondary, inputClass } from "../../../components/ui/formClasses";
import clientService from "../../../services/api/clientService";
import { getApiErrorMessage } from "../../../utils/apiError";

const EMPTY = {
    type_client: "particulier",
    nom: "",
    prenom: "",
    raison_sociale: "",
    telephone: "",
    email: "",
    numero_contribuable: "",
    email_facturation: "",
    telephone_facturation: "",
};

const clean = (value) => value.trim() || null;

/**
 * Création d'un client par le personnel (POST /clients, ClientController::store).
 * Le client n'a pas de compte de connexion : il ne peut pas se connecter tant
 * qu'il ne s'est pas inscrit lui-même.
 *
 * @param onCreated appelé avec le client créé (relation personne incluse)
 */
export default function ClientFormModal({ onClose, onCreated }) {
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const isCompany = form.type_client === "entreprise";

    const update = (name, value) => setForm((previous) => ({ ...previous, [name]: value }));

    const close = () => {
        if (!saving) onClose();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);

        try {
            const created = await clientService.create({
                type_client: form.type_client,
                nom: form.nom.trim(),
                prenom: clean(form.prenom),
                raison_sociale: isCompany ? clean(form.raison_sociale) : null,
                telephone: clean(form.telephone),
                email: clean(form.email),
                numero_contribuable: clean(form.numero_contribuable),
                email_facturation: clean(form.email_facturation),
                telephone_facturation: clean(form.telephone_facturation),
            });

            onCreated(created);
        } catch (err) {
            setError(getApiErrorMessage(err, "Création du client impossible."));
            setSaving(false);
        }
    };

    return (
        <Modal
            title="Nouveau client"
            subtitle="Le client sera disponible immédiatement dans vos listes."
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

                <Field label="Type de client" required>
                    <select
                        required
                        value={form.type_client}
                        onChange={(event) => update("type_client", event.target.value)}
                        className={inputClass}
                    >
                        <option value="particulier">Particulier</option>
                        <option value="entreprise">Entreprise</option>
                    </select>
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {isCompany && (
                        <Field label="Raison sociale" required className="sm:col-span-2">
                            <input
                                required
                                value={form.raison_sociale}
                                onChange={(event) => update("raison_sociale", event.target.value)}
                                className={inputClass}
                            />
                        </Field>
                    )}

                    <Field label={isCompany ? "Nom du contact" : "Nom"} required>
                        <input
                            required
                            value={form.nom}
                            onChange={(event) => update("nom", event.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label={isCompany ? "Prénom du contact" : "Prénom"}>
                        <input
                            value={form.prenom}
                            onChange={(event) => update("prenom", event.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Téléphone">
                        <input
                            type="tel"
                            value={form.telephone}
                            onChange={(event) => update("telephone", event.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="E-mail">
                        <input
                            type="email"
                            value={form.email}
                            onChange={(event) => update("email", event.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Numéro de contribuable">
                        <input
                            value={form.numero_contribuable}
                            onChange={(event) => update("numero_contribuable", event.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="E-mail de facturation">
                        <input
                            type="email"
                            value={form.email_facturation}
                            onChange={(event) => update("email_facturation", event.target.value)}
                            className={inputClass}
                            placeholder="E-mail du client si vide"
                        />
                    </Field>

                    <Field label="Téléphone de facturation">
                        <input
                            type="tel"
                            value={form.telephone_facturation}
                            onChange={(event) => update("telephone_facturation", event.target.value)}
                            className={inputClass}
                            placeholder="Téléphone du client si vide"
                        />
                    </Field>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                    <button type="button" onClick={close} disabled={saving} className={buttonSecondary}>
                        Annuler
                    </button>

                    <button type="submit" disabled={saving} className={buttonPrimary}>
                        {saving ? (
                            <>
                                <LoaderCircle className="animate-spin" size={17} />
                                Création...
                            </>
                        ) : (
                            "Créer le client"
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

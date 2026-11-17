import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const initialForm = {
    nom: "",
    prenom: "",
    email: "",
    telephone: "",

    type_client: "particulier",
    societe: "",
    numero_contribuable: "",

    email_facturation: "",
    telephone_facturation: "",

    // Adresse principale
    adresse_ligne_1: "",
    adresse_ligne_2: "",
    code_postal: "",
    instructions: "",

    password: "",
    password_confirmation: "",
};

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (form.password !== form.password_confirmation) {
            setError("Les deux mots de passe ne correspondent pas.");
            return;
        }

        if (
            form.type_client === "entreprise" &&
            !form.societe.trim()
        ) {
            setError("Veuillez renseigner le nom de votre société.");
            return;
        }

        setSubmitting(true);

        try {
            const adresseRenseignee = Boolean(
                form.adresse_ligne_1.trim()
            );

            const payload = {
                // Compte utilisateur
                name: [form.prenom, form.nom]
                    .filter(Boolean)
                    .join(" ")
                    .trim(),

                email: form.email.trim().toLowerCase(),
                password: form.password,
                password_confirmation: form.password_confirmation,
                device_name: "alliance-transit-web",

                // Informations personnelles
                nom: form.nom.trim(),
                prenom: form.prenom.trim() || null,
                telephone: form.telephone.trim() || null,

                // Profil client
                type_client: form.type_client,

                societe:
                    form.type_client === "entreprise"
                        ? form.societe.trim()
                        : null,

                numero_contribuable:
                    form.numero_contribuable.trim() || null,

                email_facturation:
                    form.email_facturation.trim() || null,

                telephone_facturation:
                    form.telephone_facturation.trim() || null,

                // Adresse principale facultative
                ...(adresseRenseignee && {
                    adresse: {
                        adresse_ligne_1: form.adresse_ligne_1.trim(),
                        adresse_ligne_2:
                            form.adresse_ligne_2.trim() || null,
                        code_postal:
                            form.code_postal.trim() || null,
                        instructions:
                            form.instructions.trim() || null,
                    },
                }),
            };

            await register(payload);

            navigate("/mon-compte", { replace: true });

        } catch (err) {
            const validationErrors = err.response?.data?.errors;

            const firstValidationError = validationErrors
                ? Object.values(validationErrors).flat()[0]
                : null;

            setError(
                firstValidationError ||
                err.response?.data?.message ||
                err.message ||
                "Impossible de créer votre compte."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <form
                className="auth-card"
                onSubmit={handleSubmit}
            >
                <span className="eyebrow">
                    ALLIANCE TRANSIT
                </span>

                <h1>Créer un compte</h1>

                <p>
                    Inscrivez-vous pour accéder à votre espace client.
                </p>

                {error && (
                    <div className="alert-error" role="alert">
                        {error}
                    </div>
                )}

                {/* INFORMATIONS PERSONNELLES */}
                <div className="register-section">
                    <h2>Informations personnelles</h2>

                    <label htmlFor="nom">Nom *</label>
                    <input
                        id="nom"
                        name="nom"
                        type="text"
                        value={form.nom}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        maxLength={255}
                        autoComplete="family-name"
                        required
                    />

                    <label htmlFor="prenom">Prénom</label>
                    <input
                        id="prenom"
                        name="prenom"
                        type="text"
                        value={form.prenom}
                        onChange={handleChange}
                        placeholder="Votre prénom"
                        maxLength={255}
                        autoComplete="given-name"
                    />

                    <label htmlFor="telephone">Téléphone</label>
                    <input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        value={form.telephone}
                        onChange={handleChange}
                        placeholder="+225 07 00 00 00 00"
                        maxLength={30}
                        autoComplete="tel"
                    />
                </div>

                {/* TYPE DE CLIENT */}
                <div className="register-section">
                    <h2>Type de compte</h2>

                    <label htmlFor="type_client">
                        Vous êtes *
                    </label>

                    <select
                        id="type_client"
                        name="type_client"
                        value={form.type_client}
                        onChange={handleChange}
                        required
                    >
                        <option value="particulier">
                            Un particulier
                        </option>

                        <option value="entreprise">
                            Une entreprise
                        </option>
                    </select>

                    {form.type_client === "entreprise" && (
                        <>
                            <label htmlFor="societe">
                                Nom de la société *
                            </label>

                            <input
                                id="societe"
                                name="societe"
                                type="text"
                                value={form.societe}
                                onChange={handleChange}
                                placeholder="Nom de votre entreprise"
                                maxLength={255}
                                required
                            />

                            <label htmlFor="numero_contribuable">
                                Numéro de contribuable
                            </label>

                            <input
                                id="numero_contribuable"
                                name="numero_contribuable"
                                type="text"
                                value={form.numero_contribuable}
                                onChange={handleChange}
                                placeholder="Numéro de contribuable"
                                maxLength={100}
                            />
                        </>
                    )}
                </div>

                {/* ADRESSE PRINCIPALE */}
                <div className="register-section">
                    <h2>Adresse principale</h2>

                    <p>
                        Ces informations sont facultatives.
                        Vous pourrez les compléter ultérieurement.
                    </p>

                    <label htmlFor="adresse_ligne_1">
                        Adresse *
                    </label>

                    <input
                        id="adresse_ligne_1"
                        name="adresse_ligne_1"
                        type="text"
                        value={form.adresse_ligne_1}
                        onChange={handleChange}
                        placeholder="Ex. : Cocody, Riviera 3, rue..."
                        maxLength={255}
                        autoComplete="street-address"
                    />

                    <label htmlFor="adresse_ligne_2">
                        Complément d'adresse
                    </label>

                    <input
                        id="adresse_ligne_2"
                        name="adresse_ligne_2"
                        type="text"
                        value={form.adresse_ligne_2}
                        onChange={handleChange}
                        placeholder="Appartement, immeuble, repère..."
                        maxLength={255}
                    />

                    <label htmlFor="code_postal">
                        Code postal
                    </label>

                    <input
                        id="code_postal"
                        name="code_postal"
                        type="text"
                        value={form.code_postal}
                        onChange={handleChange}
                        placeholder="Code postal"
                        maxLength={20}
                        autoComplete="postal-code"
                    />

                    <label htmlFor="instructions">
                        Instructions complémentaires
                    </label>

                    <textarea
                        id="instructions"
                        name="instructions"
                        value={form.instructions}
                        onChange={handleChange}
                        placeholder="Indications pour trouver facilement votre adresse..."
                        rows={3}
                    />
                </div>

                {/* COMPTE ET FACTURATION */}
                <div className="register-section">
                    <h2>Compte et facturation</h2>

                    <label htmlFor="email">
                        Adresse e-mail *
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="exemple@email.com"
                        maxLength={255}
                        required
                    />

                    <label htmlFor="email_facturation">
                        E-mail de facturation
                    </label>

                    <input
                        id="email_facturation"
                        name="email_facturation"
                        type="email"
                        value={form.email_facturation}
                        onChange={handleChange}
                        placeholder="facturation@email.com"
                    />

                    <label htmlFor="telephone_facturation">
                        Téléphone de facturation
                    </label>

                    <input
                        id="telephone_facturation"
                        name="telephone_facturation"
                        type="tel"
                        value={form.telephone_facturation}
                        onChange={handleChange}
                        placeholder="+225 07 00 00 00 00"
                        maxLength={30}
                    />
                </div>

                {/* SÉCURITÉ */}
                <div className="register-section">
                    <h2>Sécurité du compte</h2>

                    <label htmlFor="password">
                        Mot de passe *
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Minimum 8 caractères"
                        minLength={8}
                        required
                    />

                    <label htmlFor="password_confirmation">
                        Confirmer le mot de passe *
                    </label>

                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        autoComplete="new-password"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        placeholder="Confirmez votre mot de passe"
                        minLength={8}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="button-primary"
                    disabled={submitting}
                >
                    {submitting
                        ? "Création du compte..."
                        : "Créer mon compte"}
                </button>

                <p className="auth-footer">
                    Vous avez déjà un compte ?{" "}
                    <Link to="/connexion">
                        Se connecter
                    </Link>
                </p>

                <p className="auth-footer">
                    <Link to="/">
                        Retour à l'accueil
                    </Link>
                </p>
            </form>
        </main>
    );
}
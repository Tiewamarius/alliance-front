import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ROLE_ROUTES = {
    super_admin: "/admin",
    admin: "/admin",

    agent_service_client: "/service-client",
    agent_commercial: "/commercial",
    agent_exploitation: "/exploitation",
    responsable_transport: "/transport",
    livreur: "/livraison",
    comptable: "/comptabilite",
    responsable_agence: "/agence",

    client: "/mon-compte",
    auditeur: "/audit",
};

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            const response = await login({
                email: email.trim(),
                password,
            });

            // Les rôles peuvent être renvoyés sous forme de chaînes
            // ou d'objets contenant un slug.
            const roles = response?.roles ?? response?.user?.roles ?? [];

            const roleSlugs = roles
                .map((role) =>
                    typeof role === "string"
                        ? role
                        : role?.slug ?? role?.name
                )
                .filter(Boolean);

            // Ordre de priorité si plusieurs rôles sont attribués.
            const rolePriority = [
                "super_admin",
                "admin",
                "responsable_agence",
                "responsable_transport",
                "agent_exploitation",
                "agent_service_client",
                "agent_commercial",
                "comptable",
                "livreur",
                "auditeur",
                "client",
            ];

            const primaryRole = rolePriority.find((role) =>
                roleSlugs.includes(role)
            );

            const destination =
                location.state?.from?.pathname ||
                ROLE_ROUTES[primaryRole] ||
                "/mon-compte";

            navigate(destination, { replace: true });
        } catch (err) {
            const validationErrors = err.response?.data?.errors;

            const firstValidationError = validationErrors
                ? Object.values(validationErrors).flat()[0]
                : null;

            setError(
                firstValidationError ||
                    err.response?.data?.message ||
                    err.message ||
                    "Connexion impossible. Vérifiez vos identifiants."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <span className="eyebrow">ALLIANCE TRANSIT</span>

                <h1>Connexion</h1>
                <p>Accédez à votre espace personnel.</p>

                {error && (
                    <div className="alert-error" role="alert">
                        {error}
                    </div>
                )}

                <label htmlFor="email">Adresse e-mail</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <label htmlFor="password">Mot de passe</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                <p className="auth-help">
                    <Link to="/mot-de-passe-oublie">
                        Mot de passe oublié ?
                    </Link>
                </p>

                <button
                    type="submit"
                    className="button-primary"
                    disabled={submitting}
                >
                    {submitting
                        ? "Connexion en cours..."
                        : "Se connecter"}
                </button>

                <p className="auth-footer">
                    Pas encore de compte ?{" "}
                    <Link to="/inscription">Créer un compte</Link>
                </p>

                <p className="auth-footer">
                    <Link to="/">Retour à l’accueil</Link>
                </p>
            </form>
        </main>
    );
}
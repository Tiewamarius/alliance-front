import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function getErrorMessage(err) {
    const data = err.response?.data;

    const firstValidationError = data?.errors
        ? Object.values(data.errors).flat()[0]
        : null;

    if (firstValidationError) return firstValidationError;
    if (data?.message) return data.message;

    // Pas de réponse HTTP : API arrêtée, mauvaise URL ou blocage CORS.
    if (!err.response && err.request) {
        return import.meta.env.DEV
            ? "API injoignable : vérifiez que Laravel est démarré et que VITE_API_BASE_URL est correct."
            : "Impossible de joindre le serveur. Réessayez dans quelques instants.";
    }

    return err.message || "Connexion impossible. Vérifiez vos identifiants.";
}

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
            // login() renvoie le rôle principal et la page d'accueil du rôle
            // (voir src/config/roles.js).
            const { primaryRole, homePath } = await login({
                email: email.trim(),
                password,
            });

            const requestedDestination = location.state?.from?.pathname;

            // Les administrateurs arrivent toujours sur leur dashboard.
            const destination = ["admin", "super_admin"].includes(primaryRole)
                ? "/admin"
                : requestedDestination || homePath;

            navigate(destination, { replace: true });
        } catch (err) {
            setError(getErrorMessage(err));
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
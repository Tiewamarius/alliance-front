import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";

function getErrorMessage(error) {
    const status = error?.response?.status;

    if (status === 403) return "Vous n'avez pas accès à cette ressource.";
    if (status === 404) return "Ressource introuvable.";

    if (error?.response?.data?.message) return error.response.data.message;

    if (error && !error.response) {
        return "Impossible de joindre le serveur. Vérifiez votre connexion.";
    }

    return error?.message || "Une erreur est survenue.";
}

/**
 * Affiche l'état d'un chargement : spinner, erreur avec bouton Réessayer,
 * message « aucune donnée », ou le contenu (children).
 *
 *   <PageState loading={loading} error={error} onRetry={reload} empty={!rows.length}>
 *       ...contenu...
 *   </PageState>
 *
 * Pendant un rechargement, passez loading={loading && !data} pour garder
 * l'ancien contenu à l'écran.
 */
export default function PageState({
    loading = false,
    error = null,
    empty = false,
    emptyMessage = "Aucune donnée à afficher.",
    onRetry,
    children,
}) {
    if (loading) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minHeight={240}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert
                severity="error"
                action={
                    onRetry ? (
                        <Button color="inherit" size="small" onClick={onRetry}>
                            Réessayer
                        </Button>
                    ) : undefined
                }
            >
                {getErrorMessage(error)}
            </Alert>
        );
    }

    if (empty) {
        return (
            <Typography color="text.secondary" textAlign="center" py={6}>
                {emptyMessage}
            </Typography>
        );
    }

    return children;
}

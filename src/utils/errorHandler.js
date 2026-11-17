export function getErrorMessage(error, fallback = "Une erreur est survenue.") {
    const validationErrors = error?.response?.data?.errors;

    if (validationErrors) {
        const firstError = Object.values(validationErrors).flat()[0];

        if (firstError) {
            return firstError;
        }
    }

    return (
        error?.response?.data?.message ||
        error?.message ||
        fallback
    );
}

export function isUnauthorized(error) {
    return error?.response?.status === 401;
}

export function isForbidden(error) {
    return error?.response?.status === 403;
}
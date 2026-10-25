export function formatCurrency(
    amount,
    currency = "XOF",
    locale = "fr-FR"
) {
    const value = Number(amount);

    if (!Number.isFinite(value)) {
        return "—";
    }

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(value);
}

export default formatCurrency;
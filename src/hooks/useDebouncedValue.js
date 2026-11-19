import { useEffect, useState } from "react";

// Renvoie `value` après `delay` ms sans changement (recherche pendant la frappe).
export default function useDebouncedValue(value, delay = 350) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
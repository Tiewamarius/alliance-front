import { useEffect, useState } from "react";
import axios from "axios";

/**
 * Charge des données au montage et à chaque changement de `deps`.
 * Annule la requête précédente (démontage, changement de page ou de filtre)
 * et ignore les annulations, ce qui évite les doubles requêtes en StrictMode.
 *
 * @param {(signal: AbortSignal) => Promise<any>} fetcher
 *        reçoit le signal d'annulation à transmettre au service :
 *        (signal) => dashboardService.getDashboard({ period }, { signal })
 * @param {Array} deps  valeurs dont dépend la requête (toujours le même nombre)
 * @param {{ enabled?: boolean }} options  enabled=false suspend le chargement
 * @returns {{ data, error, loading, reload }}
 */
export default function useFetch(fetcher, deps = [], { enabled = true } = {}) {
    const [state, setState] = useState({
        data: null,
        error: null,
        loading: enabled,
    });
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!enabled) {
            return undefined;
        }

        const controller = new AbortController();

        // On garde les anciennes données pendant le rechargement (pas de flash).
        setState((previous) => ({ ...previous, loading: true, error: null }));

        fetcher(controller.signal)
            .then((data) => {
                setState({ data, error: null, loading: false });
            })
            .catch((error) => {
                if (axios.isCancel(error)) {
                    return;
                }

                setState((previous) => ({ ...previous, error, loading: false }));
            });

        return () => controller.abort();
        // fetcher est volontairement absent : seules `deps` relancent la requête.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, reloadKey, ...deps]);

    return {
        ...state,
        reload: () => setReloadKey((key) => key + 1),
    };
}
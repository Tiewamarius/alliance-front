import { useCallback, useEffect, useState } from "react";

import clientService from "../../../services/api/clientService";
import referenceService from "../../../services/api/referenceService";
import { toRows } from "../utils";

const PER_PAGE = { per_page: 100 }; // maximum accepté par l'API

const SOURCES = {
    clients: () => clientService.getAll(PER_PAGE),
    statuts: () => referenceService.expeditionStatuts.getAll(PER_PAGE),
    services: () => referenceService.services.getAll(PER_PAGE),
    typesColis: () => referenceService.typesColis.getAll(PER_PAGE),
};

const LABELS = {
    clients: "clients",
    statuts: "statuts",
    services: "services",
    typesColis: "types de colis",
};

const EMPTY = { clients: [], statuts: [], services: [], typesColis: [] };

/**
 * Charge les listes nécessaires au formulaire d'expédition et au filtre par statut.
 * Les adresses ne sont pas chargées ici : elles dépendent du client choisi.
 * Une liste indisponible n'empêche pas les autres de se charger : elle est
 * signalée dans `warning`.
 */
export default function useExpeditionCatalogs() {
    const [catalogs, setCatalogs] = useState(EMPTY);
    const [loading, setLoading] = useState(true);
    const [warning, setWarning] = useState("");

    const load = useCallback(async () => {
        setLoading(true);

        const names = Object.keys(SOURCES);
        const results = await Promise.allSettled(names.map((name) => SOURCES[name]()));

        const next = { ...EMPTY };
        const failed = [];

        results.forEach((result, index) => {
            const name = names[index];

            if (result.status === "fulfilled") {
                next[name] = toRows(result.value);
            } else {
                failed.push(LABELS[name]);
            }
        });

        setCatalogs(next);
        setWarning(failed.length ? `Listes indisponibles : ${failed.join(", ")}.` : "");
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return { ...catalogs, loading, warning, reload: load };
}
import { useEffect, useState } from "react";
import { TODOS_LOS_REGISTROS } from "../models/Api.types";
import type { CampusResponse, TipoEspacioResponse } from "../models/Catalogo.types";
import { getCampuses, getTiposEspacio } from "../Services/Catalogo/catalogo";

//Carga al montar los campus y tipos de espacio para llenar los Select de los formularios
export function useCatalogos() {
    const [campuses, setCampuses] = useState<CampusResponse[]>([]);
    const [tiposEspacio, setTiposEspacio] = useState<TipoEspacioResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        //Evita actualizar el estado si el usuario sale de la pantalla antes de la respuesta
        let active = true;

        Promise.all([getCampuses(TODOS_LOS_REGISTROS), getTiposEspacio(TODOS_LOS_REGISTROS)])
            .then(([campusesResponse, tiposResponse]) => {
                if (!active) return;
                setCampuses(campusesResponse.data?.items ?? []);
                setTiposEspacio(tiposResponse.data?.items ?? []);
            })
            .catch((error) => {
                if (active) setError((error as Error).message);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    return {
        campuses,
        tiposEspacio,
        loading,
        error
    };
}

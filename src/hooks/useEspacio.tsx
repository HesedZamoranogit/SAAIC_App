import { useCallback, useState } from "react";
import type { EspacioRequest, EspacioResponse } from "../models/Espacio.types";
import type { ApiResponse, PagedRequest, PagedResult } from "../models/Api.types";
import { Espacio, getEspacios } from "../Services/Espacio/espacio";


export function useEspacio() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //useCallback mantiene la misma referencia entre renders, asi se pueden usar dentro de un useEffect
    const espacio = useCallback(async (dto: EspacioRequest): Promise<ApiResponse<EspacioResponse> | undefined> => {
        setLoading(true);
        setError(null);

        try {
            const response = await Espacio(dto);
            setLoading(false);
            return response;
        } catch (error) {
            setError((error as Error).message);
            setLoading(false);
            return undefined;
        }

    }, []);
    const GetEspacios = useCallback(async (params: PagedRequest, idCampus?: number, idTipoEspacio?: number, estado?: number): Promise<ApiResponse<PagedResult<EspacioResponse>> | undefined> => {
        setLoading(true);
        setError(null);

        try {
            const response = await getEspacios(params, idCampus, idTipoEspacio, estado);
            setLoading(false);
            return response;
        } catch (error) {
            setError((error as Error).message);
            setLoading(false);
            return undefined;
        }

    }, []);

    return {
        espacio,
        GetEspacios,
        loading,
        error
    };
}

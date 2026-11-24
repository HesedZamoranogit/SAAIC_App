import { useCallback, useState } from "react";
import type { ApiResponse } from "../models/Api.types";
import type { PerfilResponse } from "../models/Auth.types";
import { getPerfil } from "../Services/Auth/perfil";

export function usePerfil() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //useCallback mantiene la misma referencia entre renders, asi se puede usar dentro de un useEffect
    const GetPerfil = useCallback(async (): Promise<ApiResponse<PerfilResponse> | undefined> => {
        setLoading(true);
        setError(null);

        try {
            const response = await getPerfil();
            setLoading(false);
            return response;
        } catch (error) {
            setError((error as Error).message);
            setLoading(false);
            return undefined;
        }

    }, []);

    return {
        GetPerfil,
        loading,
        error
    };
}

import {useEffect, useState} from "react";
import type {PagedResult} from "../models/Api.types";
import type {ReserveResponse } from "../models/reserve.type";
import {getMisReservas} from "../Services/Reserve/reserve";


const PAGE_SIZE = 10; // Tamaño de página fijo para la paginación ESTO PUEDE CAMBIAR

export function useMisReservas() {
    const [pageNumber, setPageNumber] = useState(1);
  const [pageData, setPageData] =
    useState<PagedResult<ReserveResponse> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

    setLoading(true);
    setError(null);

        getMisReservas({ pageNumber, pageSize: PAGE_SIZE })
        .then((response) => {
            if(active && response.data) setPageData(response.data);
        })
        .catch((error: unknown) => {
            if(active){
                setError(
                    error instanceof Error
                    ? error.message
                    : "Error desconocido al obtener las reservas"
                );
            }    
        })
        .finally(() => {
            if(active) setLoading(false);  

        });

        return () => {
            active = false;
        };
    }, [pageNumber]);

    return { reservas: pageData?.items ?? [],
    pageNumber,
    totalPages: pageData?.totalPages ?? 0,
    hasPreviousPage: pageData?.hasPreviousPage ?? false,
    hasNextPage: pageData?.hasNextPage ?? false,
    setPageNumber,
    loading,
    error, };
}
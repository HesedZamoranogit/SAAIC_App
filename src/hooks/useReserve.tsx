import { useState } from "react";
import type { ApiResponse } from "../models/Api.types";
import type { ReservePerPeriod , ReserveShift , ReserveResponse, ReserveSemester } from "../models/reserve.type";
import { reservePerPeriod, reserveSemester, reserveShift } from "../Services/Reserve/reserve";

export function useReserve() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function ReservePerPeriod(dto: ReservePerPeriod): Promise<ApiResponse<ReserveResponse> | undefined> {
        setLoading(true);
        setError(null);

        try {
            const response = await reservePerPeriod(dto);
            setLoading(false);
            return response;
        } catch (error) {
            setError((error as Error).message);
            setLoading(false);
            return undefined;
        }

    }
    async function ReserveShift(dto: ReserveShift): Promise<ApiResponse<ReserveResponse> | undefined> {
        setLoading(true);
        setError(null);

        try {
            const response = await reserveShift(dto);
            setLoading(false);
            return response;
        } catch (error) {
            setError((error as Error).message);
            setLoading(false);
            return undefined;
        }

    }
    async function ReserveSemester(dto: ReserveSemester): Promise<ApiResponse<ReserveResponse> | undefined> {
        setLoading(true);
        setError(null);
        
        try {
            const response = await reserveSemester(dto);
            setLoading(false);
            return response;
        } catch (error) {
            setError((error as Error).message);
            setLoading(false);
            return undefined;
        }
    
    }

    return {
        ReservePerPeriod,
        ReserveShift,
        ReserveSemester,
        loading,
        error
    };
}

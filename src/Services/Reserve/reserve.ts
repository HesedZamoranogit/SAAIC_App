import type { ApiResponse, PagedRequest, PagedResult} from "../../models/Api.types";
import type {
  ReservaInstanciaDiaria,
  ReservePerPeriod,
  ReserveResponse,
  ReserveSemester,
  ReserveShift,
} from "../../models/reserve.type";
import { api } from "../api";
import { getErrorMessage } from "../apiError";

export const reservePerPeriod = async (
  dto: ReservePerPeriod,
): Promise<ApiResponse<ReserveResponse>> => {
  try {
    const { data } = await api.post<ApiResponse<ReserveResponse>>(
      "/Reservas/por-periodo",
      dto,
    );

    if (!data.success || !data.data) {
      throw new Error(data.message ?? "No se pudo realizar la reserva por periodo.");
    }
    return data;
  } catch (error) {
    //getErrorMessage rescata el mensaje de la API (ej. choque de horario, aforo, espacio en mantenimiento)
    throw new Error(getErrorMessage(error, "No se pudo realizar la reserva por periodo."), { cause: error });
  }
};

export const reserveShift = async (
  dto: ReserveShift,
): Promise<ApiResponse<ReserveResponse>> => {
  try {
    const { data } = await api.post<ApiResponse<ReserveResponse>>(
      "/Reservas/por-jornada",
      dto,
    );

    if (!data.success || !data.data) {
      throw new Error(data.message ?? "No se pudo realizar la reserva por jornada.");
    }

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "No se pudo realizar la reserva por jornada."), { cause: error });
  }
};

export const reserveSemester = async (
  dto: ReserveSemester,
): Promise<ApiResponse<ReserveResponse>> => {
  try {
    const { data } = await api.post<ApiResponse<ReserveResponse>>(
      "/Reservas/semestral",
      dto,
    );
    if (!data.success || !data.data) {
      throw new Error(data.message ?? "No se pudo realizar la reserva semestral.");
    }

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "No se pudo realizar la reserva semestral."), { cause: error });
  }
};

//Reservas confirmadas (por dia) dentro de un rango yyyy-MM-dd; con idEspacio solo las de ese espacio
export const getCalendario = async (
  fechaInicio: string,
  fechaFin: string,
  idEspacio?: number,
): Promise<ApiResponse<ReservaInstanciaDiaria[]>> => {
  try {
    const { data } = await api.get<ApiResponse<ReservaInstanciaDiaria[]>>(
      "/Reservas/calendario",
      { params: { fechaInicio, fechaFin, idEspacio } },
    );
    if (!data.success || !data.data) {
      throw new Error(data.message ?? "No se pudo obtener la disponibilidad.");
    }

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "No se pudo obtener la disponibilidad."), { cause: error });
  }
};

export const getMisReservas = async (params:PagedRequest,): Promise<ApiResponse<PagedResult<ReserveResponse>>> => {
  try{
    const { data } = await api.get<ApiResponse<PagedResult<ReserveResponse>>>(
      "/reservas", {params}
    );
    if (!data.success || !data.data) {
      throw new Error(data.message ?? "No se pudieron obtener las reservas.");
    }
    
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "No se pudieron obtener las reservas."), { cause: error });
  }

}
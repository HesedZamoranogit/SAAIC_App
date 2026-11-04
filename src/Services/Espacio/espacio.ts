import { api } from "../api";
import { getErrorMessage } from "../apiError";
import type { ApiResponse, PagedRequest, PagedResult } from "../../models/Api.types";
import type {
  EspacioRequest,
  EspacioResponse,
} from "../../models/Espacio.types";

export const Espacio = async (
  dto: EspacioRequest,
): Promise<ApiResponse<EspacioResponse>> => {
  try {

    const { data } = await api.post<ApiResponse<EspacioResponse>>(
      "/Espacios",
      dto,
    );
     if (!data.success || !data.data) {
      throw new Error(data.message ?? "No se pudo crear el espacio.");
    }

    return data;

  } catch (error) {
    //getErrorMessage rescata el mensaje de la API (ej. "Ya existe un espacio llamado...")
    throw new Error(getErrorMessage(error, "No se pudo crear el espacio."), { cause: error });
  }
};

export const getEspacios = async (params: PagedRequest,idCampus?: number, idTipoEspacio?: number, estado?: number): Promise<ApiResponse<PagedResult<EspacioResponse>>> => {
  try {
    const { data } = await api.get<ApiResponse<PagedResult<EspacioResponse>>>(
      "/Espacios", { params: { ...params, idCampus, idTipoEspacio, estado } },   
    );
    if (!data.success || !data.data) {
      throw new Error(data.message ?? "No se pudo obtener los espacios.");
    }
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "No se pudo obtener los espacios."), { cause: error });
  }
}

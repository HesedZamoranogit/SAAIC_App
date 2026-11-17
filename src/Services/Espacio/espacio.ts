import { api } from "../api";
import { getErrorMessage } from "../apiError";
import type { ApiResponse, PagedRequest, PagedResult } from "../../models/Api.types";
import type {
  ActualizarEspacioRequest,
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

//Un espacio por id (la API lo devuelve aunque este inactivo)
export const getEspacioPorId = async (id: number): Promise<ApiResponse<EspacioResponse>> => {
  try {
    const { data } = await api.get<ApiResponse<EspacioResponse>>(`/Espacios/${id}`);
    if (!data.success || !data.data) {
      throw new Error(data.message ?? "No se pudo obtener el espacio.");
    }
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "No se pudo obtener el espacio."), { cause: error });
  }
};

//Solo administrador (la API tambien lo exige)
export const actualizarEspacio = async (
  id: number,
  dto: ActualizarEspacioRequest,
): Promise<ApiResponse<EspacioResponse>> => {
  try {
    const { data } = await api.put<ApiResponse<EspacioResponse>>(`/Espacios/${id}`, dto);
    if (!data.success || !data.data) {
      throw new Error(data.message ?? "No se pudo actualizar el espacio.");
    }
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "No se pudo actualizar el espacio."), { cause: error });
  }
};

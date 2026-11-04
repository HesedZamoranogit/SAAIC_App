import { api } from "../api";
import { getErrorMessage } from "../apiError";
import type { ApiResponse, PagedRequest, PagedResult } from "../../models/Api.types";
import type {
  CampusResponse,
  TipoEspacioResponse,
} from "../../models/Catalogo.types";

export const getCampuses = async (
  params: PagedRequest,
): Promise<ApiResponse<PagedResult<CampusResponse>>> => {
  try {
    const { data } = await api.get<ApiResponse<PagedResult<CampusResponse>>>(
      "/Catalogos/campuses",
      { params },
    );
    if (!data.success || !data.data) {
      throw new Error(data.message ?? "No se pudieron obtener los campus.");
    }

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "No se pudieron obtener los campus."), { cause: error });
  }
};

export const getTiposEspacio = async (
  params: PagedRequest,
): Promise<ApiResponse<PagedResult<TipoEspacioResponse>>> => {
  try {
    const { data } = await api.get<ApiResponse<PagedResult<TipoEspacioResponse>>>(
      "/Catalogos/tipos-espacio",
      { params },
    );
    if (!data.success || !data.data) {
      throw new Error(data.message ?? "No se pudieron obtener los tipos de espacio.");
    }

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "No se pudieron obtener los tipos de espacio."), { cause: error });
  }
};

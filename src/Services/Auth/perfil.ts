import { api } from "../api";
import { getErrorMessage } from "../apiError";
import type { ApiResponse } from "../../models/Api.types";
import type { PerfilResponse } from "../../models/Auth.types";

//GET /Auth/perfil: datos del usuario autenticado (la API lo identifica por el token)
export const getPerfil = async (): Promise<ApiResponse<PerfilResponse>> => {
  try {
    const { data } = await api.get<ApiResponse<PerfilResponse>>("/Auth/perfil");
    if (!data.success || !data.data) {
      throw new Error(data.message ?? "No se pudieron obtener tus datos.");
    }

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "No se pudieron obtener tus datos."), { cause: error });
  }
};

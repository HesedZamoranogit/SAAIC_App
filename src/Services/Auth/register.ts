import type { ApiResponse } from "../../models/Api.types";
import type { RegistrarUsuarioRequest } from "../../models/Auth.types";
import { getErrorMessage } from "../apiError";
import { api } from "../api";

export const registerUser = async (
  request: RegistrarUsuarioRequest,
): Promise<void> => {
  try {
    const { data } = await api.post<ApiResponse<unknown>>(
      "/Auth/registro",
      {
        idInstitucional: request.idInstitucional.trim(),
        email: request.email.trim(),
        password: request.password,
        nombreCompleto: request.nombreCompleto.trim(),
        departamento: request.departamento.trim(),
        rol: request.rol,
      },
    );

    if (!data.success) {
      throw new Error(data.message ?? "No se pudo registrar el usuario.");
    }
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "No se pudo registrar el usuario."),
      { cause: error },
    );
  }
};
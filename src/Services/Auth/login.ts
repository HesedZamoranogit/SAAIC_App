import { api } from "../api";
import type { ApiResponse } from "../../models/Api.types";
import type {
  AuthResponse,
  LoginRequest,
  Session,
} from "../../models/Auth.types";
import { ROL_API_ADMINISTRADOR } from "../../types/usuario";

//Convierte la respuesta de la API en la sesion que usa la aplicacion
const toSession = (auth: AuthResponse): Session => ({
  token: auth.token,
  expiresAtUtc: auth.expiresAtUtc,
  user: {
    id: auth.userId,
    email: auth.email,
    nombreCompleto: auth.nombreCompleto,
    idInstitucional: auth.idInstitucional,
    rol: auth.roles.includes(ROL_API_ADMINISTRADOR) ? "admin" : "usuario",
  },
});

//POST /Auth/login
export const login = async (request: LoginRequest): Promise<Session> => {
  try {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/Auth/login", {
      idInstitucional: request.idInstitucional.trim(),
      password: request.password,
    });

    if (!data.success || !data.data) {
      throw new Error(data.message ?? "No se pudo iniciar sesión.");
    }

    return toSession(data.data);
  } catch (error) {

    throw new Error((error as Error).message);
    
  }
};

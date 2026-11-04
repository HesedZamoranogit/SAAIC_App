import type { Rol } from '../types/usuario';

//POST /Auth/login
export type LoginRequest = {
  idInstitucional: string;
  password: string;
};

//Respuesta de la API (AuthResponseDto)
export type AuthResponse = {
  token: string;
  expiresAtUtc: string;
  userId: string;
  email: string;
  nombreCompleto: string;
  idInstitucional: string;
  roles: string[];
};

//Usuario autenticado tal como lo usa la aplicacion
export type SessionUser = {
  id: string;
  email: string;
  nombreCompleto: string;
  idInstitucional: string;
  rol: Rol;
};

//Sesion que se persiste en el navegador
export type Session = {
  token: string;
  expiresAtUtc: string;
  user: SessionUser;
};

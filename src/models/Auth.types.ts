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

//Respuesta de GET /Auth/perfil: se arma con los claims del token, por eso cualquiera puede venir null
export type PerfilResponse = {
  userId: string;
  email: string | null;
  nombreCompleto: string | null;
  idInstitucional: string | null;
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

export type RolSistema = 'Profesor' | 'Administrador';

export type RegistrarUsuarioRequest = {
  idInstitucional: string;
  email: string;
  password: string;
  nombreCompleto: string;
  departamento: string;
  rol: RolSistema;
};

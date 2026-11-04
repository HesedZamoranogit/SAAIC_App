import axios from "axios";
import { clearSession, getToken } from "./Auth/session";

const API_URL = import.meta.env.VITE_API_LOCAL;

//Configuracion de axios para la comunicacion con el backend de manera
//centralizada solamente utilizando api.get, api.post, api.put, etc.
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "json",
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  }
});

//Callback que registra el AuthProvider para cerrar la sesion en la interfaz
let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler;
};

//Adjunta el token JWT en cada peticion
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Si la API responde 401 (token vencido o invalido) se limpia la sesion
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearSession();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

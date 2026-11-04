import axios from 'axios';
import type { ApiResponse } from '../models/Api.types';

const FALLBACK = 'Ocurrió un error inesperado. Intenta de nuevo.';

//Convierte cualquier error de una peticion en un mensaje listo para mostrar al usuario
export const getErrorMessage = (error: unknown, fallback = FALLBACK): string => {
  if (axios.isAxiosError<Partial<ApiResponse<unknown>>>(error)) {
    if (error.code === 'ERR_CANCELED') return '';
    if (error.code === 'ECONNABORTED') return 'El servidor tardó demasiado en responder.';
    if (!error.response) return 'No se pudo conectar con el servidor.';

    const { status, data } = error.response;
    if (status === 401) return 'Tu sesión expiró. Inicia sesión de nuevo.';
    if (status === 403) return 'No tienes permiso para realizar esta acción.';

    //La API responde { message, errors[] } en validaciones y reglas de negocio
    if (data?.message) {
      const detalle = data.errors?.length ? ` ${data.errors.join(' ')}` : '';
      return `${data.message}${detalle}`;
    }
    if (status >= 500) return 'Ocurrió un error en el servidor. Intenta más tarde.';
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

//Indica si la peticion fue cancelada a proposito (ej. cambio de pantalla)
export const isCanceled = (error: unknown) => axios.isCancel(error);

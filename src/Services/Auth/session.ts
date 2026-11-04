import type { Session } from '../../models/Auth.types';

const STORAGE_KEY = 'saaic.session';

const isExpired = (session: Session) => new Date(session.expiresAtUtc).getTime() <= Date.now();

//Lee la sesion guardada; si esta vencida o corrupta la descarta
export const getStoredSession = (): Session | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as Session;
    if (!session?.token || !session.user || isExpired(session)) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    clearSession();
    return null;
  }
};

export const saveSession = (session: Session) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    //Almacenamiento no disponible: la sesion vive solo en memoria
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    //Sin almacenamiento no hay nada que limpiar
  }
};

export const getToken = (): string | null => getStoredSession()?.token ?? null;

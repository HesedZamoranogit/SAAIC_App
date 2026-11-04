import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { LoginRequest, SessionUser } from '../models/Auth.types';
import { setUnauthorizedHandler } from '../Services/api';
import { login as loginRequest } from '../Services/Auth/login';
import { clearSession, getStoredSession, saveSession } from '../Services/Auth/session';
import { AuthContext, type AuthContextValue } from './authContext';

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  //Se restaura la sesion guardada al iniciar la aplicacion
  const [user, setUser] = useState<SessionUser | null>(() => getStoredSession()?.user ?? null);

  const login = useCallback(async (credentials: LoginRequest) => {
    const session = await loginRequest(credentials);
    saveSession(session);
    setUser(session.user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  //Cuando la API responde 401 se cierra la sesion y las rutas protegidas redirigen al login
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

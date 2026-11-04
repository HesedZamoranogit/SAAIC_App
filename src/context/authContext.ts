import { createContext } from 'react';
import type { LoginRequest, SessionUser } from '../models/Auth.types';

export type AuthContextValue = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

//Acceso a la sesion: const { user, login, logout } = useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  }
  return context;
};

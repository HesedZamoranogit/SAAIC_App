import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type FromState = { from?: { pathname: string; search?: string } } | null;

//Solo usuarios autenticados; si no, se envia al login recordando a donde iban
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return <Outlet />;
};

//Solo administradores (va dentro de ProtectedRoute); el resto vuelve al Home. La API tambien lo valida
export const AdminRoute = () => {
  const { user } = useAuth();

  if (user?.rol !== 'admin') {
    return <Navigate to="/Home" replace />;
  }
  return <Outlet />;
};

//Solo usuarios sin sesion (login); con sesion se envia a la ruta pendiente o al Home
export const GuestRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const from = (location.state as FromState)?.from;
    return <Navigate to={from ? `${from.pathname}${from.search ?? ''}` : '/Home'} replace />;
  }
  return <Outlet />;
};

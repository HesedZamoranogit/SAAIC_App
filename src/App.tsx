import { lazy, Suspense } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { AdminRoute, GuestRoute, ProtectedRoute } from './components/auth/AuthRoutes'
import AppLayout from './components/layout/AppLayout'
import AuthProvider from './context/AuthProvider'

//Inicializacion de Lazy Loading
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Catalogo = lazy(() => import('./pages/Catalogo'));
const NuevoEspacio = lazy(() => import('./pages/NuevoEspacio'));
const EditarEspacio = lazy(() => import('./pages/EditarEspacio'));
const NuevaReserva = lazy(() => import('./pages/NuevaReserva'));
const MisReservas= lazy(() => import('./pages/MisReservas'));
const Reportes = lazy(() => import('./pages/Reportes'));
const Usuarios = lazy(() => import('./pages/Usuarios'));

function App() {

  //Enrutamiento basico
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Solo sin sesion */}
              <Route element={<GuestRoute />}>
                <Route path='/' element={<Login />} />
              </Route>

              {/* Solo con sesion, dentro del layout con Sidebar */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path='/Home' element={<Home />} />
                  <Route path='/catalogo' element={<Catalogo />} />
                  <Route path='/reservas/nueva' element={<NuevaReserva />} />
                  <Route path='/reservas' element={<MisReservas />} />

                  {/* Solo administrador */}
                  <Route element={<AdminRoute />}>
                    <Route path='/espacios/nuevo' element={<NuevoEspacio />} />
                    <Route path='/espacios/:id/editar' element={<EditarEspacio />} />
                    <Route path='/reportes' element={<Reportes />} />
                    <Route path='/usuarios' element={<Usuarios />} />
                  </Route>
                </Route>
              </Route>

              {/* Rutas aun sin pagina */}
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App

import { lazy, Suspense } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import type { Rol } from './types/usuario'

//Inicializacion de Lazy Loading
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));

//Pendiente: obtener el rol del usuario autenticado
const ROL_ACTUAL: Rol = 'admin';

function App() {

  //Enrutamiento basico
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<Login />} />
            {/* Paginas internas con Sidebar */}
            <Route element={<AppLayout rol={ROL_ACTUAL} />}>
              <Route path='/Home' element={<Home rol={ROL_ACTUAL} />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App

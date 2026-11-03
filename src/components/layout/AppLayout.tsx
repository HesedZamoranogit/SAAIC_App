import { useId, useState } from 'react';
import { Outlet } from 'react-router-dom';
import type { Rol } from '../../types/usuario';
import Sidebar from './Sidebar';

type AppLayoutProps = {
  rol: Rol;
};

//Estructura comun de las paginas internas: Sidebar + contenido
const AppLayout = ({ rol }: AppLayoutProps) => {
  //Solo aplica en pantallas pequeñas, donde el Sidebar es un menu deslizable
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarId = useId();

  const closeMenu = () => setMenuOpen(false);

  return (
    <div
      className="app-layout"
      onKeyDown={(e) => {
        if (e.key === 'Escape') closeMenu();
      }}
    >
      <header className="app-topbar">
        <button
          type="button"
          className="app-topbar__toggle"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls={sidebarId}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {/* Icono menu */}
          <span className="icon-slot" aria-hidden="true" />
        </button>
        <p className="app-topbar__brand">SAAIC</p>
      </header>

      <Sidebar id={sidebarId} rol={rol} open={menuOpen} onNavigate={closeMenu} />

      {menuOpen && <div className="app-layout__backdrop" aria-hidden="true" onClick={closeMenu} />}

      <main className="app-layout__main">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;

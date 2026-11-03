import { useId } from 'react';
import { NavLink } from 'react-router-dom';
import type { Rol } from '../../types/usuario';
import { NAV_GROUPS } from './navigation';
import UserMenu from './UserMenu';

type SidebarProps = {
  id?: string;
  rol: Rol;
  //Estado del menu en pantallas pequeñas
  open?: boolean;
  onNavigate?: () => void;
};

const Sidebar = ({ id, rol, open = false, onNavigate }: SidebarProps) => {
  const baseId = useId();

  return (
    <aside id={id} className={`sidebar${open ? ' sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <div className="sidebar__logo" aria-hidden="true">
          {/* Icono calendar */}
        </div>
        <div>
          <p className="sidebar__brand-name">SAAIC</p>
          <p className="sidebar__brand-tagline">Sistema de Reserva de Espacios</p>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Navegación principal">
        {NAV_GROUPS.map((group, index) => {
          const items = group.items.filter((item) => !item.roles || item.roles.includes(rol));
          if (items.length === 0) return null;

          const titleId = `${baseId}-group-${index}`;

          return (
            <section key={group.title} className="sidebar__group" aria-labelledby={titleId}>
              <h2 id={titleId} className="sidebar__group-title">
                {group.title}
              </h2>
              <ul className="sidebar__list" role="list">
                {items.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} className="sidebar__link" onClick={onNavigate}>
                      {/* Icono de la seccion */}
                      <span className="icon-slot" aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </nav>

      <UserMenu nombre="Carlos Andres Valdez Acosta" estado="Usuario Activo" />
    </aside>
  );
};

export default Sidebar;

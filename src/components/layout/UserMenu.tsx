import { useId, useState } from 'react';
import { Link } from 'react-router-dom';

type UserMenuProps = {
  nombre: string;
  estado: string;
};

const UserMenu = ({ nombre, estado }: UserMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  const close = () => setOpen(false);

  return (
    <div
      className="user-menu"
      onKeyDown={(e) => {
        if (e.key === 'Escape') close();
      }}
    >
      {open && (
        <ul id={menuId} className="user-menu__dropdown" role="list">
          <li>
            <Link to="/mis-datos" className="user-menu__item" onClick={close}>
              {/* Icono folder-multiple */}
              <span className="icon-slot" aria-hidden="true" />
              Mis Datos
            </Link>
          </li>
          <li>
            <Link to="/cambiar-contrasena" className="user-menu__item" onClick={close}>
              {/* Icono briefcase */}
              <span className="icon-slot" aria-hidden="true" />
              Cambiar Contraseña
            </Link>
          </li>
          <li>
            <Link to="/" className="user-menu__item user-menu__item--danger" onClick={close}>
              {/* Icono logout */}
              <span className="icon-slot" aria-hidden="true" />
              Cerrar Sesión
            </Link>
          </li>
        </ul>
      )}

      <button
        type="button"
        className="user-menu__trigger"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="user-menu__avatar" aria-hidden="true" />
        <span className="user-menu__info">
          <span className="user-menu__name">{nombre}</span>
          <span className="user-menu__status">{estado}</span>
        </span>
        {/* Icono chevron-up */}
        <span className="icon-slot user-menu__chevron" aria-hidden="true" />
      </button>
    </div>
  );
};

export default UserMenu;

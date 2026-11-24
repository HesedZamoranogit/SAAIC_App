import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MisDatosModal from '../users/MisDatosModal';

type UserMenuProps = {
  nombre: string;
  estado: string;
  onLogout: () => void;
};

const UserMenu = ({ nombre, estado, onLogout }: UserMenuProps) => {
  const [open, setOpen] = useState(false);
  const [misDatosOpen, setMisDatosOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => setOpen(false);

  const openMisDatos = () => {
    close();
    setMisDatosOpen(true);
  };

  //El menu ya se cerro al abrir el modal, asi que al cerrarlo el foco vuelve al boton del usuario.
  //Se hace en el cleanup porque ahi el modal ya salio del DOM; con el modal abierto el navegador ignora el foco de lo de afuera
  useEffect(() => {
    if (!misDatosOpen) return;

    const trigger = triggerRef.current;
    return () => trigger?.focus();
  }, [misDatosOpen]);

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
            <button type="button" className="user-menu__item" onClick={openMisDatos}>
              {/* Icono folder-multiple */}
              <span className="icon-slot" aria-hidden="true" />
              Mis Datos
            </button>
          </li>
          <li>
            <Link to="/cambiar-contrasena" className="user-menu__item" onClick={close}>
              {/* Icono briefcase */}
              <span className="icon-slot" aria-hidden="true" />
              Cambiar Contraseña
            </Link>
          </li>
          <li>
            <button type="button" className="user-menu__item user-menu__item--danger" onClick={onLogout}>
              {/* Icono logout */}
              <span className="icon-slot" aria-hidden="true" />
              Cerrar Sesión
            </button>
          </li>
        </ul>
      )}

      <button
        ref={triggerRef}
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

      {misDatosOpen && <MisDatosModal onClose={() => setMisDatosOpen(false)} />}
    </div>
  );
};

export default UserMenu;

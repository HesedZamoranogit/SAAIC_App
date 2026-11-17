import { useEffect, useId, useRef, useState, type FocusEvent } from 'react';

type EspacioMenuProps = {
  //Para que el lector de pantalla diga de cual espacio es el menu
  nombre: string;
  onEditar: () => void;
};

//Menu de los 3 puntos de la tarjeta de un espacio (solo se muestra al administrador)
const EspacioMenu = ({ nombre, onEditar }: EspacioMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRef = useRef<HTMLButtonElement>(null);

  //Con el menu abierto: el foco pasa a la primera opcion, un clic fuera o Escape lo cierran
  useEffect(() => {
    if (!open) return;

    itemRef.current?.focus();

    const handlePointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  //Con Tab el foco sale del menu: se cierra (relatedTarget es null cuando se hace clic en una zona sin foco)
  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) setOpen(false);
  };

  const handleEditar = () => {
    setOpen(false);
    onEditar();
  };

  return (
    <div ref={containerRef} className="espacio-menu" onBlur={handleBlur}>
      <button
        ref={triggerRef}
        type="button"
        className="espacio-menu__trigger"
        aria-label={`Opciones de ${nombre}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((prev) => !prev)}
      >
        {/* Tres puntos verticales */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {open && (
        <ul id={menuId} className="espacio-menu__dropdown" role="menu" aria-label={`Opciones de ${nombre}`}>
          <li role="none">
            <button ref={itemRef} type="button" className="espacio-menu__item" role="menuitem" onClick={handleEditar}>
              {/* Lapiz */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10.5 2.5l3 3L5 14H2v-3l8.5-8.5z" />
              </svg>
              Editar
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default EspacioMenu;

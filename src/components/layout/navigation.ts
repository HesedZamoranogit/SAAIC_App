import type { Rol } from '../../types/usuario';

export type NavItem = {
  label: string;
  to: string;
  //Si se define, solo esos roles ven la opcion
  roles?: Rol[];
};

export type NavGroup = {
  roles?: Rol[];
  title: string;
  items: NavItem[];
};

//Estructura del menu lateral (Figma: Sidebar)
export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Principal',
    items: [{ label: 'Dashboard', to: '/Home' }],
  },
  {
    title: 'Centro General',
    items: [
      { label: 'Catálogo de Espacios', to: '/catalogo' },
      { label: 'Reservas', to: '/reservas' },
      { label: 'Reportes', to: '/reportes', roles: ['admin'] },
      { label: 'Asistencia', to: '/asistencia' },
    ],
  },
  {
    roles: ['admin'],
    title: 'Centro Administrativo',
    items: [
      { label: 'Usuarios', to: '/usuarios' }, //Todo el crud de usuarios
      { label: 'Espacios', to: '/espacios' }, //aqui ira la agregacion de tipo de espacio, campus, y el espacio nuevamente en si
    ],
  },
];

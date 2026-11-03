import type { Rol } from '../../types/usuario';

export type NavItem = {
  label: string;
  to: string;
  //Si se define, solo esos roles ven la opcion
  roles?: Rol[];
};

export type NavGroup = {
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
    title: 'Centro de Reservas',
    items: [
      { label: 'Catálogo de Espacios', to: '/catalogo' },
      { label: 'Reservas', to: '/reservas' },
      { label: 'Reportes', to: '/reportes', roles: ['admin'] },
      { label: 'Asistencia', to: '/asistencia' },
    ],
  },
  {
    title: 'Centro Administrativo',
    items: [
      { label: 'Nuevo Usuario', to: '/usuarios/nuevo', roles: ['admin'] },
      { label: 'Mis Datos', to: '/mis-datos' },
      { label: 'Cambiar Contraseña', to: '/cambiar-contrasena' },
    ],
  },
];

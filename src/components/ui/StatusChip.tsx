export type Estado =
  | 'Confirmada'
  | 'Pendiente'
  | 'Rechazada'
  | 'Finalizada'
  | 'En curso'
  | 'Disponible'
  | 'Ocupada'
  | 'Mantenimiento';

//Cada estado se agrupa en un tono definido en components.css
const TONOS: Record<Estado, 'info' | 'success' | 'warning' | 'danger'> = {
  Confirmada: 'info',
  Pendiente: 'warning',
  Ocupada: 'warning',
  Rechazada: 'danger',
  Mantenimiento: 'danger',
  Finalizada: 'success',
  'En curso': 'success',
  Disponible: 'success',
};

type StatusChipProps = {
  estado: Estado;
};

const StatusChip = ({ estado }: StatusChipProps) => {
  return <span className={`chip chip--${TONOS[estado]}`}>{estado}</span>;
};

export default StatusChip;

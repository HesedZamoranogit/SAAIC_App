import { useId } from 'react';
import { ESTADO_ESPACIO, esReservable, type EstadoEspacio, type EspacioResponse } from '../../models/Espacio.types';
import { formatHora } from '../../utils/fecha';
import Button from '../ui/Button';
import StatusChip, { type Estado } from '../ui/StatusChip';

type EspacioCardProps = {
  espacio: EspacioResponse;
  //Se ejecuta al pulsar "Reservar"; si no se pasa, el boton no se muestra
  onReservar?: (espacio: EspacioResponse) => void;
};

const ESTADO_CHIP: Record<EstadoEspacio, Estado> = {
  [ESTADO_ESPACIO.Disponible]: 'Disponible',
  [ESTADO_ESPACIO.Mantenimiento]: 'Mantenimiento',
  [ESTADO_ESPACIO.Ocupado]: 'Ocupada',
};

const EspacioCard = ({ espacio, onReservar }: EspacioCardProps) => {
  const titleId = useId();

  return (
    <article className="espacio-card" aria-labelledby={titleId}>
      <header className="espacio-card__header">
        <div className="espacio-card__heading">
          <h2 id={titleId} className="espacio-card__title">
            {espacio.nombre}
          </h2>
          <p className="espacio-card__subtitle">
            {espacio.nombreTipoEspacio} · {espacio.nombreCampus}
          </p>
        </div>
        <StatusChip estado={ESTADO_CHIP[espacio.estado]} />
      </header>

      <dl className="espacio-card__details">
        <div className="espacio-card__detail">
          <dt>Horario</dt>
          <dd>
            <time dateTime={espacio.horaApertura}>{formatHora(espacio.horaApertura)}</time>
            {' – '}
            <time dateTime={espacio.horaCierre}>{formatHora(espacio.horaCierre)}</time>
          </dd>
        </div>
        <div className="espacio-card__detail">
          <dt>Capacidad</dt>
          <dd>{espacio.capacidadMaxima} personas</dd>
        </div>
      </dl>

      {onReservar && (
        <footer className="espacio-card__footer">
          <Button variant="primary" fullWidth disabled={!esReservable(espacio)} onClick={() => onReservar(espacio)}>
            Reservar
          </Button>
        </footer>
      )}
    </article>
  );
};

export default EspacioCard;

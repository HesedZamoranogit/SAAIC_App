import { useId } from 'react';
import { ESTADO_ESPACIO, esReservable, type EstadoEspacio, type EspacioResponse } from '../../models/Espacio.types';
import { formatHora } from '../../utils/fecha';
import Button from '../ui/Button';
import StatusChip, { type Estado } from '../ui/StatusChip';
import EspacioMenu from './EspacioMenu';

type EspacioCardProps = {
  espacio: EspacioResponse;
  //Se ejecuta al pulsar "Reservar"; si no se pasa, el boton no se muestra
  onReservar?: (espacio: EspacioResponse) => void;
  //Se ejecuta al elegir "Editar" en el menu de los 3 puntos; si no se pasa, el menu no se muestra
  onEditar?: (espacio: EspacioResponse) => void;
};

const ESTADO_CHIP: Record<EstadoEspacio, Estado> = {
  [ESTADO_ESPACIO.Disponible]: 'Disponible',
  [ESTADO_ESPACIO.Mantenimiento]: 'Mantenimiento',
  [ESTADO_ESPACIO.Ocupado]: 'Ocupada',
};

const EspacioCard = ({ espacio, onReservar, onEditar }: EspacioCardProps) => {
  const titleId = useId();

  return (
    <article className="espacio-card" aria-labelledby={titleId}>
      <div className="espacio-card__media" aria-hidden="true">
        {/* Edificio */}
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 41V17l6-8h18l6 8v24" />
          <path d="M5 41h38" />
          <path d="M19 41V31h10v10" />
          <path d="M19 20h.01M29 20h.01" strokeWidth="4" />
        </svg>
      </div>

      <div className="espacio-card__body">
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
            <dt>Aforo:</dt>
            <dd>{espacio.capacidadMaxima}</dd>
          </div>
          <div className="espacio-card__detail">
            <dt>Horario:</dt>
            <dd>
              <time dateTime={espacio.horaApertura}>{formatHora(espacio.horaApertura)}</time>
              {' – '}
              <time dateTime={espacio.horaCierre}>{formatHora(espacio.horaCierre)}</time>
            </dd>
          </div>
        </dl>

        {(onReservar || onEditar) && (
          <footer className="espacio-card__footer">
            {onReservar && (
              <Button variant="primary" disabled={!esReservable(espacio)} onClick={() => onReservar(espacio)}>
                Reservar
              </Button>
            )}
            {onEditar && <EspacioMenu nombre={espacio.nombre} onEditar={() => onEditar(espacio)} />}
          </footer>
        )}
      </div>
    </article>
  );
};

export default EspacioCard;

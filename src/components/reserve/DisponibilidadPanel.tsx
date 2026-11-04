import type { EspacioResponse } from '../../models/Espacio.types';
import type { ReservaInstanciaDiaria } from '../../models/reserve.type';
import { calcularBloques, type BloqueHorario } from '../../utils/disponibilidad';
import { formatFechaCorta } from '../../utils/fecha';
import Card from '../ui/Card';

type DisponibilidadPanelProps = {
  espacio?: EspacioResponse;
  //yyyy-MM-dd
  fecha: string;
  //Horario que el usuario quiere reservar: los bloques que choquen se marcan como conflicto
  seleccion?: { horaInicio: string; horaFin: string };
  reservas: ReservaInstanciaDiaria[];
  loading: boolean;
  error: string | null;
};

const etiqueta = ({ estado, detalle }: BloqueHorario) => {
  if (estado === 'libre') return 'Libre';
  return estado === 'conflicto' ? `Conflicto · ${detalle}` : detalle;
};

const DisponibilidadPanel = ({ espacio, fecha, seleccion, reservas, loading, error }: DisponibilidadPanelProps) => {
  const renderBloques = () => {
    if (!espacio || !fecha) {
      return <p className="slot-message">Selecciona un espacio y una fecha para ver su disponibilidad.</p>;
    }
    if (error) {
      return (
        <p className="slot-message slot-message--error" role="alert">
          {error}
        </p>
      );
    }
    if (loading) {
      return (
        <p className="slot-message" role="status">
          Cargando disponibilidad...
        </p>
      );
    }

    return (
      <ul className="slot-list" role="list">
        {calcularBloques(espacio.horaApertura, espacio.horaCierre, reservas, seleccion).map((bloque) => (
          <li key={bloque.inicio} className={`slot slot--${bloque.estado}`}>
            <span className="slot__time">
              {bloque.inicio} – {bloque.fin}
            </span>
            <span className="slot__label">{etiqueta(bloque)}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card
      title={fecha ? `Disponibilidad · ${formatFechaCorta(fecha)}` : 'Disponibilidad'}
      subtitle={espacio ? `Bloques ya ocupados en ${espacio.nombre}` : undefined}
    >
      {renderBloques()}
    </Card>
  );
};

export default DisponibilidadPanel;

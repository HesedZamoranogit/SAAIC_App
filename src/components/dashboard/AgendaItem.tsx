import StatusChip, { type Estado } from '../ui/StatusChip';

type AgendaItemProps = {
  //Formato HH:mm
  hora: string;
  titulo: string;
  detalle: string;
  estado: Estado;
};

const AgendaItem = ({ hora, titulo, detalle, estado }: AgendaItemProps) => {
  return (
    <li className="agenda-item">
      <time className="agenda-item__time" dateTime={hora}>
        {hora}
      </time>
      <div className="agenda-item__body">
        <h3 className="agenda-item__title">{titulo}</h3>
        <p className="agenda-item__meta">{detalle}</p>
      </div>
      <StatusChip estado={estado} />
    </li>
  );
};

export default AgendaItem;

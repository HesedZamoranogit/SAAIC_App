import Input from '../ui/Input';
import Select from '../ui/Select';

type EspacioFiltrosProps = {
  //Campus entre los que se puede elegir
  campuses: { id: number; nombre: string }[];
  //Campus elegido ('' = todos) y texto de busqueda
  idCampus: string;
  busqueda: string;
  onIdCampusChange: (idCampus: string) => void;
  onBusquedaChange: (busqueda: string) => void;
};

//Filtros del catalogo: por campus y buscador por nombre o numero del espacio
const EspacioFiltros = ({ campuses, idCampus, busqueda, onIdCampusChange, onBusquedaChange }: EspacioFiltrosProps) => {
  return (
    <div className="catalog-filters" role="search" aria-label="Filtrar espacios">
      <Select
        label="Campus"
        name="idCampus"
        placeholder="Todos los campus"
        options={campuses.map(({ id, nombre }) => ({ value: id, label: nombre }))}
        value={idCampus}
        onChange={(e) => onIdCampusChange(e.target.value)}
      />

      {/* La etiqueta "Buscar" solo la leen los lectores de pantalla; a la vista queda el placeholder */}
      <Input
        className="catalog-filters__search"
        label="Buscar"
        name="busqueda"
        type="search"
        inputMode="search"
        autoComplete="off"
        placeholder="Buscar por nombre o número"
        value={busqueda}
        onChange={(e) => onBusquedaChange(e.target.value)}
      />
    </div>
  );
};

export default EspacioFiltros;

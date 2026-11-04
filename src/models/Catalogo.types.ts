//Respuesta de la API (CampusDto) - GET /Catalogos/campuses
export type CampusResponse = {
  id: number;
  nombre: string;
  codigo: string | null;
  direccion: string | null;
  active: boolean;
};

//Respuesta de la API (TipoEspacioDto) - GET /Catalogos/tipos-espacio
export type TipoEspacioResponse = {
  id: number;
  nombre: string;
  descripcion: string | null;
  active: boolean;
};

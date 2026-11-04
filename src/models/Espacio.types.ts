
//Valores numericos del enum EstadoEspacio de la API
export const ESTADO_ESPACIO = {
  Disponible: 1,
  Mantenimiento: 2,
  Ocupado: 3,
} as const;

export type EstadoEspacio = (typeof ESTADO_ESPACIO)[keyof typeof ESTADO_ESPACIO];

//Respuesta de la API (EspacioDto). Las horas llegan como "HH:mm:ss"
export type EspacioResponse = {
  id: number;
  nombre: string;
  idTipoEspacio: number;
  nombreTipoEspacio: string;
  idCampus: number;
  nombreCampus: string;
  horaApertura: string;
  horaCierre: string;
  estado: EstadoEspacio;
  estadoDescripcion: string;
  capacidadMaxima: number;
  active: boolean;
};

//Un espacio en mantenimiento o inactivo no admite reservas (regla de la API)
export const esReservable = ({ active, estado }: EspacioResponse) => active && estado !== ESTADO_ESPACIO.Mantenimiento;

export type EspacioRequest = {
  nombre: string,
  idTipoEspacio: number,
  idCampus: number,
  horaApertura: string,
  horaCierre: string,
  capacidadMaxima: number,
  estado: EstadoEspacio
}

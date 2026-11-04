//Valores numericos del enum TipoReserva de la API
export const TIPO_RESERVA = {
  PorPeriodo: 1,
  PorJornada: 2,
  RecurrenteSemestral: 3,
} as const;

export type TipoReserva = (typeof TIPO_RESERVA)[keyof typeof TIPO_RESERVA];

//Banderas del enum DiasSemana de la API: se suman para combinar dias (Lunes + Miercoles = 5)
export const DIAS_SEMANA = {
  Lunes: 1,
  Martes: 2,
  Miercoles: 4,
  Jueves: 8,
  Viernes: 16,
  Sabado: 32,
  Domingo: 64,
} as const;

export type ReservePerPeriod = {
    idEspacio: number,
    responsableEvento: string,
    descripcion: string,
    maximoAsistentes: number,
    //yyyy-MM-dd (DateOnly en la API); un Date se serializaria como fecha y hora y la API lo rechaza
    fecha: string,
    horaInicio: string,
    horaFin: string,
    notaSeguridad: string
}

export type ReserveShift = {
  idEspacio: number,
  responsableEvento: string,
  descripcion: string,
  maximoAsistentes: number,
  //Opcional: la API acepta esta lista de dias o el rango fechaInicio - fechaFin
  fechasSeleccionadas?: string[],
  fechaInicio: string,
  fechaFin: string,
  notaSeguridad: string
}

export type ReserveSemester ={
  idEspacio: number,
  responsableEvento: string,
  descripcion: string,
  maximoAsistentes: number,
  fechaInicioSemestre: string,
  fechaFinSemestre: string,
  horaInicio: string,
  horaFin: string,
  diasSeleccionados: number,
  notaSeguridad: string
}

export type ReserveResponse = {
    id: number,
    idReservaPadre: number | null,
    esReservaPadre: boolean,
    idEspacio: number,
    nombreEspacio: string,
    nombreTipoEspacio: string,
    idCampus: number,
    nombreCampus: string,
    idUsuario: string,
    nombreUsuario: string,
    responsableEvento: string,
    descripcion: string,
    maximoAsistentes: number,
    notaSeguridad: string,
    tipoReserva: number,
    tipoReservaDescripcion: string,
    estado: number,
    estadoDescripcion: string,
    fechaInicio: string,
    fechaFin: string,
    horaInicio: string,
    horaFin: string,
    diasRecurrencia: number,
    fechaCancelacion: string | null,
    motivoCancelacion: string | null,
    asistencia: {
      id: number,
      idReserva: number,
      idUsuario: string,
      nombreUsuario: string,
      fechaEvento: string,
      horaProgramadaInicio: string,
      horaProgramadaFin: string,
      horaEntrada: string | null,
      horaSalida: string | null,
      estado: number,
      estadoDescripcion: string,
      minutosRetardo: number,
      minutosToleranciaAplicados: 0,
      marcoEntrada: boolean,
      marcoSalida: boolean,
      observaciones: string | null
    },
    instanciasHijas: []
}

//Reserva de un dia concreto (ReservaInstanciaDiariaDto) - GET /Reservas/calendario
export type ReservaInstanciaDiaria = {
  id: number,
  idReservaPadre: number | null,
  idEspacio: number,
  nombreEspacio: string,
  nombreTipoEspacio: string,
  idCampus: number,
  nombreCampus: string,
  idUsuario: string,
  nombreUsuario: string,
  responsableEvento: string,
  descripcion: string,
  maximoAsistentes: number,
  notaSeguridad: string | null,
  tipoReserva: TipoReserva,
  estado: number,
  fecha: string,
  horaInicio: string,
  horaFin: string
}
import type { EspacioResponse } from '../models/Espacio.types';
import { TIPO_RESERVA, type TipoReserva } from '../models/reserve.type';
import { diasEnRango, formatHora, hoy } from '../utils/fecha';

//Regla de la API: la reserva por jornada admite como maximo 7 dias
export const MAX_DIAS_JORNADA = 7;

export type ReservaFormValues = {
  idEspacio: string;
  responsableEvento: string;
  descripcion: string;
  tipo: TipoReserva;
  //Evento único: la fecha. Jornada: el primer día. Semestre: inicio del semestre
  fecha: string;
  //Jornada: el último día (opcional). Semestre: fin del semestre
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  //Días del semestre como suma de banderas DIAS_SEMANA
  dias: number;
  maximoAsistentes: string;
  notaSeguridad: string;
};

export type ReservaFieldErrors = Partial<Record<keyof ReservaFormValues, string>>;

//Mismas reglas que la API (Reserva y Espacio). `espacio` es el espacio elegido en el formulario, si ya hay uno
export const validateReserva = (values: ReservaFormValues, espacio?: EspacioResponse): ReservaFieldErrors => {
  const errors: ReservaFieldErrors = {};
  const asistentes = Number(values.maximoAsistentes);
  const esJornada = values.tipo === TIPO_RESERVA.PorJornada;
  const esSemestral = values.tipo === TIPO_RESERVA.RecurrenteSemestral;

  if (!espacio) errors.idEspacio = 'Selecciona el espacio.';
  if (!values.responsableEvento.trim()) errors.responsableEvento = 'Ingresa el responsable del evento.';
  if (!values.descripcion.trim()) errors.descripcion = 'Ingresa el motivo del evento.';

  if (!values.maximoAsistentes) errors.maximoAsistentes = 'Ingresa los asistentes esperados.';
  else if (!Number.isInteger(asistentes) || asistentes <= 0) errors.maximoAsistentes = 'Debe ser un número entero mayor a cero.';
  else if (espacio && asistentes > espacio.capacidadMaxima) {
    errors.maximoAsistentes = `No puede superar el aforo del espacio (${espacio.capacidadMaxima}).`;
  }

  if (!values.fecha) errors.fecha = 'Selecciona la fecha.';
  else if (values.fecha < hoy()) errors.fecha = 'No puede ser anterior a hoy.';

  if (esJornada && values.fecha && values.fechaFin) {
    if (values.fechaFin < values.fecha) errors.fechaFin = 'Debe ser igual o posterior a la fecha de inicio.';
    else if (diasEnRango(values.fecha, values.fechaFin) > MAX_DIAS_JORNADA) {
      errors.fechaFin = `La jornada admite máximo ${MAX_DIAS_JORNADA} días.`;
    }
  }

  if (esSemestral) {
    if (!values.fechaFin) errors.fechaFin = 'Selecciona el fin del semestre.';
    else if (values.fecha && values.fechaFin < values.fecha) errors.fechaFin = 'Debe ser igual o posterior al inicio.';
    if (values.dias === 0) errors.dias = 'Selecciona al menos un día de la semana.';
  }

  //La jornada usa el horario completo del espacio; los demas tipos piden hora de inicio y fin
  if (!esJornada) {
    if (!values.horaInicio) errors.horaInicio = 'Ingresa la hora de inicio.';
    if (!values.horaFin) errors.horaFin = 'Ingresa la hora de fin.';

    if (values.horaInicio && values.horaFin && values.horaInicio >= values.horaFin) {
      errors.horaFin = 'Debe ser posterior a la hora de inicio.';
    }
    if (espacio) {
      const apertura = formatHora(espacio.horaApertura);
      const cierre = formatHora(espacio.horaCierre);
      if (values.horaInicio && values.horaInicio < apertura) errors.horaInicio = `El espacio abre a las ${apertura}.`;
      if (values.horaFin && values.horaFin > cierre) errors.horaFin = `El espacio cierra a las ${cierre}.`;
    }
  }

  return errors;
};

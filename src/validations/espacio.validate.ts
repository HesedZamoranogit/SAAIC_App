//Los inputs trabajan con texto; se convierte a numero al enviar
export type EspacioFormValues = {
  nombre: string;
  idTipoEspacio: string;
  idCampus: string;
  horaApertura: string;
  horaCierre: string;
  capacidadMaxima: string;
  estado: string;
};

export type EspacioFieldErrors = Partial<Record<keyof EspacioFormValues, string>>;

//Regla de la API: el nombre del espacio admite hasta 120 caracteres
export const NOMBRE_ESPACIO_MAX = 120;

//Mismas reglas que la API (EspacioService)
export const validateEspacio = (values: EspacioFormValues): EspacioFieldErrors => {
  const errors: EspacioFieldErrors = {};
  const nombre = values.nombre.trim();
  const capacidad = Number(values.capacidadMaxima);

  if (!nombre) errors.nombre = 'Ingresa el nombre del espacio.';
  else if (nombre.length > NOMBRE_ESPACIO_MAX) errors.nombre = `El nombre no puede superar ${NOMBRE_ESPACIO_MAX} caracteres.`;

  if (!values.idTipoEspacio) errors.idTipoEspacio = 'Selecciona el tipo de espacio.';
  if (!values.idCampus) errors.idCampus = 'Selecciona el campus.';

  if (!values.horaApertura) errors.horaApertura = 'Ingresa la hora de apertura.';
  if (!values.horaCierre) errors.horaCierre = 'Ingresa la hora de cierre.';
  if (values.horaApertura && values.horaCierre && values.horaApertura >= values.horaCierre) {
    errors.horaCierre = 'Debe ser posterior a la hora de apertura.';
  }

  if (!values.capacidadMaxima) errors.capacidadMaxima = 'Ingresa la capacidad máxima.';
  else if (!Number.isInteger(capacidad) || capacidad <= 0) errors.capacidadMaxima = 'Debe ser un número entero mayor a cero.';

  return errors;
};

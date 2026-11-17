export type ReporteFormValues = {
  fechaInicio: string;
  fechaFin: string;
  //Vacio = todos los campus / todos los tipos de espacio
  idCampus: string;
  idTipoEspacio: string;
};

export type ReporteFieldErrors = Partial<Record<keyof ReporteFormValues, string>>;

//Mismas reglas que la API (ReporteService): la fecha de fin no puede ser menor a la de inicio
export const validateReporte = (values: ReporteFormValues): ReporteFieldErrors => {
  const errors: ReporteFieldErrors = {};

  if (!values.fechaInicio) errors.fechaInicio = 'Selecciona la fecha de inicio.';

  if (!values.fechaFin) errors.fechaFin = 'Selecciona la fecha de fin.';
  else if (values.fechaInicio && values.fechaFin < values.fechaInicio) {
    errors.fechaFin = 'Debe ser igual o posterior a la fecha de inicio.';
  }

  return errors;
};

const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//La API acepta varios correos separados por coma o punto y coma (ReporteService.SepararCorreos)
const separarCorreos = (valor: string) =>
  valor
    .split(/[,;]/)
    .map((correo) => correo.trim())
    .filter(Boolean);

//"a@x.com;  b@x.com," -> "a@x.com, b@x.com": lo que se manda a la API y se muestra al usuario
export const normalizarCorreos = (valor: string) => separarCorreos(valor).join(', ');

export const validateCorreos = (valor: string): string | undefined => {
  const correos = separarCorreos(valor);

  if (correos.length === 0) return 'Ingresa al menos un correo.';

  const invalido = correos.find((correo) => !CORREO_REGEX.test(correo));
  if (invalido) return `"${invalido}" no es un correo válido.`;

  return undefined;
};

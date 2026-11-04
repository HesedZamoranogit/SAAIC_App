const pad = (valor: number) => String(valor).padStart(2, '0');

//Fecha de hoy como yyyy-MM-dd en hora local. toISOString() daria la fecha UTC y en la tarde-noche ya seria "manana"
export const hoy = () => {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${pad(ahora.getMonth() + 1)}-${pad(ahora.getDate())}`;
};

//"08:00:00" -> "08:00"
export const formatHora = (hora: string) => hora.slice(0, 5);

//El input time entrega "HH:mm" y la API espera "HH:mm:ss"
export const toApiTime = (hora: string) => (hora.length === 5 ? `${hora}:00` : hora);

//"2026-11-04" -> "Mié 4 nov"
export const formatFechaCorta = (fecha: string) => {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  //new Date(anio, mes, dia) es fecha local; new Date("2026-11-04") se lee como UTC y en Mexico caeria un dia antes
  const partes = new Intl.DateTimeFormat('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }).formatToParts(
    new Date(anio, mes - 1, dia),
  );
  const parte = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((p) => p.type === tipo)?.value.replace('.', '') ?? '';
  const diaSemana = parte('weekday');

  return `${diaSemana.charAt(0).toUpperCase()}${diaSemana.slice(1)} ${parte('day')} ${parte('month')}`;
};

//Cantidad de dias entre dos fechas yyyy-MM-dd, contando ambos extremos
export const diasEnRango = (inicio: string, fin: string) => {
  const [anioInicio, mesInicio, diaInicio] = inicio.split('-').map(Number);
  const [anioFin, mesFin, diaFin] = fin.split('-').map(Number);
  const msPorDia = 24 * 60 * 60 * 1000;

  return Math.round((Date.UTC(anioFin, mesFin - 1, diaFin) - Date.UTC(anioInicio, mesInicio - 1, diaInicio)) / msPorDia) + 1;
};

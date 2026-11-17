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

//Suma (o resta, con valor negativo) dias a una fecha yyyy-MM-dd
export const sumarDias = (fecha: string, dias: number) => {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const resultado = new Date(anio, mes - 1, dia + dias);

  return `${resultado.getFullYear()}-${pad(resultado.getMonth() + 1)}-${pad(resultado.getDate())}`;
};

//("2026-10-20", "2026-10-24") -> "20 al 24 de octubre"; si cambia el mes o el año los muestra en cada extremo
export const formatRangoFechas = (inicio: string, fin: string) => {
  const diaMes = (fecha: string, conAnio = false) => {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', ...(conAnio && { year: 'numeric' }) }).format(
      new Date(anio, mes - 1, dia),
    );
  };

  if (inicio === fin) return diaMes(inicio);

  const [anioInicio, mesInicio] = inicio.split('-');
  const [anioFin, mesFin] = fin.split('-');

  if (anioInicio !== anioFin) return `${diaMes(inicio, true)} al ${diaMes(fin, true)}`;
  if (mesInicio !== mesFin) return `${diaMes(inicio)} al ${diaMes(fin)}`;

  return `${Number(inicio.split('-')[2])} al ${diaMes(fin)}`;
};

//Date -> "20 oct 2026, 07:45" (hora local de 24 horas)
export const formatFechaHora = (fecha: Date) =>
  new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
    .format(fecha)
    .replaceAll('.', '');

//Cantidad de dias entre dos fechas yyyy-MM-dd, contando ambos extremos
export const diasEnRango = (inicio: string, fin: string) => {
  const [anioInicio, mesInicio, diaInicio] = inicio.split('-').map(Number);
  const [anioFin, mesFin, diaFin] = fin.split('-').map(Number);
  const msPorDia = 24 * 60 * 60 * 1000;

  return Math.round((Date.UTC(anioFin, mesFin - 1, diaFin) - Date.UTC(anioInicio, mesInicio - 1, diaInicio)) / msPorDia) + 1;
};

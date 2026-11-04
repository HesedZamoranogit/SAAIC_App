export type EstadoBloque = 'libre' | 'ocupado' | 'conflicto';

export type BloqueHorario = {
  inicio: string;
  fin: string;
  estado: EstadoBloque;
  //Nombres de los eventos que ocupan el bloque (vacio si esta libre)
  detalle: string;
};

type Horario = { horaInicio: string; horaFin: string };

//El panel de disponibilidad divide el horario del espacio en bloques de 2 horas
const BLOQUE_MINUTOS = 120;

//"09:30" o "09:30:00" -> 570
const aMinutos = (hora: string) => {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
};

//570 -> "09:30"
const aHora = (minutos: number) =>
  `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;

//Parte el horario del espacio en bloques y marca cuales estan ocupados.
//Un bloque es "conflicto" cuando un evento ocupado coincide con el horario que el usuario quiere reservar (seleccion)
export const calcularBloques = (
  apertura: string,
  cierre: string,
  reservas: (Horario & { descripcion: string })[],
  seleccion?: Horario,
): BloqueHorario[] => {
  const bloques: BloqueHorario[] = [];
  const finDia = aMinutos(cierre);
  const seleccionInicio = seleccion ? aMinutos(seleccion.horaInicio) : 0;
  const seleccionFin = seleccion ? aMinutos(seleccion.horaFin) : 0;

  for (let inicio = aMinutos(apertura); inicio < finDia; inicio += BLOQUE_MINUTOS) {
    const fin = Math.min(inicio + BLOQUE_MINUTOS, finDia);

    //Eventos que tocan el bloque
    const ocupantes = reservas.filter((r) => aMinutos(r.horaInicio) < fin && aMinutos(r.horaFin) > inicio);

    //Eventos que ademas coinciden con la seleccion dentro de este mismo bloque
    const enConflicto = seleccion
      ? ocupantes.filter(
          (r) =>
            Math.max(inicio, seleccionInicio, aMinutos(r.horaInicio)) < Math.min(fin, seleccionFin, aMinutos(r.horaFin)),
        )
      : [];

    const estado: EstadoBloque = enConflicto.length > 0 ? 'conflicto' : ocupantes.length > 0 ? 'ocupado' : 'libre';
    const nombres = [...new Set((estado === 'conflicto' ? enConflicto : ocupantes).map((r) => r.descripcion))];

    bloques.push({ inicio: aHora(inicio), fin: aHora(fin), estado, detalle: nombres.join(', ') });
  }

  return bloques;
};

import { useEffect, useState } from "react";
import type { ReservaInstanciaDiaria } from "../models/reserve.type";
import { getCalendario } from "../Services/Reserve/reserve";

type Resultado = {
    //Espacio y fecha a los que pertenece la respuesta
    key: string;
    reservas: ReservaInstanciaDiaria[];
    error: string | null;
};

//Reservas confirmadas de un espacio en un dia (yyyy-MM-dd); se vuelven a pedir al cambiar el espacio o la fecha
export function useDisponibilidad(idEspacio: number | undefined, fecha: string) {
    const [resultado, setResultado] = useState<Resultado | null>(null);

    const key = idEspacio && fecha ? `${idEspacio}|${fecha}` : null;

    useEffect(() => {
        if (!idEspacio || !key) return;

        //Descarta la respuesta si el usuario cambio de espacio o fecha antes de que llegara
        let active = true;

        getCalendario(fecha, fecha, idEspacio)
            .then((response) => {
                if (active) setResultado({ key, reservas: response.data ?? [], error: null });
            })
            .catch((error) => {
                if (active) setResultado({ key, reservas: [], error: (error as Error).message });
            });

        return () => {
            active = false;
        };
    }, [idEspacio, fecha, key]);

    //La respuesta solo vale si es del espacio y fecha actuales; si no, sigue cargando
    const vigente = resultado?.key === key ? resultado : null;

    return {
        reservas: vigente?.reservas ?? [],
        loading: key !== null && !vigente,
        error: vigente?.error ?? null
    };
}

import { useCallback, useState } from "react";
import type { ArchivoReporte, FiltroReporteEventos } from "../models/reporte.type";
import type { ReservaInstanciaDiaria } from "../models/reserve.type";
import { exportarReporteEventos } from "../Services/Reporte/reporte";
import { getCalendario } from "../Services/Reserve/reserve";

//Que accion esta en curso, para deshabilitar los botones y cambiar su texto
export type AccionReporte = "generar" | "excel" | "correo";

export function useReporte() {
    const [accion, setAccion] = useState<AccionReporte | null>(null);
    const [error, setError] = useState<string | null>(null);

    //useCallback mantiene la misma referencia entre renders, asi se puede usar dentro de un useEffect
    //Eventos del rango para la vista previa (la API solo devuelve los confirmados)
    const GetEventos = useCallback(async (filtro: FiltroReporteEventos): Promise<ReservaInstanciaDiaria[] | undefined> => {
        setAccion("generar");
        setError(null);

        try {
            const response = await getCalendario(filtro.fechaInicio, filtro.fechaFin, filtro.idEspacio, filtro.idCampus);
            setAccion(null);
            return response.data ?? [];
        } catch (error) {
            setError((error as Error).message);
            setAccion(null);
            return undefined;
        }
    }, []);

    //Excel del reporte; la descarga la hace la pagina con el archivo que se devuelve
    const ExportarExcel = useCallback(async (filtro: FiltroReporteEventos): Promise<ArchivoReporte | undefined> => {
        setAccion("excel");
        setError(null);

        try {
            const archivo = await exportarReporteEventos(filtro);
            setAccion(null);
            return archivo;
        } catch (error) {
            setError((error as Error).message);
            setAccion(null);
            return undefined;
        }
    }, []);

    //La API manda el Excel por correo a filtro.enviarPorCorreoA; aqui el archivo que regresa no se usa
    const EnviarPorCorreo = useCallback(async (filtro: FiltroReporteEventos): Promise<boolean> => {
        setAccion("correo");
        setError(null);

        try {
            await exportarReporteEventos(filtro);
            setAccion(null);
            return true;
        } catch (error) {
            setError((error as Error).message);
            setAccion(null);
            return false;
        }
    }, []);

    //Para que un error ya mostrado (ej. el del modal de envio) no reaparezca al cerrar
    const LimpiarError = useCallback(() => setError(null), []);

    return {
        GetEventos,
        ExportarExcel,
        EnviarPorCorreo,
        LimpiarError,
        accion,
        loading: accion !== null,
        error
    };
}

import axios from "axios";
import type { ArchivoReporte, FiltroReporteEventos } from "../../models/reporte.type";
import { api } from "../api";
import { getErrorMessage } from "../apiError";

//Generar el Excel y mandarlo por correo tarda mas que una consulta normal (el timeout general es de 15 s)
const TIMEOUT_REPORTE_MS = 60000;

//Con responseType "blob" el cuerpo de un error tambien llega como Blob: se convierte a JSON
//para que getErrorMessage pueda leer el mensaje de la API
const leerCuerpoDeError = async (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
    try {
      error.response.data = JSON.parse(await error.response.data.text());
    } catch {
      //El cuerpo no era JSON: getErrorMessage usa el mensaje por defecto
    }
  }
};

//Genera el Excel de eventos programados y estado de espacios del rango. Siempre devuelve el archivo;
//con filtro.enviarPorCorreoA la API ademas lo envia por correo
export const exportarReporteEventos = async (filtro: FiltroReporteEventos): Promise<ArchivoReporte> => {
  try {
    const { data } = await api.post<Blob>("/Reportes/eventos/exportar", filtro, {
      responseType: "blob",
      timeout: TIMEOUT_REPORTE_MS,
    });

    //Mismo nombre que arma la API: Reporte_Eventos_Espacios_yyyyMMdd_yyyyMMdd.xlsx
    const nombreArchivo = `Reporte_Eventos_Espacios_${filtro.fechaInicio.replaceAll("-", "")}_${filtro.fechaFin.replaceAll("-", "")}.xlsx`;

    return { blob: data, nombreArchivo };
  } catch (error) {
    await leerCuerpoDeError(error);
    throw new Error(getErrorMessage(error, "No se pudo generar el reporte."), { cause: error });
  }
};

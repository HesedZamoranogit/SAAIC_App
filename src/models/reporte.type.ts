//Filtro del reporte de eventos (FiltroReporteEventosRequestDto) - POST /Reportes/eventos/exportar
export type FiltroReporteEventos = {
  //yyyy-MM-dd (DateOnly en la API)
  fechaInicio: string;
  fechaFin: string;
  idCampus?: number;
  idEspacio?: number;
  //Si se manda, la API tambien envia el Excel por correo (varios correos separados por coma o punto y coma)
  enviarPorCorreoA?: string;
};

//Archivo que devuelve la API: un .xlsx
export type ArchivoReporte = {
  blob: Blob;
  nombreArchivo: string;
};

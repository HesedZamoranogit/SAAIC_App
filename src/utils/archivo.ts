//Descarga en el navegador un archivo generado en memoria (ej. el Excel del reporte)
export const descargarArchivo = (blob: Blob, nombreArchivo: string) => {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  //Se libera despues de iniciar la descarga; revocarla de inmediato puede cancelarla en algunos navegadores
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

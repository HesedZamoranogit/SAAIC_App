import { useEffect, useId, useState, type ChangeEvent, type SubmitEvent } from 'react';
import PageHeader from '../components/layout/PageHeader';
import EnviarReporteModal from '../components/reporte/EnviarReporteModal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Table, { type Column } from '../components/ui/Table';
import { useCatalogos } from '../hooks/useCatalogos';
import { useReporte } from '../hooks/useReporte';
import type { FiltroReporteEventos } from '../models/reporte.type';
import type { ReservaInstanciaDiaria } from '../models/reserve.type';
import { descargarArchivo } from '../utils/archivo';
import { formatFechaCorta, formatFechaHora, formatHora, formatRangoFechas, hoy, sumarDias } from '../utils/fecha';
import { validateReporte, type ReporteFieldErrors, type ReporteFormValues } from '../validations/reporte.validate';

//La pantalla abre con la semana a partir de hoy (hoy + 6 dias)
const DIAS_PERIODO_INICIAL = 6;

type Reporte = {
    //Filtro con el que se genero: el Excel y el correo usan este, no lo que se este editando en el formulario
    filtro: FiltroReporteEventos;
    eventos: ReservaInstanciaDiaria[];
};

const crearValoresIniciales = (): ReporteFormValues => ({
    fechaInicio: hoy(),
    fechaFin: sumarDias(hoy(), DIAS_PERIODO_INICIAL),
    idCampus: '',
    idTipoEspacio: '',
});

//La API de calendario no filtra por tipo de espacio: se filtra aqui por nombre. Se ordena por fecha y hora
const armarReporte = (filtro: FiltroReporteEventos, eventos: ReservaInstanciaDiaria[], tipoEspacio: string): Reporte => ({
    filtro,
    eventos: eventos
        .filter((evento) => !tipoEspacio || evento.nombreTipoEspacio === tipoEspacio)
        .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.horaInicio.localeCompare(b.horaInicio)),
});

const plural = (cantidad: number, singular: string, pluralForma = `${singular}s`) =>
    `${cantidad} ${cantidad === 1 ? singular : pluralForma}`;

const Reportes = () => {
    const tituloId = useId();
    const { GetEventos, ExportarExcel, EnviarPorCorreo, LimpiarError, accion, loading, error } = useReporte();
    const { campuses, tiposEspacio, loading: catalogosLoading, error: catalogosError } = useCatalogos();

    const [valoresIniciales] = useState(crearValoresIniciales);
    const [values, setValues] = useState<ReporteFormValues>(valoresIniciales);
    const [fieldErrors, setFieldErrors] = useState<ReporteFieldErrors>({});
    //null mientras no llega el primer reporte
    const [reporte, setReporte] = useState<Reporte | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [envioAbierto, setEnvioAbierto] = useState(false);
    //Solo recuerda los envios hechos desde esta pantalla: la API no expone el historial de reportes
    const [ultimoEnvio, setUltimoEnvio] = useState<{ fecha: string; correos: string } | null>(null);

    //Al abrir la pantalla se genera el reporte del periodo inicial, todos los campus y tipos
    useEffect(() => {
        let active = true;

        const cargarReporte = async () => {
            const filtro: FiltroReporteEventos = {
                fechaInicio: valoresIniciales.fechaInicio,
                fechaFin: valoresIniciales.fechaFin,
            };
            const eventos = await GetEventos(filtro);
            if (active && eventos) setReporte(armarReporte(filtro, eventos, ''));
        };

        cargarReporte();

        return () => {
            active = false;
        };
    }, [GetEventos, valoresIniciales]);

    const handleChange = (field: keyof ReporteFormValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValues((prev) => ({ ...prev, [field]: e.target.value }));
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        const errors = validateReporte(values);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setMensaje(null);
        const filtro: FiltroReporteEventos = {
            fechaInicio: values.fechaInicio,
            fechaFin: values.fechaFin,
            idCampus: values.idCampus ? Number(values.idCampus) : undefined,
        };
        const tipoEspacio = tiposEspacio.find((tipo) => String(tipo.id) === values.idTipoEspacio)?.nombre ?? '';

        const eventos = await GetEventos(filtro);
        //Si falla, el hook deja el mensaje en `error` y se conserva el reporte anterior
        if (eventos) setReporte(armarReporte(filtro, eventos, tipoEspacio));
    };

    //El PDF sale del dialogo de impresion del navegador ("Guardar como PDF"); los estilos de impresion dejan solo el reporte
    const handleExportarPdf = () => {
        if (!reporte) return;

        //El navegador sugiere el titulo de la pagina como nombre del archivo
        const tituloOriginal = document.title;
        document.title = `Reporte_Eventos_${reporte.filtro.fechaInicio}_${reporte.filtro.fechaFin}`;
        window.print();
        document.title = tituloOriginal;
    };

    const handleExportarExcel = async () => {
        if (!reporte || loading) return;

        setMensaje(null);
        const archivo = await ExportarExcel(reporte.filtro);
        if (archivo) descargarArchivo(archivo.blob, archivo.nombreArchivo);
    };

    //El correo del supervisor puede cambiar y la API no lo expone: se pide en un modal antes de cada envio
    const handleAbrirEnvio = () => {
        if (loading) return;

        setMensaje(null);
        setEnvioAbierto(true);
    };

    const handleCerrarEnvio = () => {
        setEnvioAbierto(false);
        LimpiarError();
    };

    const handleEnviar = async (correos: string) => {
        if (!reporte) return;

        const enviado = await EnviarPorCorreo({ ...reporte.filtro, enviarPorCorreoA: correos });
        //Si falla, el hook deja el mensaje en `error` y el modal lo muestra sin cerrarse
        if (enviado) {
            setEnvioAbierto(false);
            setUltimoEnvio({ fecha: formatFechaHora(new Date()), correos });
            setMensaje(`Reporte enviado a ${correos}.`);
        }
    };

    const formError = error ?? catalogosError;
    const catalogoPlaceholder = catalogosLoading ? 'Cargando...' : 'Todos';

    const renderReporte = (actual: Reporte) => {
        const { filtro, eventos } = actual;
        const espacios = new Set(eventos.map((evento) => evento.idEspacio)).size;
        const campusTotal = new Set(eventos.map((evento) => evento.idCampus)).size;

        return (
            <section className="report-result" aria-labelledby={tituloId}>
                <div className="report-result__header">
                    <div className="report-result__titles">
                        <h2 id={tituloId} className="report-result__title">
                            Eventos autorizados · {formatRangoFechas(filtro.fechaInicio, filtro.fechaFin)}
                        </h2>
                        <p className="report-result__meta">
                            {plural(eventos.length, 'evento')} · {plural(espacios, 'espacio')} · {plural(campusTotal, 'campus', 'campus')}
                        </p>
                    </div>

                    <div className="report-result__actions">
                        <Button variant="secondary" onClick={handleExportarPdf} disabled={loading || eventos.length === 0}>
                            <span aria-hidden="true">↓</span> Exportar PDF
                        </Button>
                        <Button variant="secondary" onClick={handleExportarExcel} disabled={loading}>
                            {accion === 'excel' ? 'Generando Excel...' : 'Exportar Excel'}
                        </Button>
                        <Button onClick={handleAbrirEnvio} disabled={loading}>
                            <span aria-hidden="true">✉</span> Enviar a seguridad
                        </Button>
                    </div>
                </div>

                {eventos.length === 0 ? (
                    <div className="catalog-placeholder">No hay eventos autorizados en el periodo seleccionado.</div>
                ) : (
                    <Table columns={columns} rows={eventos} getRowKey={(evento) => `${evento.id}-${evento.fecha}`} />
                )}

                <p className="report-note">
                    El guardia valida la entrada del responsable con identificación oficial.
                    {ultimoEnvio && ` Último envío: ${ultimoEnvio.fecha} · ${ultimoEnvio.correos}`}
                </p>
            </section>
        );
    };

    return (
        <>
            <PageHeader
                title="Reportes"
                subtitle="Genera el reporte de eventos autorizados para el supervisor de seguridad"
            />

            <form className="report-filters" onSubmit={handleSubmit} noValidate aria-busy={loading}>
                <Input
                    label="Desde"
                    name="fechaInicio"
                    type="date"
                    required
                    value={values.fechaInicio}
                    onChange={handleChange('fechaInicio')}
                    error={fieldErrors.fechaInicio}
                    disabled={loading}
                />
                <Input
                    label="Hasta"
                    name="fechaFin"
                    type="date"
                    min={values.fechaInicio}
                    required
                    value={values.fechaFin}
                    onChange={handleChange('fechaFin')}
                    error={fieldErrors.fechaFin}
                    disabled={loading}
                />
                <Select
                    label="Campus"
                    name="idCampus"
                    placeholder={catalogoPlaceholder}
                    options={campuses.map(({ id, nombre }) => ({ value: id, label: nombre }))}
                    value={values.idCampus}
                    onChange={handleChange('idCampus')}
                    disabled={loading || catalogosLoading}
                />
                <Select
                    label="Tipo de espacio"
                    name="idTipoEspacio"
                    placeholder={catalogoPlaceholder}
                    options={tiposEspacio.map(({ id, nombre }) => ({ value: id, label: nombre }))}
                    //La API de reportes no filtra por tipo de espacio: solo la vista previa y el PDF lo respetan
                    hint={values.idTipoEspacio ? 'El Excel y el correo incluyen todos los tipos de espacio.' : undefined}
                    value={values.idTipoEspacio}
                    onChange={handleChange('idTipoEspacio')}
                    disabled={loading || catalogosLoading}
                />

                {/* El label vacio mantiene el boton alineado con los campos aunque alguno muestre error o ayuda */}
                <div className="field report-filters__submit">
                    <span className="field__label" aria-hidden="true">
                        &nbsp;
                    </span>
                    <Button type="submit" disabled={loading}>
                        {accion === 'generar' ? 'Generando...' : 'Generar'}
                    </Button>
                </div>
            </form>

            {/* Con el modal abierto el error de un envio se muestra dentro del modal */}
            {formError && !envioAbierto && (
                <p className="form-error" role="alert">
                    {formError}
                </p>
            )}
            {mensaje && (
                <p className="form-success" role="status">
                    {mensaje}
                </p>
            )}

            {reporte ? (
                renderReporte(reporte)
            ) : (
                !formError && (
                    <div className="catalog-placeholder" role="status">
                        Generando reporte...
                    </div>
                )
            )}

            {envioAbierto && reporte && (
                <EnviarReporteModal
                    periodo={formatRangoFechas(reporte.filtro.fechaInicio, reporte.filtro.fechaFin)}
                    correoInicial={ultimoEnvio?.correos ?? ''}
                    loading={accion === 'correo'}
                    error={error}
                    onEnviar={handleEnviar}
                    onClose={handleCerrarEnvio}
                />
            )}
        </>
    );
};

const columns: Column<ReservaInstanciaDiaria>[] = [
    { key: 'fecha', header: 'Fecha', render: (evento) => formatFechaCorta(evento.fecha) },
    {
        key: 'horaInicio',
        header: 'Horario',
        render: (evento) => `${formatHora(evento.horaInicio)}–${formatHora(evento.horaFin)}`,
    },
    { key: 'nombreEspacio', header: 'Espacio' },
    { key: 'nombreCampus', header: 'Campus' },
    { key: 'descripcion', header: 'Evento' },
    { key: 'responsableEvento', header: 'Responsable autorizado' },
    { key: 'maximoAsistentes', header: 'Asist.' },
];

export default Reportes;

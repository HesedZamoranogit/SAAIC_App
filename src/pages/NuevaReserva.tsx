import { useEffect, useId, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import DisponibilidadPanel from '../components/reserve/DisponibilidadPanel';
import Button, { ButtonLink } from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import RadioGroup from '../components/ui/RadioGroup';
import Select from '../components/ui/Select';
import { useAuth } from '../hooks/useAuth';
import { useDisponibilidad } from '../hooks/useDisponibilidad';
import { useEspacio } from '../hooks/useEspacio';
import { useReserve } from '../hooks/useReserve';
import { TODOS_LOS_REGISTROS } from '../models/Api.types';
import { esReservable, type EspacioResponse } from '../models/Espacio.types';
import { DIAS_SEMANA, TIPO_RESERVA, type ReserveResponse, type TipoReserva } from '../models/reserve.type';
import { diasEnRango, formatFechaCorta, formatHora, hoy, toApiTime } from '../utils/fecha';

//Regla de la API: la reserva por jornada admite como maximo 7 dias
const MAX_DIAS_JORNADA = 7;

const TIPO_OPTIONS = [
    { value: TIPO_RESERVA.PorPeriodo, label: 'Evento único' },
    { value: TIPO_RESERVA.PorJornada, label: 'Jornada completa' },
    { value: TIPO_RESERVA.RecurrenteSemestral, label: 'Recurrente (semestre)' },
];

const DIAS = [
    { label: 'Lun', value: DIAS_SEMANA.Lunes },
    { label: 'Mar', value: DIAS_SEMANA.Martes },
    { label: 'Mié', value: DIAS_SEMANA.Miercoles },
    { label: 'Jue', value: DIAS_SEMANA.Jueves },
    { label: 'Vie', value: DIAS_SEMANA.Viernes },
    { label: 'Sáb', value: DIAS_SEMANA.Sabado },
    { label: 'Dom', value: DIAS_SEMANA.Domingo },
];

type FormValues = {
    idEspacio: string;
    responsableEvento: string;
    descripcion: string;
    tipo: TipoReserva;
    //Evento único: la fecha. Jornada: el primer día. Semestre: inicio del semestre
    fecha: string;
    //Jornada: el último día (opcional). Semestre: fin del semestre
    fechaFin: string;
    horaInicio: string;
    horaFin: string;
    //Días del semestre como suma de banderas DIAS_SEMANA
    dias: number;
    maximoAsistentes: string;
    notaSeguridad: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

//Campos que se editan con un input o select (texto)
type TextField = Exclude<keyof FormValues, 'tipo' | 'dias'>;

const NuevaReserva = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const diasLabelId = useId();

    const { GetEspacios, error: espaciosError } = useEspacio();
    const { ReservePerPeriod, ReserveShift, ReserveSemester, loading, error } = useReserve();

    //El catalogo manda el espacio elegido en ?espacio=ID
    const valoresIniciales = (): FormValues => ({
        idEspacio: searchParams.get('espacio') ?? '',
        responsableEvento: user?.nombreCompleto ?? '',
        descripcion: '',
        tipo: TIPO_RESERVA.PorPeriodo,
        fecha: hoy(),
        fechaFin: '',
        horaInicio: '',
        horaFin: '',
        dias: 0,
        maximoAsistentes: '',
        notaSeguridad: '',
    });

    //null mientras no llega la primera respuesta
    const [espacios, setEspacios] = useState<EspacioResponse[] | null>(null);
    const [values, setValues] = useState<FormValues>(valoresIniciales);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [creada, setCreada] = useState<{ reserva: ReserveResponse; mensaje: string } | null>(null);

    useEffect(() => {
        const cargarEspacios = async () => {
            const response = await GetEspacios(TODOS_LOS_REGISTROS);
            setEspacios(response?.data?.items ?? []);
        };

        cargarEspacios();
    }, [GetEspacios]);

    //Solo se pueden reservar los espacios que no estan en mantenimiento
    const reservables = (espacios ?? []).filter(esReservable);
    const espacioSeleccionado = reservables.find((espacio) => String(espacio.id) === values.idEspacio);
    const cargandoEspacios = espacios === null;

    const esPeriodo = values.tipo === TIPO_RESERVA.PorPeriodo;
    const esJornada = values.tipo === TIPO_RESERVA.PorJornada;
    const esSemestral = values.tipo === TIPO_RESERVA.RecurrenteSemestral;

    const disponibilidad = useDisponibilidad(espacioSeleccionado?.id, values.fecha);

    //Horario que se esta pidiendo, para marcar los choques en el panel de disponibilidad
    const getSeleccion = () => {
        if (!espacioSeleccionado) return undefined;
        if (esJornada) {
            return { horaInicio: formatHora(espacioSeleccionado.horaApertura), horaFin: formatHora(espacioSeleccionado.horaCierre) };
        }
        if (values.horaInicio && values.horaFin && values.horaInicio < values.horaFin) {
            return { horaInicio: values.horaInicio, horaFin: values.horaFin };
        }
        return undefined;
    };

    const setField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
        setValues((prev) => ({ ...prev, [field]: value }));
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleChange = (field: TextField) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setField(field, e.target.value);
    };

    //Mismas reglas que la API (Reserva y Espacio)
    const validate = (): FieldErrors => {
        const errors: FieldErrors = {};
        const asistentes = Number(values.maximoAsistentes);

        if (!espacioSeleccionado) errors.idEspacio = 'Selecciona el espacio.';
        if (!values.responsableEvento.trim()) errors.responsableEvento = 'Ingresa el responsable del evento.';
        if (!values.descripcion.trim()) errors.descripcion = 'Ingresa el motivo del evento.';

        if (!values.maximoAsistentes) errors.maximoAsistentes = 'Ingresa los asistentes esperados.';
        else if (!Number.isInteger(asistentes) || asistentes <= 0) errors.maximoAsistentes = 'Debe ser un número entero mayor a cero.';
        else if (espacioSeleccionado && asistentes > espacioSeleccionado.capacidadMaxima) {
            errors.maximoAsistentes = `No puede superar el aforo del espacio (${espacioSeleccionado.capacidadMaxima}).`;
        }

        if (!values.fecha) errors.fecha = 'Selecciona la fecha.';
        else if (values.fecha < hoy()) errors.fecha = 'No puede ser anterior a hoy.';

        if (esJornada && values.fecha && values.fechaFin) {
            if (values.fechaFin < values.fecha) errors.fechaFin = 'Debe ser igual o posterior a la fecha de inicio.';
            else if (diasEnRango(values.fecha, values.fechaFin) > MAX_DIAS_JORNADA) {
                errors.fechaFin = `La jornada admite máximo ${MAX_DIAS_JORNADA} días.`;
            }
        }

        if (esSemestral) {
            if (!values.fechaFin) errors.fechaFin = 'Selecciona el fin del semestre.';
            else if (values.fecha && values.fechaFin < values.fecha) errors.fechaFin = 'Debe ser igual o posterior al inicio.';
            if (values.dias === 0) errors.dias = 'Selecciona al menos un día de la semana.';
        }

        //La jornada usa el horario completo del espacio; los demas tipos piden hora de inicio y fin
        if (!esJornada) {
            if (!values.horaInicio) errors.horaInicio = 'Ingresa la hora de inicio.';
            if (!values.horaFin) errors.horaFin = 'Ingresa la hora de fin.';

            if (values.horaInicio && values.horaFin && values.horaInicio >= values.horaFin) {
                errors.horaFin = 'Debe ser posterior a la hora de inicio.';
            }
            if (espacioSeleccionado) {
                const apertura = formatHora(espacioSeleccionado.horaApertura);
                const cierre = formatHora(espacioSeleccionado.horaCierre);
                if (values.horaInicio && values.horaInicio < apertura) errors.horaInicio = `El espacio abre a las ${apertura}.`;
                if (values.horaFin && values.horaFin > cierre) errors.horaFin = `El espacio cierra a las ${cierre}.`;
            }
        }

        return errors;
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        const errors = validate();
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0 || !espacioSeleccionado) return;

        const base = {
            idEspacio: espacioSeleccionado.id,
            responsableEvento: values.responsableEvento.trim(),
            descripcion: values.descripcion.trim(),
            maximoAsistentes: Number(values.maximoAsistentes),
            notaSeguridad: values.notaSeguridad.trim(),
        };

        //Cada tipo de reserva tiene su propio endpoint
        const solicitar = () => {
            if (esJornada) {
                return ReserveShift({ ...base, fechaInicio: values.fecha, fechaFin: values.fechaFin || values.fecha });
            }
            if (esSemestral) {
                return ReserveSemester({
                    ...base,
                    fechaInicioSemestre: values.fecha,
                    fechaFinSemestre: values.fechaFin,
                    horaInicio: toApiTime(values.horaInicio),
                    horaFin: toApiTime(values.horaFin),
                    diasSeleccionados: values.dias,
                });
            }
            return ReservePerPeriod({
                ...base,
                fecha: values.fecha,
                horaInicio: toApiTime(values.horaInicio),
                horaFin: toApiTime(values.horaFin),
            });
        };

        //Si falla, el hook deja el mensaje en `error`
        const response = await solicitar();
        if (response?.data) {
            setCreada({ reserva: response.data, mensaje: response.message ?? 'La reserva quedó registrada.' });
        }
    };

    const reiniciar = () => {
        setCreada(null);
        setFieldErrors({});
        setValues(valoresIniciales());
    };

    const back = { to: '/catalogo', label: 'Volver al catálogo' };

    if (creada) {
        const { reserva, mensaje } = creada;
        const variosDias = reserva.fechaInicio !== reserva.fechaFin;

        return (
            <>
                <PageHeader title="Nueva Reserva" back={back} />

                <Card title="Reserva registrada" subtitle={mensaje} className="reserva-confirmada">
                    <p>
                        {reserva.nombreEspacio} · {reserva.nombreCampus}
                    </p>
                    <p>
                        {formatFechaCorta(reserva.fechaInicio)}
                        {variosDias && ` – ${formatFechaCorta(reserva.fechaFin)}`} · {formatHora(reserva.horaInicio)} –{' '}
                        {formatHora(reserva.horaFin)}
                    </p>

                    <div className="form-actions">
                        <ButtonLink to="/catalogo" variant="secondary" size="lg">
                            Volver al catálogo
                        </ButtonLink>
                        <Button size="lg" onClick={reiniciar}>
                            Hacer otra reserva
                        </Button>
                    </div>
                </Card>
            </>
        );
    }

    const formError = error ?? espaciosError;
    const horarioEspacio = espacioSeleccionado
        ? `${formatHora(espacioSeleccionado.horaApertura)} – ${formatHora(espacioSeleccionado.horaCierre)}`
        : undefined;

    return (
        <>
            <PageHeader
                title="Nueva Reserva"
                subtitle={
                    espacioSeleccionado
                        ? `${espacioSeleccionado.nombre} · ${espacioSeleccionado.nombreCampus} · Aforo máximo ${espacioSeleccionado.capacidadMaxima} personas`
                        : 'Selecciona el espacio que quieres reservar'
                }
                back={back}
            />

            <div className="reserva-layout">
                <form className="form-card" onSubmit={handleSubmit} noValidate aria-busy={loading}>
                    <div className="form-grid">
                        <Select
                            label="Espacio"
                            name="idEspacio"
                            placeholder={cargandoEspacios ? 'Cargando...' : 'Selecciona un espacio'}
                            options={reservables.map(({ id, nombre, nombreCampus }) => ({ value: id, label: `${nombre} — ${nombreCampus}` }))}
                            required
                            value={values.idEspacio}
                            onChange={handleChange('idEspacio')}
                            error={fieldErrors.idEspacio}
                            disabled={loading || cargandoEspacios}
                        />
                        <Input
                            label="Responsable del evento"
                            name="responsableEvento"
                            required
                            value={values.responsableEvento}
                            onChange={handleChange('responsableEvento')}
                            error={fieldErrors.responsableEvento}
                            disabled={loading}
                        />

                        <Input
                            className="form-grid__full"
                            label="Motivo del evento"
                            name="descripcion"
                            placeholder="Ej. Taller de pintura infantil"
                            required
                            value={values.descripcion}
                            onChange={handleChange('descripcion')}
                            error={fieldErrors.descripcion}
                            disabled={loading}
                        />

                        {esPeriodo && (
                            <div className="form-grid__thirds">
                                <Input
                                    label="Fecha"
                                    name="fecha"
                                    type="date"
                                    min={hoy()}
                                    required
                                    value={values.fecha}
                                    onChange={handleChange('fecha')}
                                    error={fieldErrors.fecha}
                                    disabled={loading}
                                />
                                <Input
                                    label="Hora inicio"
                                    name="horaInicio"
                                    type="time"
                                    required
                                    value={values.horaInicio}
                                    onChange={handleChange('horaInicio')}
                                    error={fieldErrors.horaInicio}
                                    disabled={loading}
                                />
                                <Input
                                    label="Hora fin"
                                    name="horaFin"
                                    type="time"
                                    required
                                    value={values.horaFin}
                                    onChange={handleChange('horaFin')}
                                    error={fieldErrors.horaFin}
                                    disabled={loading}
                                />
                            </div>
                        )}

                        {esJornada && (
                            <>
                                <Input
                                    label="Fecha inicio"
                                    name="fecha"
                                    type="date"
                                    min={hoy()}
                                    required
                                    hint={horarioEspacio && `Se reserva el horario completo del espacio (${horarioEspacio}).`}
                                    value={values.fecha}
                                    onChange={handleChange('fecha')}
                                    error={fieldErrors.fecha}
                                    disabled={loading}
                                />
                                <Input
                                    label="Fecha fin (opcional)"
                                    name="fechaFin"
                                    type="date"
                                    min={values.fecha || hoy()}
                                    hint={`Máximo ${MAX_DIAS_JORNADA} días.`}
                                    value={values.fechaFin}
                                    onChange={handleChange('fechaFin')}
                                    error={fieldErrors.fechaFin}
                                    disabled={loading}
                                />
                            </>
                        )}

                        {esSemestral && (
                            <>
                                <Input
                                    label="Inicio del semestre"
                                    name="fecha"
                                    type="date"
                                    min={hoy()}
                                    required
                                    value={values.fecha}
                                    onChange={handleChange('fecha')}
                                    error={fieldErrors.fecha}
                                    disabled={loading}
                                />
                                <Input
                                    label="Fin del semestre"
                                    name="fechaFin"
                                    type="date"
                                    min={values.fecha || hoy()}
                                    required
                                    value={values.fechaFin}
                                    onChange={handleChange('fechaFin')}
                                    error={fieldErrors.fechaFin}
                                    disabled={loading}
                                />
                                <Input
                                    label="Hora inicio"
                                    name="horaInicio"
                                    type="time"
                                    required
                                    value={values.horaInicio}
                                    onChange={handleChange('horaInicio')}
                                    error={fieldErrors.horaInicio}
                                    disabled={loading}
                                />
                                <Input
                                    label="Hora fin"
                                    name="horaFin"
                                    type="time"
                                    required
                                    value={values.horaFin}
                                    onChange={handleChange('horaFin')}
                                    error={fieldErrors.horaFin}
                                    disabled={loading}
                                />

                                <div className="field form-grid__full" role="group" aria-labelledby={diasLabelId}>
                                    <span id={diasLabelId} className="field__label">
                                        Días de la semana
                                    </span>
                                    <div className="choice-group choice-group--compact">
                                        {DIAS.map(({ label, value }) => {
                                            const checked = (values.dias & value) !== 0;
                                            const choiceClassName = ['choice', checked && 'choice--checked', loading && 'choice--disabled']
                                                .filter(Boolean)
                                                .join(' ');

                                            return (
                                                <label key={value} className={choiceClassName}>
                                                    <input
                                                        type="checkbox"
                                                        className="choice__input"
                                                        checked={checked}
                                                        disabled={loading}
                                                        onChange={() => setField('dias', values.dias ^ value)}
                                                    />
                                                    {label}
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {fieldErrors.dias && (
                                        <p className="field__error" role="alert">
                                            {fieldErrors.dias}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        <RadioGroup
                            className="form-grid__full"
                            legend="Tipo de reserva"
                            name="tipo"
                            options={TIPO_OPTIONS}
                            value={values.tipo}
                            onChange={(tipo) => setField('tipo', tipo)}
                            disabled={loading}
                        />

                        <Input
                            label="Asistentes esperados"
                            name="maximoAsistentes"
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={espacioSeleccionado?.capacidadMaxima}
                            step={1}
                            placeholder="Ej. 20"
                            required
                            value={values.maximoAsistentes}
                            onChange={handleChange('maximoAsistentes')}
                            error={fieldErrors.maximoAsistentes}
                            disabled={loading}
                        />
                        <Input
                            label="Notas para seguridad"
                            name="notaSeguridad"
                            placeholder="Equipo a ingresar, accesos, etc."
                            value={values.notaSeguridad}
                            onChange={handleChange('notaSeguridad')}
                            disabled={loading}
                        />
                    </div>

                    {formError && (
                        <p className="form-error" role="alert">
                            {formError}
                        </p>
                    )}

                    <div className="form-actions">
                        <ButtonLink to="/catalogo" variant="secondary" size="lg">
                            Cancelar
                        </ButtonLink>
                        <Button type="submit" size="lg" disabled={loading || cargandoEspacios}>
                            {loading ? 'Registrando...' : 'Registrar reserva'}
                        </Button>
                    </div>
                </form>

                <DisponibilidadPanel
                    espacio={espacioSeleccionado}
                    fecha={values.fecha}
                    seleccion={getSeleccion()}
                    {...disponibilidad}
                />
            </div>
        </>
    );
}

export default NuevaReserva;

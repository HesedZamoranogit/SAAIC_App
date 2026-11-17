import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { useCatalogos } from '../../hooks/useCatalogos';
import { ESTADO_ESPACIO, type EspacioRequest, type EstadoEspacio } from '../../models/Espacio.types';
import { toApiTime } from '../../utils/fecha';
import {
    NOMBRE_ESPACIO_MAX,
    validateEspacio,
    type EspacioFieldErrors,
    type EspacioFormValues,
} from '../../validations/espacio.validate';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

//No hay endpoint de estados: las opciones salen del enum ESTADO_ESPACIO
const ESTADO_OPTIONS = Object.entries(ESTADO_ESPACIO).map(([label, value]) => ({ label, value }));

type EspacioFormProps = {
    //Valores con los que arranca el formulario (vacios al registrar, los del espacio al editar)
    initialValues: EspacioFormValues;
    //Texto del boton de envio y el que muestra mientras se guarda
    submitLabel: string;
    loadingLabel: string;
    loading: boolean;
    //Error de la API al guardar
    error: string | null;
    //Se ejecuta solo si el formulario es valido, con los datos ya convertidos al formato de la API
    onSubmit: (dto: EspacioRequest) => void;
};

//Formulario compartido por "Nuevo espacio" y "Editar espacio"
const EspacioForm = ({ initialValues, submitLabel, loadingLabel, loading, error, onSubmit }: EspacioFormProps) => {
    const { campuses, tiposEspacio, loading: catalogosLoading, error: catalogosError } = useCatalogos();

    const [values, setValues] = useState<EspacioFormValues>(initialValues);
    const [fieldErrors, setFieldErrors] = useState<EspacioFieldErrors>({});

    const handleChange = (field: keyof EspacioFormValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValues((prev) => ({ ...prev, [field]: e.target.value }));
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        const errors = validateEspacio(values);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        onSubmit({
            nombre: values.nombre.trim(),
            idTipoEspacio: Number(values.idTipoEspacio),
            idCampus: Number(values.idCampus),
            horaApertura: toApiTime(values.horaApertura),
            horaCierre: toApiTime(values.horaCierre),
            capacidadMaxima: Number(values.capacidadMaxima),
            estado: Number(values.estado) as EstadoEspacio,
        });
    };

    const formError = error ?? catalogosError;
    const catalogoPlaceholder = (texto: string) => (catalogosLoading ? 'Cargando...' : texto);

    return (
        <form className="form-card" onSubmit={handleSubmit} noValidate aria-busy={loading}>
            <div className="form-grid">
                <Input
                    className="form-grid__full"
                    label="Nombre del espacio"
                    name="nombre"
                    placeholder="Ej. Aula 1"
                    maxLength={NOMBRE_ESPACIO_MAX}
                    required
                    value={values.nombre}
                    onChange={handleChange('nombre')}
                    error={fieldErrors.nombre}
                    disabled={loading}
                />

                <Select
                    label="Tipo de espacio"
                    name="idTipoEspacio"
                    placeholder={catalogoPlaceholder('Selecciona un tipo')}
                    options={tiposEspacio.map(({ id, nombre }) => ({ value: id, label: nombre }))}
                    required
                    value={values.idTipoEspacio}
                    onChange={handleChange('idTipoEspacio')}
                    error={fieldErrors.idTipoEspacio}
                    disabled={loading || catalogosLoading}
                />
                <Select
                    label="Campus"
                    name="idCampus"
                    placeholder={catalogoPlaceholder('Selecciona un campus')}
                    options={campuses.map(({ id, nombre }) => ({ value: id, label: nombre }))}
                    required
                    value={values.idCampus}
                    onChange={handleChange('idCampus')}
                    error={fieldErrors.idCampus}
                    disabled={loading || catalogosLoading}
                />

                <Input
                    label="Hora de apertura"
                    name="horaApertura"
                    type="time"
                    required
                    value={values.horaApertura}
                    onChange={handleChange('horaApertura')}
                    error={fieldErrors.horaApertura}
                    disabled={loading}
                />
                <Input
                    label="Hora de cierre"
                    name="horaCierre"
                    type="time"
                    required
                    value={values.horaCierre}
                    onChange={handleChange('horaCierre')}
                    error={fieldErrors.horaCierre}
                    disabled={loading}
                />

                <Input
                    label="Capacidad máxima"
                    name="capacidadMaxima"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    placeholder="Ej. 30"
                    required
                    value={values.capacidadMaxima}
                    onChange={handleChange('capacidadMaxima')}
                    error={fieldErrors.capacidadMaxima}
                    disabled={loading}
                />
                <Select
                    label="Estado"
                    name="estado"
                    options={ESTADO_OPTIONS}
                    required
                    value={values.estado}
                    onChange={handleChange('estado')}
                    disabled={loading}
                />
            </div>

            {formError && (
                <p className="form-error" role="alert">
                    {formError}
                </p>
            )}

            <div className="form-actions">
                <Button type="submit" size="lg" disabled={loading || catalogosLoading}>
                    {loading ? loadingLabel : submitLabel}
                </Button>
            </div>
        </form>
    );
};

export default EspacioForm;

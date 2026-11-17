import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EspacioForm from '../components/espacio/EspacioForm';
import PageHeader from '../components/layout/PageHeader';
import { useEspacio } from '../hooks/useEspacio';
import type { EspacioRequest, EspacioResponse } from '../models/Espacio.types';
import { formatHora } from '../utils/fecha';
import type { EspacioFormValues } from '../validations/espacio.validate';

//Los inputs trabajan con texto: ids y capacidad como string y las horas como "HH:mm"
const toFormValues = (espacio: EspacioResponse): EspacioFormValues => ({
    nombre: espacio.nombre,
    idTipoEspacio: String(espacio.idTipoEspacio),
    idCampus: String(espacio.idCampus),
    horaApertura: formatHora(espacio.horaApertura),
    horaCierre: formatHora(espacio.horaCierre),
    capacidadMaxima: String(espacio.capacidadMaxima),
    estado: String(espacio.estado),
});

const EditarEspacio = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const idEspacio = Number(id);
    const idValido = Number.isInteger(idEspacio) && idEspacio > 0;

    const { GetEspacio, ActualizarEspacio, loading, error } = useEspacio();
    //null mientras no llega el espacio
    const [original, setOriginal] = useState<EspacioResponse | null>(null);

    //Al abrir la pantalla se pide el espacio para llenar el formulario
    useEffect(() => {
        if (!idValido) return;

        const cargarEspacio = async () => {
            const response = await GetEspacio(idEspacio);
            if (response?.data) setOriginal(response.data);
        };

        cargarEspacio();
    }, [GetEspacio, idEspacio, idValido]);

    const handleSubmit = async (dto: EspacioRequest) => {
        if (!original) return;

        //"active" no se edita aqui: se conserva el que ya tenia el espacio
        const response = await ActualizarEspacio(original.id, { ...dto, active: original.active });

        //Si falla, el hook deja el mensaje en `error`
        if (response) navigate('/catalogo');
    };

    const renderContenido = () => {
        if (!idValido) {
            return (
                <div className="catalog-placeholder catalog-placeholder--error" role="alert">
                    El espacio indicado no es válido.
                </div>
            );
        }

        if (!original) {
            //Sin espacio cargado, `error` es el de la consulta (el de guardar solo existe con el formulario visible)
            return error ? (
                <div className="catalog-placeholder catalog-placeholder--error" role="alert">
                    {error}
                </div>
            ) : (
                <div className="catalog-placeholder" role="status">
                    Cargando espacio...
                </div>
            );
        }

        return (
            <EspacioForm
                key={original.id}
                initialValues={toFormValues(original)}
                submitLabel="Guardar cambios"
                loadingLabel="Guardando..."
                loading={loading}
                error={error}
                onSubmit={handleSubmit}
            />
        );
    };

    return (
        <>
            <PageHeader
                title="Editar Espacio"
                subtitle={original ? `Actualiza los datos de ${original.nombre}` : 'Actualiza los datos del aula o foro'}
                back={{ to: '/catalogo', label: 'Volver al catálogo' }}
            />

            {renderContenido()}
        </>
    );
}

export default EditarEspacio;

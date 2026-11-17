import { useNavigate } from 'react-router-dom';
import EspacioForm from '../components/espacio/EspacioForm';
import PageHeader from '../components/layout/PageHeader';
import { useEspacio } from '../hooks/useEspacio';
import { ESTADO_ESPACIO, type EspacioRequest } from '../models/Espacio.types';
import type { EspacioFormValues } from '../validations/espacio.validate';

const INITIAL_VALUES: EspacioFormValues = {
    nombre: '',
    idTipoEspacio: '',
    idCampus: '',
    horaApertura: '',
    horaCierre: '',
    capacidadMaxima: '',
    estado: String(ESTADO_ESPACIO.Disponible),
};

const NuevoEspacio = () => {
    const navigate = useNavigate();
    const { espacio, loading, error } = useEspacio();

    const handleSubmit = async (dto: EspacioRequest) => {
        const response = await espacio(dto);

        //Si falla, el hook deja el mensaje en `error`
        if (response) navigate('/catalogo');
    };

    return (
        <>
            <PageHeader
                title="Nuevo Espacio"
                subtitle="Registra un aula o foro para que pueda ser reservado"
                back={{ to: '/catalogo', label: 'Volver al catálogo' }}
            />

            <EspacioForm
                initialValues={INITIAL_VALUES}
                submitLabel="Registrar espacio"
                loadingLabel="Registrando..."
                loading={loading}
                error={error}
                onSubmit={handleSubmit}
            />
        </>
    );
}

export default NuevoEspacio;

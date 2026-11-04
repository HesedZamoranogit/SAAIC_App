import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EspacioCard from '../components/catalog/EspacioCard';
import PageHeader from '../components/layout/PageHeader';
import { ButtonLink } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useEspacio } from '../hooks/useEspacio';
import { TODOS_LOS_REGISTROS } from '../models/Api.types';
import type { EspacioResponse } from '../models/Espacio.types';

const Catalogo = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const esAdmin = user?.rol === 'admin';

    const { GetEspacios, error } = useEspacio();
    //null mientras no llega la primera respuesta
    const [espacios, setEspacios] = useState<EspacioResponse[] | null>(null);

    //Al abrir el catalogo se piden todos los espacios activos
    useEffect(() => {
        const cargarEspacios = async () => {
            const response = await GetEspacios(TODOS_LOS_REGISTROS);
            setEspacios(response?.data?.items ?? []);
        };

        cargarEspacios();
    }, [GetEspacios]);

    //La pantalla de reserva recibe el espacio elegido por query string
    const handleReservar = (espacio: EspacioResponse) => {
        navigate(`/reservas/nueva?espacio=${espacio.id}`);
    };

    const renderEspacios = () => {
        if (error) {
            return (
                <div className="catalog-placeholder catalog-placeholder--error" role="alert">
                    {error}
                </div>
            );
        }

        if (!espacios) {
            return (
                <div className="catalog-placeholder" role="status">
                    Cargando espacios...
                </div>
            );
        }

        if (espacios.length === 0) {
            return <div className="catalog-placeholder">Aún no hay espacios registrados.</div>;
        }

        return (
            <ul className="catalog-grid" role="list">
                {espacios.map((espacio) => (
                    <li key={espacio.id}>
                        <EspacioCard espacio={espacio} onReservar={handleReservar} />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>
            <PageHeader
                title="Catálogo de Espacios"
                subtitle="Consulta los espacios disponibles y solicita tu reserva"
                actions={
                    //Solo el administrador puede registrar espacios (la API tambien lo exige)
                    esAdmin && (
                        <ButtonLink to="/espacios/nuevo">
                            {/* Icono plus */}
                            Nuevo Espacio
                        </ButtonLink>
                    )
                }
            />

            <section aria-label="Espacios disponibles">{renderEspacios()}</section>
        </>
    );
}

export default Catalogo;

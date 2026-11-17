import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EspacioCard from '../components/catalog/EspacioCard';
import EspacioFiltros from '../components/catalog/EspacioFiltros';
import PageHeader from '../components/layout/PageHeader';
import { ButtonLink } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useEspacio } from '../hooks/useEspacio';
import { TODOS_LOS_REGISTROS } from '../models/Api.types';
import type { EspacioResponse } from '../models/Espacio.types';

//Compara sin mayusculas ni acentos: "salon" encuentra "Salón"
const normalizar = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const Catalogo = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const esAdmin = user?.rol === 'admin';

    const { GetEspacios, error } = useEspacio();
    //null mientras no llega la primera respuesta
    const [espacios, setEspacios] = useState<EspacioResponse[] | null>(null);

    //Filtros: campus elegido ('' = todos) y texto del buscador
    const [idCampus, setIdCampus] = useState('');
    const [busqueda, setBusqueda] = useState('');

    //Los campus del filtro salen de los propios espacios (cada uno trae su campus): asi no hay otra consulta
    //y no aparece un campus que no tenga ningun espacio
    const campuses = useMemo(() => {
        const porId = new Map((espacios ?? []).map((espacio) => [espacio.idCampus, espacio.nombreCampus]));

        return [...porId]
            .map(([id, nombre]) => ({ id, nombre }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    }, [espacios]);

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

    //La pantalla de edicion carga el espacio por su id (GET /Espacios/{id})
    const handleEditar = (espacio: EspacioResponse) => {
        navigate(`/espacios/${espacio.id}/editar`);
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

        //El buscador mira el nombre, que es donde va el numero ("Aula 7")
        const termino = normalizar(busqueda.trim());
        const espaciosFiltrados = espacios.filter(
            (espacio) =>
                (!idCampus || espacio.idCampus === Number(idCampus)) && normalizar(espacio.nombre).includes(termino),
        );

        if (espaciosFiltrados.length === 0) {
            return (
                <div className="catalog-placeholder" role="status">
                    No hay espacios que coincidan con tu búsqueda.
                </div>
            );
        }

        return (
            <ul className="catalog-grid" role="list">
                {espaciosFiltrados.map((espacio) => (
                    <li key={espacio.id}>
                        {/* El menu de los 3 puntos (editar) es solo del administrador; la API tambien lo exige */}
                        <EspacioCard
                            espacio={espacio}
                            onReservar={handleReservar}
                            onEditar={esAdmin ? handleEditar : undefined}
                        />
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

            {/* Los filtros solo tienen sentido cuando ya hay espacios que filtrar */}
            {!error && espacios && espacios.length > 0 && (
                <EspacioFiltros
                    campuses={campuses}
                    idCampus={idCampus}
                    busqueda={busqueda}
                    onIdCampusChange={setIdCampus}
                    onBusquedaChange={setBusqueda}
                />
            )}

            <section aria-label="Espacios disponibles">{renderEspacios()}</section>
        </>
    );
}

export default Catalogo;

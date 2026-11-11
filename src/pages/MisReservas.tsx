import PageHeader from "../components/layout/PageHeader";
import { useMisReservas } from "../hooks/useMisReservas";
import type { ReserveResponse } from "../models/reserve.type";
import Table, { type Column } from "../components/ui/Table";
import Button from "../components/ui/Button";

const MisReservas = () => {
    const {
        reservas,
        pageNumber,
        totalPages,
        hasPreviousPage,
        hasNextPage,
        setPageNumber,
        loading,
        error,
    } = useMisReservas();

    return (
        <>
            <PageHeader
                title="Reservas"
                subtitle="Reservas registradas en el sistema y su estado actual"
            />

            {loading ? (
                <p role="status">Cargando reservas...</p>
            ) : error ? (
                <p role="alert">{error}</p>
            ) : reservas.length === 0 ? (
                <p>No tienes reservas registradas.</p>
            ) : (
                <>
                    <Table
                        columns={columns}
                        rows={reservas}
                        getRowKey={(reserva) => reserva.id}
                    />

                    {totalPages > 1 && (
                        <nav className="pagination" aria-label="Paginación de reservas">
                            <Button
                                variant="outline"
                                disabled={!hasPreviousPage || loading}
                                onClick={() => setPageNumber((current) => current - 1)}
                            >
                                Anterior
                            </Button>

                            <span className="pagination__label" aria-live="polite">
                                Página {pageNumber} de {totalPages}
                            </span>

                            <Button
                                variant="outline"
                                disabled={!hasNextPage || loading}
                                onClick={() => setPageNumber((current) => current + 1)}
                            >
                                Siguiente
                            </Button>
                        </nav>
                    )}
                </>
            )}
        </>
    );
};

const columns: Column<ReserveResponse>[] = [
    { key: "nombreEspacio", header: "Espacio" },
    { key: "nombreTipoEspacio", header: "Tipo de espacio" },
    { key: "nombreCampus", header: "Campus" },
    { key: "tipoReservaDescripcion", header: "Tipo de reserva" },
    {
        key: "fechaInicio",
        header: "Inicio",
        render: (reserva) => `${reserva.fechaInicio} -> ${reserva.horaInicio}`,
    },
    {
        key: "fechaFin",
        header: "Fin",
        render: (reserva) => `${reserva.fechaFin} -> ${reserva.horaFin}`,
    },
    { key: "estadoDescripcion", header: "Estado" },
];

export default MisReservas;
import { Link } from 'react-router-dom';
import AgendaItem from '../components/dashboard/AgendaItem';
import StatCard from '../components/dashboard/StatCard';
import PageHeader from '../components/layout/PageHeader';
import { ButtonLink } from '../components/ui/Button';
import Card from '../components/ui/Card';
import type { Estado } from '../components/ui/StatusChip';
import { useAuth } from '../hooks/useAuth';

//Datos de ejemplo para la estructura, se reemplazaran por el servicio
const STATS = {
    admin: [
        { label: 'Reservas actuales', value: 6, detail: '2 en curso' },
        { label: 'Esta semana', value: 23, detail: '4 recurrentes' },
        { label: 'Pendientes', value: 3, detail: 'por aprobar' },
    ],
    usuario: [
        { label: 'Tus reservas de hoy', value: 6, detail: '2 en curso' },
        { label: 'Tu semana', value: 23, detail: '4 recurrentes' },
        { label: 'Tus pendientes', value: 3, detail: 'por aprobar' },
    ],
};

const AGENDA_HOY: { hora: string; titulo: string; detalle: string; estado: Estado }[] = [
    { hora: '08:00', titulo: 'Clase de teatro', detalle: 'Aula 3 · Mtra. Luna · 25 personas', estado: 'Confirmada' },
    { hora: '13:00', titulo: 'Conferencia de cultura regional', detalle: 'Foro A · Lic. Ramírez · 120 personas', estado: 'Confirmada' },
    { hora: '16:00', titulo: 'Ensayo de banda', detalle: 'Aula 7 · Prof. Ortega · 18 personas', estado: 'Pendiente' },
    { hora: '18:00', titulo: 'Reunión de coordinación', detalle: 'Sala de juntas · Cultura', estado: 'Confirmada' },
];

const Home = () => {
    const { user } = useAuth();
    const rol = user?.rol ?? 'usuario';
    const esAdmin = rol === 'admin';

    return (
        <>
            <PageHeader
                title="Home"
                subtitle="Jueves 22 de octubre de 2026 · Campus Navojoa Sur"
                actions={
                    <ButtonLink to="/reservas/nueva">
                        {/* Icono plus */}
                        Nueva reserva
                    </ButtonLink>
                }
            />

            <section className="stats-grid" aria-label="Resumen de reservas">
                {STATS[rol].map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </section>

            <div className={`dashboard__content${esAdmin ? ' dashboard__content--with-aside' : ''}`}>
                <Card
                    title="Semana del 20 al 24 de octubre"
                    subtitle={esAdmin ? 'Ocupación por espacio' : 'Tus reservas de la semana'}
                    className="dashboard__calendar"
                >
                    {/* Pendiente: componente de calendario semanal */}
                    <div className="calendar-placeholder">Calendario semanal</div>
                </Card>

                {esAdmin && (
                    <Card title="Hoy">
                        <ul className="agenda-list" role="list">
                            {AGENDA_HOY.map((item) => (
                                <AgendaItem key={`${item.hora}-${item.titulo}`} {...item} />
                            ))}
                        </ul>
                        <Link to="/reservas" className="card__link">
                            Ver todas las solicitudes →
                        </Link>
                    </Card>
                )}
            </div>
        </>
    );
}

export default Home;

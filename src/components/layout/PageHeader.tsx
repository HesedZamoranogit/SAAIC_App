import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  //Enlace para regresar, se muestra arriba del titulo (ej. "Volver al catálogo")
  back?: { to: string; label: string };
  //Botones o enlaces a la derecha del titulo
  actions?: ReactNode;
};

const PageHeader = ({ title, subtitle, back, actions }: PageHeaderProps) => {
  return (
    <header className="page-header">
      <div className="page-header__titles">
        {back && (
          <Link to={back.to} className="page-header__back">
            <span aria-hidden="true">←</span> {back.label}
          </Link>
        )}
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
};

export default PageHeader;

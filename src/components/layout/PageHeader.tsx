import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  //Botones o enlaces a la derecha del titulo
  actions?: ReactNode;
};

const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
  return (
    <header className="page-header">
      <div className="page-header__titles">
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
};

export default PageHeader;

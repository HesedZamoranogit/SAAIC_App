import { useId, type ReactNode } from 'react';

type CardProps = {
  title: string;
  subtitle?: string;
  //Contenido extra a la derecha del header
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
};

const Card = ({ title, subtitle, aside, className, children }: CardProps) => {
  const titleId = useId();

  return (
    <section className={['card', className].filter(Boolean).join(' ')} aria-labelledby={titleId}>
      <header className="card__header">
        <h2 id={titleId} className="card__title">
          {title}
        </h2>
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
        {aside}
      </header>
      {children}
    </section>
  );
};

export default Card;

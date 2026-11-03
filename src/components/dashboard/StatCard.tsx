type StatCardProps = {
  label: string;
  value: number | string;
  detail?: string;
};

const StatCard = ({ label, value, detail }: StatCardProps) => {
  return (
    <article className="stat-card">
      <h2 className="stat-card__label">{label}</h2>
      <p className="stat-card__value">{value}</p>
      {detail && <p className="stat-card__detail">{detail}</p>}
    </article>
  );
};

export default StatCard;

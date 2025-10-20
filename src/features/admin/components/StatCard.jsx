const StatCard = ({ type, icon, title, value, trend, trendType }) => {
  return (
    <div className={`stat-card stat-${type}`}>
      <div className="stat-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        <span className={`stat-trend ${trendType}`}>{trend}</span>
      </div>
    </div>
  );
};

export default StatCard;

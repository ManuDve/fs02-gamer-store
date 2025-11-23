const DashboardFilters = ({ dateFilter, setDateFilter, searchTerm, setSearchTerm }) => {
  return (
    <div className="dashboard-filters">
      <div className="filter-group">
        <label htmlFor="dateFilter">Filtrar por fecha:</label>
        <select
          id="dateFilter"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="form-select"
        >
          <option value="all">Todos los tiempos</option>
          <option value="today">Hoy</option>
          <option value="week">Última semana</option>
          <option value="month">Último mes</option>
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="searchTerm">Buscar:</label>
        <input
          type="text"
          id="searchTerm"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
  );
};

export default DashboardFilters;

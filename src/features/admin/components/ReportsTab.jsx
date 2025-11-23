const ReportsTab = () => {
  const reports = [
    {
      icon: 'bi-graph-up-arrow',
      title: 'Reporte de Ventas',
      description: 'Análisis detallado de ventas por periodo',
    },
    {
      icon: 'bi-people-fill',
      title: 'Reporte de Usuarios',
      description: 'Estadísticas de registro y actividad',
    },
    {
      icon: 'bi-box-seam-fill',
      title: 'Reporte de Inventario',
      description: 'Estado actual y movimientos de stock',
    },
    {
      icon: 'bi-cash-stack',
      title: 'Reporte Financiero',
      description: 'Ingresos, gastos y rentabilidad',
    },
    {
      icon: 'bi-star-fill',
      title: 'Productos Más Vendidos',
      description: 'Top 10 de productos populares',
    },
    {
      icon: 'bi-exclamation-triangle',
      title: 'Alertas de Stock',
      description: 'Productos con stock bajo o agotados',
    },
  ];

  return (
    <div className="reports-section">
      <h2>Reportes y Análisis</h2>
      <div className="reports-grid">
        {reports.map((report, index) => (
          <div key={index} className="report-card">
            <div className="report-icon">
              <i className={`bi ${report.icon}`}></i>
            </div>
            <h3>{report.title}</h3>
            <p>{report.description}</p>
            <button className="btn btn-outline-primary">
              {report.title.includes('Alertas') ? 'Ver Alertas' : 'Generar Reporte'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsTab;

const DashboardTabs = ({ activeTab, setActiveTab, usersCount, inventoryCount }) => {
  return (
    <div className="dashboard-tabs">
      <button
        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        onClick={() => setActiveTab('overview')}
      >
        <i className="bi bi-speedometer2"></i> Resumen
      </button>
      <button
        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        onClick={() => setActiveTab('users')}
      >
        <i className="bi bi-people"></i> Usuarios ({usersCount})
      </button>
      <button
        className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
        onClick={() => setActiveTab('inventory')}
      >
        <i className="bi bi-box-seam"></i> Inventario ({inventoryCount})
      </button>
      <button
        className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
        onClick={() => setActiveTab('reports')}
      >
        <i className="bi bi-graph-up"></i> Reportes
      </button>
    </div>
  );
};

export default DashboardTabs;
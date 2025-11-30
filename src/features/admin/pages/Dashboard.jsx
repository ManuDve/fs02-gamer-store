import { useState } from 'react';
import './Dashboard.css';

// Components
import DashboardHeader from '../components/DashboardHeader';
import DashboardFilters from '../components/DashboardFilters';
import DashboardTabs from '../components/DashboardTabs';
import OverviewTab from '../components/OverviewTab';
import UsersTab from '../components/UsersTab';
import InventoryTab from '../components/InventoryTab';
import ReportsTab from '../components/ReportsTab';

// Hooks
import { useDashboardData } from '../hooks/useDashboardData';
import { useDashboardFilters } from '../hooks/useDashboardFilters';

// Utils
import { formatPrice } from '../utils/formatPrice';

const Dashboard = () => {
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Obtener datos del dashboard
  const { dashboardData, loading } = useDashboardData();

  // Aplicar filtros
  const { filteredUsers, filteredInventory } = useDashboardFilters(
    dashboardData,
    dateFilter,
    searchTerm
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader />

      <DashboardFilters
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <DashboardTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        usersCount={filteredUsers.length}
        inventoryCount={filteredInventory.length}
      />

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <OverviewTab dashboardData={dashboardData} formatPrice={formatPrice} />
        )}

        {activeTab === 'users' && (
          <UsersTab filteredUsers={filteredUsers} formatPrice={formatPrice} />
        )}

        {activeTab === 'inventory' && (
          <InventoryTab filteredInventory={filteredInventory} formatPrice={formatPrice} />
        )}

        {activeTab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
};

export default Dashboard;
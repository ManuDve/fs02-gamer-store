import { useState } from 'react';
import './Dashboard.css';

// Components
import DashboardHeader from '../components/DashboardHeader';
import DashboardFilters from '../components/DashboardFilters';
import DashboardTabs from '../components/DashboardTabs';
import OverviewTab from '../components/OverviewTab';
import OrdersTab from '../components/OrdersTab';
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
  const dashboardData = useDashboardData();

  // Aplicar filtros
  const { filteredOrders, filteredUsers, filteredInventory } = useDashboardFilters(
    dashboardData,
    dateFilter,
    searchTerm
  );

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
        ordersCount={filteredOrders.length}
        usersCount={filteredUsers.length}
        inventoryCount={filteredInventory.length}
      />

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <OverviewTab dashboardData={dashboardData} formatPrice={formatPrice} />
        )}

        {activeTab === 'orders' && (
          <OrdersTab filteredOrders={filteredOrders} formatPrice={formatPrice} />
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

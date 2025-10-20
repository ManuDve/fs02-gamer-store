import StatCard from './StatCard';

const OverviewTab = ({ dashboardData, formatPrice }) => {
  return (
    <div className="overview-section">
      <div className="stats-grid">
        <StatCard
          type="sales"
          icon="bi-currency-dollar"
          title="Ventas Totales"
          value={formatPrice(dashboardData.totalSales)}
          trend="+12.5% vs mes anterior"
          trendType="positive"
        />
        <StatCard
          type="orders"
          icon="bi-cart-check"
          title="Total de Pedidos"
          value={dashboardData.totalOrders}
          trend="+8.3% vs mes anterior"
          trendType="positive"
        />
        <StatCard
          type="users"
          icon="bi-people"
          title="Usuarios Registrados"
          value={dashboardData.registeredUsers}
          trend="+15.7% vs mes anterior"
          trendType="positive"
        />
        <StatCard
          type="inventory"
          icon="bi-box-seam"
          title="Productos en Stock"
          value={dashboardData.productsInStock}
          trend={`${dashboardData.lowStockProducts} con stock bajo`}
          trendType="warning"
        />
      </div>

      <div className="quick-overview">
        <div className="quick-section">
          <h3>Últimas Compras</h3>
          <div className="quick-list">
            {dashboardData.recentOrders.slice(0, 5).map(order => (
              <div key={order.id} className="quick-item">
                <div>
                  <strong>{order.customer}</strong>
                  <span className="order-id">{order.id}</span>
                </div>
                <div className="quick-item-right">
                  <span className="order-total">{formatPrice(order.total)}</span>
                  <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;

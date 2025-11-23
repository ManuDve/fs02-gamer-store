const OrdersTab = ({ filteredOrders, formatPrice }) => {
  return (
    <div className="orders-section">
      <div className="section-header">
        <h2>Gestión de Compras</h2>
        <button className="btn btn-primary">
          <i className="bi bi-download"></i> Exportar
        </button>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td><strong>{order.id}</strong></td>
                <td>{order.customer}</td>
                <td>{formatPrice(order.total)}</td>
                <td>{new Date(order.date).toLocaleDateString('es-CL')}</td>
                <td>
                  <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className="btn-icon" title="Ver detalles">
                    <i className="bi bi-eye"></i>
                  </button>
                  <button className="btn-icon" title="Editar">
                    <i className="bi bi-pencil"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredOrders.length === 0 && (
        <div className="empty-state">
          <i className="bi bi-inbox"></i>
          <p>No se encontraron pedidos con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;

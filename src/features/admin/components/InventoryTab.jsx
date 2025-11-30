const InventoryTab = ({ filteredInventory, formatPrice }) => {
  return (
    <div className="inventory-section">
      <div className="section-header">
        <h2>Gestión de Inventario</h2>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td><strong>{product.name}</strong></td>
                <td>{product.category}</td>
                <td>
                  <span className={`stock-indicator ${product.stock < 10 ? 'low' : 'normal'}`}>
                    {product.stock}
                  </span>
                </td>
                <td>{formatPrice(product.price)}</td>
                <td>
                  <span className={`status-badge ${product.status === 'Stock bajo' ? 'status-warning' : 'status-success'}`}>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredInventory.length === 0 && (
        <div className="empty-state">
          <i className="bi bi-box-seam"></i>
          <p>No se encontraron productos con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
};

export default InventoryTab;
const UsersTab = ({ filteredUsers, formatPrice }) => {
  return (
    <div className="users-section">
      <div className="section-header">
        <h2>Gestión de Usuarios</h2>
        <button className="btn btn-primary">
          <i className="bi bi-person-plus"></i> Agregar Usuario
        </button>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Pedidos</th>
              <th>Total Gastado</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>{user.orders}</td>
                <td>{formatPrice(user.totalSpent)}</td>
                <td>{new Date(user.registerDate).toLocaleDateString('es-CL')}</td>
                <td>
                  <button className="btn-icon" title="Ver perfil">
                    <i className="bi bi-person"></i>
                  </button>
                  <button className="btn-icon" title="Editar">
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn-icon btn-danger" title="Eliminar">
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <i className="bi bi-people"></i>
          <p>No se encontraron usuarios con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
};

export default UsersTab;

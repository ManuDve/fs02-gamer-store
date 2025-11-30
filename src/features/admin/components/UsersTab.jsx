const UsersTab = ({ filteredUsers, formatPrice }) => {
  return (
    <div className="users-section">
      <div className="section-header">
        <h2>Gestión de Usuarios</h2>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <i className="bi bi-person-circle"></i>
                    <div>
                      <div><strong>{user.name}</strong></div>
                      <small>ID: {user.id}</small>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    <i className={`bi bi-${user.role === 'admin' ? 'shield-check' : 'person'}`}></i>
                    {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </span>
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
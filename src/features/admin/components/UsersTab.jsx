import { useState, useEffect } from 'react';
import { userService } from '../../../shared/services/userService';
import { authorityService } from '../../../shared/services/authorityService';
import './UsersTab.css';

const UsersTab = ({ formatPrice }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingRole, setTogglingRole] = useState(null);
  
  // Estados del modal
  const [showModal, setShowModal] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  
  // Estados del formulario (copiados de Register.jsx)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      
      const usersWithRoles = await Promise.all(
        data.map(async (user) => {
          try {
            const authorities = await authorityService.getByUserId(user.id);
            const isAdmin = authorities.some(auth => auth.authority === 'ROLE_ADMIN');
            
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              orders: user.orders || 0,
              totalSpent: user.totalSpent || 0,
              registerDate: user.createdAt || new Date().toISOString(),
              isAdmin: isAdmin,
              authorities: authorities
            };
          } catch (error) {
            console.error(`Error al cargar roles del usuario ${user.id}:`, error);
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              orders: user.orders || 0,
              totalSpent: user.totalSpent || 0,
              registerDate: user.createdAt || new Date().toISOString(),
              isAdmin: false,
              authorities: []
            };
          }
        })
      );
      
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar usuarios. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Funciones del formulario (copiadas de Register.jsx)
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsCreatingUser(true);

    try {
      await userService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });
      
      alert(`Usuario ${formData.name} creado exitosamente`);
      
      // Resetear formulario
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
      });
      setFormErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
      
      // Cerrar modal y recargar
      setShowModal(false);
      loadUsers();
    } catch (error) {
      alert('Error al crear usuario: ' + error.message);
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleToggleAdminRole = async (userId, userName, isCurrentlyAdmin) => {
    const action = isCurrentlyAdmin ? 'quitar permisos de administrador a' : 'promover como administrador a';
    
    if (!confirm(`¿Estás seguro de ${action} ${userName}?`)) return;

    try {
      setTogglingRole(userId);

      if (isCurrentlyAdmin) {
        const user = users.find(u => u.id === userId);
        const adminAuthority = user.authorities.find(auth => auth.authority === 'ROLE_ADMIN');
        
        if (adminAuthority) {
          await authorityService.delete(adminAuthority.id);
          
          setUsers(prevUsers => 
            prevUsers.map(u => 
              u.id === userId 
                ? { 
                    ...u, 
                    isAdmin: false,
                    authorities: u.authorities.filter(auth => auth.authority !== 'ROLE_ADMIN')
                  }
                : u
            )
          );
          
          alert(`Se han quitado los permisos de administrador a ${userName}`);
        }
      } else {
        const newAuthority = await authorityService.create({
          userId: userId,
          authority: "ROLE_ADMIN"
        });
        
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId 
              ? { 
                  ...u, 
                  isAdmin: true,
                  authorities: [...u.authorities, newAuthority]
                }
              : u
          )
        );
        
        alert(`${userName} ha sido promovido a administrador`);
      }
    } catch (error) {
      console.error('Error al cambiar rol:', error);
      alert('Error al cambiar rol: ' + error.message);
      loadUsers();
    } finally {
      setTogglingRole(null);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`¿Estás seguro de eliminar a ${userName}? Esta acción no se puede deshacer.`)) return;

    try {
      await userService.deleteUser(userId);
      alert(`${userName} ha sido eliminado`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      alert('Error al eliminar usuario: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="users-section">
        <div className="loading-state">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando usuarios...</span>
          </div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-section">
        <div className="error-state">
          <i className="bi bi-exclamation-triangle"></i>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadUsers}>
            <i className="bi bi-arrow-clockwise"></i> Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-section">
      <div className="section-header">
        <h2>Gestión de Usuarios</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
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
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>{user.orders}</td>
                <td>{formatPrice(user.totalSpent)}</td>
                <td>{new Date(user.registerDate).toLocaleDateString('es-CL')}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn-icon"
                      style={{
                        backgroundColor: user.isAdmin ? 'rgba(255, 193, 7, 0.8)' : 'rgba(40, 167, 69, 0.8)',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                      }}
                      title={user.isAdmin ? 'Quitar permisos de Admin' : 'Promover a Admin'}
                      onClick={() => handleToggleAdminRole(user.id, user.name, user.isAdmin)}
                      disabled={togglingRole === user.id}
                    >
                      {togglingRole === user.id ? (
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                      ) : user.isAdmin ? (
                        <i className="bi bi-shield-slash"></i>
                      ) : (
                        <i className="bi bi-shield-check"></i>
                      )}
                    </button>
                    <button 
                      className="btn-icon"
                      style={{
                        backgroundColor: 'rgba(220, 53, 69, 0.8)',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                      }}
                      title="Eliminar"
                      onClick={() => handleDeleteUser(user.id, user.name)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="empty-state">
          <i className="bi bi-people"></i>
          <p>No hay usuarios registrados</p>
        </div>
      )}

      {/* Modal con formulario de Register.jsx adaptado */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <i className="bi bi-person-plus-fill"></i> Agregar Nuevo Usuario
              </h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              {/* Formulario copiado de Register.jsx */}
              <form onSubmit={handleCreateUser} className="register-form">
                {/* Nombre */}
                <div className="form-group">
                  <label htmlFor="name">
                    <i className="bi bi-person"></i> Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                    placeholder="Nombre completo"
                    value={formData.name}
                    onChange={handleFormChange}
                    disabled={isCreatingUser}
                  />
                  {formErrors.name && (
                    <div className="invalid-feedback">{formErrors.name}</div>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="bi bi-envelope"></i> Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    placeholder="email@ejemplo.com"
                    value={formData.email}
                    onChange={handleFormChange}
                    disabled={isCreatingUser}
                  />
                  {formErrors.email && (
                    <div className="invalid-feedback">{formErrors.email}</div>
                  )}
                </div>

                {/* Teléfono */}
                <div className="form-group">
                  <label htmlFor="phone">
                    <i className="bi bi-telephone"></i> Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    placeholder="+56 9 1234 5678"
                    value={formData.phone}
                    onChange={handleFormChange}
                    disabled={isCreatingUser}
                  />
                </div>

                {/* Contraseña */}
                <div className="form-group">
                  <label htmlFor="password">
                    <i className="bi bi-lock"></i> Contraseña
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={handleFormChange}
                      disabled={isCreatingUser}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isCreatingUser}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {formErrors.password && (
                    <div className="invalid-feedback d-block">{formErrors.password}</div>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <i className="bi bi-lock-fill"></i> Confirmar Contraseña
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="Repite la contraseña"
                      value={formData.confirmPassword}
                      onChange={handleFormChange}
                      disabled={isCreatingUser}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isCreatingUser}
                    >
                      <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <div className="invalid-feedback d-block">{formErrors.confirmPassword}</div>
                  )}
                </div>

                {/* Botón Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isCreatingUser}
                >
                  {isCreatingUser ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle"></i> Crear Usuario
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;
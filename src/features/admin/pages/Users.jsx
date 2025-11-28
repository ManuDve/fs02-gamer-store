import { useState, useEffect } from 'react';
import { userService } from '../../../shared/services/userService';
import { authorityService } from '../../../shared/services/authorityService';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Cargar usuarios
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
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
              phone: user.phone || '',
              role: isAdmin ? 'admin' : 'user',
              registerDate: user.createdAt || new Date().toISOString(),
              authorities: authorities
            };
          } catch (error) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone || '',
              role: 'user',
              registerDate: user.createdAt || new Date().toISOString(),
              authorities: []
            };
          }
        })
      );
      
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const newUser = await userService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });

      // Asignar el rol según la selección (solo UN rol)
      const roleToAssign = formData.role === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER';
      
      await authorityService.create({
        userId: newUser.id,
        authority: roleToAssign
      });

      alert('Usuario creado exitosamente');
      closeModal();
      loadUsers();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Error desconocido';
      alert('Error al guardar usuario: ' + errorMessage);
    }
  };

  const openModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: 'user'
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleToggleAdmin = async (user) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isChangingSelf = user.id === currentUser.id;
    
    const newRole = user.role === 'admin' ? 'ROLE_USER' : 'ROLE_ADMIN';
    const action = user.role === 'admin' ? 'quitar permisos de administrador' : 'promover a administrador';
    
    let confirmMessage = `¿Estás seguro de ${action} a ${user.name}?`;
    if (isChangingSelf && user.role === 'admin') {
      confirmMessage += '\n\n⚠️ Perderás acceso al panel de administración.';
    }
    
    if (window.confirm(confirmMessage)) {
      try {
        await authorityService.updateUserRole(user.id, newRole);
        
        // Si te quitaste permisos, el ProtectedRoute te redirigirá automáticamente
        if (isChangingSelf && user.role === 'admin') {
          alert('Permisos removidos. Serás redirigido...');
          // Forzar recarga para que ProtectedRoute verifique
          window.location.reload();
          return;
        }
        
        alert(user.role === 'admin' 
          ? 'Permisos de administrador removidos exitosamente'
          : 'Usuario promovido a administrador exitosamente');
        
        loadUsers();
        
      } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${userName}?`)) {
      try {
        await userService.deleteUser(userId);
        alert('Usuario eliminado exitosamente');
        loadUsers();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar usuario: ' + error.message);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const regularUsers = users.filter(u => u.role === 'user').length;

  if (loading) {
    return (
      <div className="admin-users-container">
        <div className="loading-state">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <div className="users-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p className="text-muted">Administra los usuarios del sistema</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          <i className="bi bi-person-plus-fill"></i> Agregar Usuario
        </button>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-icon bg-primary">
            <i className="bi bi-people"></i>
          </div>
          <div className="stat-info">
            <h3>Total Usuarios</h3>
            <p className="stat-value">{totalUsers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-success">
            <i className="bi bi-person-badge"></i>
          </div>
          <div className="stat-info">
            <h3>Usuarios Regulares</h3>
            <p className="stat-value">{regularUsers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-warning">
            <i className="bi bi-shield-check"></i>
          </div>
          <div className="stat-info">
            <h3>Administradores</h3>
            <p className="stat-value">{adminUsers}</p>
          </div>
        </div>
      </div>

      <div className="users-filters">
        <div className="filter-group">
          <label htmlFor="search">
            <i className="bi bi-search"></i> Buscar
          </label>
          <input
            type="text"
            id="search"
            className="form-control"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="role">
            <i className="bi bi-funnel"></i> Rol
          </label>
          <select
            id="role"
            className="form-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Todos los roles</option>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <div className="user-info">
                      <i className="bi bi-person-circle"></i>
                      <strong>{user.name}</strong>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role === 'admin' ? (
                        <>
                          <i className="bi bi-shield-check"></i> Administrador
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person"></i> Usuario
                        </>
                      )}
                    </span>
                  </td>
                  <td>{new Date(user.registerDate).toLocaleDateString('es-CL')}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className={`btn-icon ${user.role === 'admin' ? 'btn-demote' : 'btn-promote'}`}
                        onClick={() => handleToggleAdmin(user)}
                        title={user.role === 'admin' ? 'Quitar permisos de admin' : 'Promover a admin'}
                      >
                        {user.role === 'admin' ? (
                          <i className="bi bi-shield-slash"></i>
                        ) : (
                          <i className="bi bi-shield-fill-check"></i>
                        )}
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(user.id, user.name)}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  <div className="empty-state">
                    <i className="bi bi-inbox"></i>
                    <p>No se encontraron usuarios</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content-wrapper">
            <div className="modal-header">
              <h2>
                <i className="bi bi-person-plus-fill"></i> Agregar Usuario
              </h2>
              <button className="modal-close" onClick={closeModal} type="button">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nombre Completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@ejemplo.com"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Rol *</label>
                  <select
                    id="role"
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Contraseña *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-person-plus-fill"></i> Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
import api from './api';

export const authService = {
  //Iniciar sesión
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          email: response.email,
          name: response.name,
          roles: response.roles
        }));
        localStorage.setItem('roles', JSON.stringify(response.roles));
      }
      
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Credenciales inválidas'
      };
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Verificar si el usuario es administrador
  isAdmin: () => {
    const rolesStr = localStorage.getItem('roles');
    if (!rolesStr) return false;
    try {
      const roles = JSON.parse(rolesStr);
      return roles.includes('ROLE_ADMIN');
    } catch {
      return false;
    }
  },

  // Verificar si el usuario tiene un rol específico
  hasRole: (role) => {
    const rolesStr = localStorage.getItem('roles');
    if (!rolesStr) return false;
    try {
      const roles = JSON.parse(rolesStr);
      return roles.includes(role);
    } catch {
      return false;
    }
  },

  // Obtener roles del usuario
  getRoles: () => {
    const rolesStr = localStorage.getItem('roles');
    return rolesStr ? JSON.parse(rolesStr) : [];
  }
};
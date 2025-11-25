import { createContext, useState, useEffect } from "react";
import { authService } from "../../shared/services/authService";
import { userService } from "../../shared/services/userService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay una sesión activa al cargar
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      const userData = {
        email: response.email,
        name: response.name,
        roles: response.roles
      };
      
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Credenciales inválidas'
      };
    }
  };

  // Registrar nuevo usuario
  const register = async (userData) => {
    try {
      // 1. Registrar usuario en el backend
      await userService.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || ''
      });

      // 2. Login automático después del registro exitoso
      return await login(userData.email, userData.password);
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error al registrar usuario' 
      };
    }
  };

  // Cerrar sesión
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Verificar si el usuario es administrador
  const isAdmin = () => {
    return authService.isAdmin();
  };

  // Verificar si hay una sesión activa
  const isAuthenticated = () => {
    return user !== null && authService.isAuthenticated();
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return authService.hasRole(role);
  };

  // Obtener los roles del usuario actual
  const getUserRoles = () => {
    return authService.getRoles();
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAdmin,
    isAuthenticated,
    hasRole,
    getUserRoles,
    loading
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
import { createContext, useState, useEffect } from "react";
import { authService } from "../../shared/services/authService";

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

  /**
   * Iniciar sesión
   */
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

  // Registrar nuevo usuario (TEMPORAL - sin backend / TODO: Implementar con userService cuando esté disponible)
  const register = (userData) => {
    // ⚠️ VERSIÓN TEMPORAL: Usa localStorage
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Verificar si el email ya existe
    const emailExists = users.some(u => u.email === userData.email);
    if (emailExists) {
      return { success: false, error: 'El email ya está registrado' };
    }

    // Guardar nuevo usuario
    const newUser = {
      ...userData,
      roles: ['ROLE_USER'],
      registerDate: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    // Auto-login después del registro
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);

    return { success: true, user: userWithoutPassword };
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
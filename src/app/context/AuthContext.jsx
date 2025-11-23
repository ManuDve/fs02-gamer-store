import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

// Usuario admin predefinido
const ADMIN_USER = {
  email: 'admin@levelupgamer.cl',
  password: 'admin123',
  name: 'Administrador',
  role: 'admin'
};

// Función para obtener usuarios del localStorage
const getStoredUsers = () => {
  const users = localStorage.getItem('registeredUsers');
  return users ? JSON.parse(users) : [ADMIN_USER];
};

// Función para guardar usuarios en localStorage
const saveUsers = (users) => {
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};

export function AuthProvider({ children }) {
  // Inicializar con el usuario guardado en localStorage si existe
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Guardar el usuario actual en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  // Inicializar usuarios registrados con el admin si no existen
  useEffect(() => {
    const users = getStoredUsers();
    if (users.length === 0) {
      saveUsers([ADMIN_USER]);
    }
  }, []);

  const login = (email, password) => {
    const users = getStoredUsers();
    const foundUser = users.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      // No guardar la contraseña en el estado del usuario
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: 'Email o contraseña incorrectos' };
  };

  const register = (userData) => {
    const users = getStoredUsers();
    
    // Verificar si el email ya existe
    const emailExists = users.some(u => u.email === userData.email);
    if (emailExists) {
      return { success: false, error: 'El email ya está registrado' };
    }

    // Crear nuevo usuario (siempre como usuario normal)
    const newUser = {
      ...userData,
      role: 'user',
      registerDate: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Iniciar sesión automáticamente
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);

    return { success: true, user: userWithoutPassword };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register,
      isAdmin,
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

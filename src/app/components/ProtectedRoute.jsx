import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, isAuthenticated } = useContext(AuthContext);

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere admin y el usuario no es admin, redirigir a home
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, mostrar el contenido
  return children;
};

export default ProtectedRoute;

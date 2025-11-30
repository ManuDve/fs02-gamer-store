import { Outlet, Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./AdminLayout.css";

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h4><i className="bi bi-speedometer2"></i> Admin Panel</h4>
          <div className="admin-user">
            <i className="bi bi-person-circle"></i>
            <span>{user?.name}</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <Link 
            to="/admin/dashboard" 
            className={`nav-link ${isActive('/admin/dashboard')}`}
          >
            <i className="bi bi-grid-fill"></i>
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/admin/products" 
            className={`nav-link ${isActive('/admin/products')}`}
          >
            <i className="bi bi-box-seam"></i>
            <span>Productos</span>
          </Link>
          <Link 
            to="/admin/users" 
            className={`nav-link ${isActive('/admin/users')}`}
          >
            <i className="bi bi-people-fill"></i>
            <span>Usuarios</span>
          </Link>
          <Link 
            to="/admin/orders" 
            className={`nav-link ${isActive('/admin/orders')}`}
          >
            <i className="bi bi-cart-check-fill"></i>
            <span>Órdenes</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="nav-link">
            <i className="bi bi-house"></i>
            <span>Volver a la Tienda</span>
          </Link>
          <button onClick={logout} className="nav-link logout-btn">
            <i className="bi bi-box-arrow-right"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
      
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
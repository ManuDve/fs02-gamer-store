import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../app/context/AuthContext";
import { useCartState } from "../../app/context/CartContext";
import logo from "../../assets/img/logo.jpeg";
import cartIcon from "../../assets/img/cart.svg";

export default function Navbar() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const cartState = useCartState();
  const location = useLocation();
  
  const cartCount = cartState.items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav id="nav" className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img id="logo-nav" src={logo} alt="LevelUp Gamer Logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav d-flex">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive("/") ? "active" : ""}`} 
                aria-current={isActive("/") ? "page" : undefined}
                to="/"
              >
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive("/products") ? "active" : ""}`}
                aria-current={isActive("/products") ? "page" : undefined}
                to="/products"
              >
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive("/blog") ? "active" : ""}`}
                aria-current={isActive("/blog") ? "page" : undefined}
                to="/blog"
              >
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive("/contact") ? "active" : ""}`}
                aria-current={isActive("/contact") ? "page" : undefined}
                to="/contact"
              >
                Contacto
              </Link>
            </li>
            {!user && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/login") ? "active" : ""}`}
                  aria-current={isActive("/login") ? "page" : undefined}
                  to="/login"
                >
                  Login
                </Link>
              </li>
            )}
            {isAdmin() && (
              <li className="nav-item ms-lg-auto">
                <Link 
                  className={`nav-link ${isActive("/admin/dashboard") ? "active" : ""}`}
                  aria-current={isActive("/admin/dashboard") ? "page" : undefined}
                  to="/admin/dashboard"
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>
          <div id="shopping-cart-container" className="px-lg-3">
            <Link to="/cart" className="d-flex gap-1 align-items-center">
              <img src={cartIcon} alt="icono de carro de compras" />
              <div>
                Carro&nbsp;({cartCount})
              </div>
            </Link>
          </div>
          <div>
            {user && (
              <div className="dropdown d-inline">
                <button className="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text">
                    <small className="text-muted">{user.email}</small>
                  </span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>
                    Cerrar Sesión
                  </button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

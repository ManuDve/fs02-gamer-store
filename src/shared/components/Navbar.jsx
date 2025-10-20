import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../app/context/AuthContext";
import { useCartState } from "../../app/context/CartContext";
import logo from "../../assets/img/logo.jpeg";
import cartIcon from "../../assets/img/cart.svg";

export default function Navbar() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const cartState = useCartState();
  
  const cartCount = cartState.items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
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
              <Link className="nav-link active" aria-current="page" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blog">Blog</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contacto</Link>
            </li>
            {!user && (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            )}
            {isAdmin() && (
              <li className="nav-item ms-lg-auto">
                <Link className="nav-link" to="/admin/dashboard">Admin</Link>
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

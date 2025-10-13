import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container py-5 text-center">
      <h1>Bienvenido a Gamer Store</h1>
      <p className="lead">Tu tienda online de artículos gamer</p>
      <Link to="/products" className="btn btn-primary">Ver productos</Link>
    </div>
  );
}

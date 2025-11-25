import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Product from "../components/Product";
import './Home.css'
import Logo from "../components/Logo";
import { productService } from "../../../shared/services/productService";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container home">
      <div className="row p-5">
        <div className="col-12 col-md-8 order-2 order-md-1">
          <h1 className="home-heading mb-3">¿Quiénes somos?</h1>
          <p className="home-lead">Level-Up Gamer es una tienda online dedicada a satisfacer las necesidades de los entusiastas de los videojuegos en Chile. Desde consolas y accesorios, hasta computadores y sillas especializadas.
            <br />
            <br />
            En Level-Up Gamer somos apasionados por los videojuegos y nos esforzamos por brindar la mejor experiencia de compra a nuestros clientes.</p>
          <div>
            <Link to="/products" className="btn btn-primary">Conoce nuestros productos</Link>
          </div>
        </div>
        <div className="col-12 col-md-4 mb-3 order-1 order-md-2">
          <Logo />
        </div>
      </div>
      <div className='home-products p-5'>
        <h2 className="home-heading mb-5">Productos destacados</h2>
        {loading ? (
          <div className='text-center py-5'>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando productos...</span>
            </div>
          </div>
        ) : error ? (
          <div className='alert alert-danger' role="alert">
            <p>Error al cargar productos: {error}</p>
            <button className="btn btn-primary btn-sm" onClick={loadProducts}>
              Reintentar
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {products.slice(0, 4).map(product => (
              <div key={product.id} className="col-12 col-md-6 col-lg-3">
                <Product id={product.id} img={product.img} name={product.name} price={product.price} stock={product.stock} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>

  );
}
export default Home
import { Link } from "react-router-dom";
import Product from "../components/Product";
import './Home.css'
import Logo from "../components/Logo";

const Home = ({ products }) => {
  return (
    <main className="container home">
      <div className="row p-5">
        <div className="col-12 col-md-8">
          <h1 className="home-heading mb-3">¿Quiénes somos?</h1>
          <p className="home-lead">Level-Up Gamer es una tienda online dedicada a satisfacer las necesidades de los entusiastas de los videojuegos en Chile. Desde consolas y accesorios, hasta computadores y sillas especializadas.
            <br />
            <br />
            En Level-Up Gamer somos apasionados por los videojuegos y nos esforzamos por brindar la mejor experiencia de compra a nuestros clientes.</p>
          <div>
            <Link to="/products" className="btn btn-primary">Conoce nuestros productos</Link>
          </div>
        </div>
        <div className="col-12 col-md-4 mb-3">
          <Logo />
        </div>
      </div>
      <div className='home-products row p-5'>
        <h2 className="home-heading">Productos destacados</h2>
        <ul>
          {products.slice(0, 4).map(product => (
            <Product key={product.id} id={product.id} img={product.img} name={product.name} price={product.price} />
          ))}
        </ul>
      </div>
    </main>

  );
}
export default Home
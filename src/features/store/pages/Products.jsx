import Product from '../components/Product';
import './Products.css'

const Products = ({ products }) => {

  const juegosDeMesa = products.filter(product => product.category === "Juego de Mesa");
  const perifericosGamer = products.filter(product => product.category === "Periférico Gamer");
  const consolas = products.filter(product => product.category === "Consola");

  return (
    <div className='container'>
      <h1 className='products-heading-h1'>Nuestros productos</h1>
      <h2 className='products-heading-h2'>Juegos de Mesa</h2>
      <div className='products'>
        <ul>
          {juegosDeMesa.map(product => (
            <Product key={product.id} img={product.img} name={product.name} price={product.price} />
          ))}
        </ul>
      </div>

      <h2 className='products-heading-h2'>Periféricos Gamer</h2>
      <div className='products'>
        <ul>
          {perifericosGamer.map(product => (
            <Product key={product.id} img={product.img} name={product.name} price={product.price} />
          ))}
        </ul>
      </div>
      <h2 className='products-heading-h2'>Consolas</h2>
      <div className='products'>
        <ul>
          {consolas.map(product => (
            <Product key={product.id} img={product.img} name={product.name} price={product.price} />
          ))}
        </ul>
      </div>


    </div>
  )
}
export default Products;

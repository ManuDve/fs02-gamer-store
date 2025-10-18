import Banner from '../components/Banner';
import Product from '../components/Product';
import Filters from '../components/Filters';
import './Products.css';
import { useState } from 'react';

function useFilters() {
  const [filters, setFilters] = useState({
    category: 'all'
  })

  const filterProducts = (products) => {
    return products.filter(product => {
      return (
        filters.category === 'all' || product.category === filters.category
      )
    })
  }

  return {filterProducts, setFilters}
}

const Products = ({ products }) => {

  const {filterProducts, setFilters} = useFilters()
  const filteredProducts = filterProducts(products)
  const juegosDeMesa = filteredProducts.filter(product => product.category === "Juego de Mesa");
  const perifericosGamer = filteredProducts.filter(product => product.category === "Periférico Gamer");
  const consolas = filteredProducts.filter(product => product.category === "Consola");

  return (
    <div className='container'>
      <h1 className='products-heading-h1'>Nuestros productos</h1>
      <Filters onChange={setFilters} />
      <Banner img='src/assets/img/juegos-de-mesa-banner.png' alt="juegos de mesa" />
      <h2 className='products-heading-h2'>Juegos de Mesa</h2>
      <div className='products'>
        <ul>
          {juegosDeMesa.map(product => (
            <Product key={product.id} img={product.img} name={product.name} price={product.price} />
          ))}
        </ul>
      </div>

      <Banner img='src/assets/img/perifericos-banner.png' alt="periféricos gamer" />
      <h2 className='products-heading-h2'>Periféricos Gamer</h2>
      <div className='products'>
        <ul>
          {perifericosGamer.map(product => (
            <Product key={product.id} img={product.img} name={product.name} price={product.price} />
          ))}
        </ul>
      </div>

      <Banner img='src/assets/img/consolas-banner.png' alt="consolas" />
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

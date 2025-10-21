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

  return {filterProducts, setFilters, filters}
}

const Products = ({ products }) => {

  const {filterProducts, setFilters, filters} = useFilters()
  const filteredProducts = filterProducts(products)
  const juegosDeMesa = filteredProducts.filter(product => product.category === "Juego de Mesa");
  const perifericosGamer = filteredProducts.filter(product => product.category === "Periférico Gamer");
  const consolas = filteredProducts.filter(product => product.category === "Consola");

  return (
    <div className='container'>
      <h1 className='products-heading-h1'>Nuestros productos</h1>
      <Filters onChange={setFilters} />
      {(filters.category === 'all' || filters.category === 'Juego de Mesa') && 
        <>
          <Banner img='src/assets/img/juegos-de-mesa-banner.png' alt="juegos de mesa" />
          <h2 className='products-heading-h2 mt-5 mb-4'>Juegos de Mesa</h2>
        </>
      }
      
      <div className='row g-4 justify-content-center mb-5'>
        {juegosDeMesa.map(product => (
          <div key={product.id} className="col-12 col-md-6 col-lg-3">
            <Product id={product.id} img={product.img} name={product.name} price={product.price} />
          </div>
        ))}
      </div>

      {(filters.category === 'all' || filters.category === 'Periférico Gamer') && 
        <>
          <Banner img='src/assets/img/perifericos-banner.png' alt="periféricos gamer" />
          <h2 className='products-heading-h2 mt-5 mb-4'>Periféricos Gamer</h2>
        </>
      }
      <div className='row g-4 justify-content-center mb-5'>
        {perifericosGamer.map(product => (
          <div key={product.id} className="col-12 col-md-6 col-lg-3">
            <Product id={product.id} img={product.img} name={product.name} price={product.price} />
          </div>
        ))}
      </div>

      {(filters.category === 'all' || filters.category === 'Consola') && 
        <>
          <Banner img='src/assets/img/consolas-banner.png' alt="consolas" />
          <h2 className='products-heading-h2 mt-5 mb-4'>Consolas</h2>
        </>
      }
      <div className='row g-4 justify-content-center mb-5'>
        {consolas.map(product => (
          <div key={product.id} className="col-12 col-md-6 col-lg-3">
            <Product id={product.id} img={product.img} name={product.name} price={product.price} />
          </div>
        ))}
      </div>


    </div>
  )
}
export default Products;

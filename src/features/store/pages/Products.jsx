import Banner from '../components/Banner';
import Product from '../components/Product';
import Filters from '../components/Filters';
import './Products.css';
import { useState, useEffect } from 'react';
import { productService } from '../../../shared/services/productService';

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

  return { filterProducts, setFilters, filters }
}

const Products = () => {
  // Estado para manejar los productos, carga y errores
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { filterProducts, setFilters, filters } = useFilters()

  // Cargar productos al montar el componente
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

  if (loading) {
    return (
      <div className='container text-center py-5'>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </div>
        <p className='mt-3'>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container text-center py-5'>
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error al cargar productos</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadProducts}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
          <div className='row g-4 justify-content-center mb-5'>
            {juegosDeMesa.length > 0 ? (
              juegosDeMesa.map(product => (
                <div key={product.id} className="col-12 col-md-6 col-lg-3">
                  <Product id={product.id} img={product.img} name={product.name} price={product.price} stock={product.stock} />
                </div>
              ))
            ) : (
              <p className='text-center text-muted'>No hay juegos de mesa disponibles</p>
            )}
          </div>
        </>
      } 

      {(filters.category === 'all' || filters.category === 'Periférico Gamer') && 
        <>
          <Banner img='src/assets/img/perifericos-banner.png' alt="periféricos gamer" />
          <h2 className='products-heading-h2 mt-5 mb-4'>Periféricos Gamer</h2>
          <div className='row g-4 justify-content-center mb-5'>
            {perifericosGamer.length > 0 ? (
              perifericosGamer.map(product => (
                <div key={product.id} className="col-12 col-md-6 col-lg-3">
                  <Product id={product.id} img={product.img} name={product.name} price={product.price} stock={product.stock} />
                </div>
              ))
            ) : (
              <p className='text-center text-muted'>No hay periféricos disponibles</p>
            )}
          </div>
        </>
      }    

      {(filters.category === 'all' || filters.category === 'Consola') && 
        <>
          <Banner img='src/assets/img/consolas-banner.png' alt="consolas" />
          <h2 className='products-heading-h2 mt-5 mb-4'>Consolas</h2>
          <div className='row g-4 justify-content-center mb-5'>
            {consolas.length > 0 ? (
              consolas.map(product => (
                <div key={product.id} className="col-12 col-md-6 col-lg-3">
                  <Product id={product.id} img={product.img} name={product.name} price={product.price} stock={product.stock} />
                </div>
              ))
            ) : (
              <p className='text-center text-muted'>No hay consolas disponibles</p>
            )}
          </div>
        </>
      }

    </div>
  )
}
export default Products;

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { filterProducts, setFilters, filters } = useFilters()

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

  const filteredProducts = filterProducts(products);
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className='container'>
      <h1 className='products-heading-h1'>Nuestros productos</h1>
      <Filters onChange={setFilters} />

      {filteredProducts.length === 0 ? (
        <div className='text-center py-5'>
          <p className='text-muted'>No hay productos disponibles en esta categoría</p>
        </div>
      ) : (
        categories.map(category => {
          const categoryProducts = filteredProducts.filter(p => p.category === category);
          
          if (filters.category !== 'all' && filters.category !== category) {
            return null;
          }

          if (categoryProducts.length === 0) {
            return null;
          }

          return (
            <div key={category}>
              <h2 className='products-heading-h2 mt-5 mb-4'>{category}</h2>
              <div className='row g-4 justify-content-center mb-5'>
                {categoryProducts.map(product => (
                  <div key={product.id} className="col-12 col-md-6 col-lg-3">
                    <Product 
                      id={product.id} 
                      img={product.img} 
                      name={product.name} 
                      price={product.price} 
                      stock={product.stock} 
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  )
}

export default Products;
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productService } from '../../../shared/services/productService';
import './ProductDetail.css';
import { useCartDispatch, addToCart } from '../../../app/context/CartContext';
import { formatPrice } from '../utils/formatPrice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useCartDispatch();

  // Estados para manejar el producto, carga y errores
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar producto al montar el componente o cuando cambia el ID
  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getById(id);
      setProduct(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar producto:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <main className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando producto...</span>
        </div>
        <p className='mt-3'>Cargando producto...</p>
      </main>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <main className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error al cargar el producto</h4>
          <p>{error}</p>
          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={loadProduct}>
              Reintentar
            </button>
            <Link to="/products" className="btn btn-secondary">
              Volver al listado
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Producto no encontrado
  if (!product) {
    return (
      <main className="container py-5 text-center">
        <div className="alert alert-warning" role="alert">
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe.</p>
          <Link to="/products" className="btn btn-secondary mt-3">
            Volver al listado
          </Link>
        </div>
      </main>
    );
  }

  // Preparar datos del producto
  const productData = {
    id: product.id,
    name: product.name,
    price: product.price,
    img: product.img,
    description: product.description || '',
    review: product.review || '',
    characteristics: product.characteristics || {},
    category: product.category,
    stock: product.stock,
  };

  return (
    <main className="container py-5 product-detail">
      <div className="row">
        <div className="col-md-6">
          <img 
            src={productData.img} 
            alt={productData.name} 
            className="img-fluid rounded"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x400?text=Imagen+no+disponible';
            }}
          />
        </div>
        <div className="col-md-6">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Inicio</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/products">Productos</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {productData.name}
              </li>
            </ol>
          </nav>

          <span className="badge bg-secondary mb-2">{productData.category}</span>
          <h1>{productData.name}</h1>
          <p className="h4 text-primary mb-3">{formatPrice(productData.price)}</p>
          
          <div className="mb-3">
            {productData.stock > 0 ? (
              <span className="badge bg-success">
                ✓ Stock disponible: {productData.stock} unidades
              </span>
            ) : (
              <span className="badge bg-danger">
                Sin stock
              </span>
            )}
          </div>
          
          {productData.description && (
            <div className="mb-3">
              <h5>Descripción</h5>
              <p>{productData.description}</p>
            </div>
          )}

          {productData.review && (
            <div className="mb-3">
              <h5>Reseña</h5>
              <p className="text-muted fst-italic">{productData.review}</p>
            </div>
          )}

          {Object.keys(productData.characteristics).length > 0 && (
            <div className="mt-3">
              <h5>Características Técnicas</h5>
              <ul className="list-unstyled">
                {Object.entries(productData.characteristics).map(([key, value]) => (
                  value && (
                    <li key={key} className="mb-2">
                      <strong className="text-capitalize">{key.replace(/_/g, ' ')}:</strong> {value}
                    </li>
                  )
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 d-flex gap-2">
            <Link to="/products" className="btn btn-outline-secondary">
              Volver
            </Link>
            <button
              className="btn btn-primary"
              onClick={() => addToCart(
                dispatch, 
                { 
                  id: productData.id, 
                  name: productData.name, 
                  price: productData.price, 
                  img: productData.img 
                }, 
                1
              )}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;
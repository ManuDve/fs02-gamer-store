import { useParams, Link } from 'react-router-dom';
import productsData from '../../../assets/mocks/products.json';
import './ProductDetail.css';
import { useCartDispatch, addToCart } from '../../../app/context/CartContext';
import { formatPrice } from '../utils/formatPrice';

const ProductDetail = () => {
  const { id } = useParams();

  const rawProducts = productsData && productsData.products ? productsData.products : [];
  const rawProduct = rawProducts.find(p => p.id === id);
  const dispatch = useCartDispatch();

  if (!rawProduct) {
    return (
      <main className="container py-5">
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no existe.</p>
        <Link to="/products" className="btn btn-secondary">Volver al listado</Link>
      </main>
    );
  }

  const product = {
    id: rawProduct.id,
    name: rawProduct.name,
    price: rawProduct.price,
    img: rawProduct.img,
    description: rawProduct.descripcion || rawProduct.reseña || '',
    characteristics: rawProduct.caracteristics || {},
    category: rawProduct.category,
  };

  return (
    <main className="container py-5 product-detail">
      <div className="row">
        <div className="col-md-6">
          <img src={product.img} alt={product.name} className="img-fluid rounded" />
        </div>
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <p className="h4 text-primary">{formatPrice(product.price)}</p>
          <p>{product.description}</p>

          {Object.keys(product.characteristics).length > 0 && (
            <div className="mt-3">
              <h5>Características</h5>
              <ul>
                {Object.entries(product.characteristics).map(([k, v]) => (
                  <li key={k}><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <Link to="/products" className="btn btn-outline-secondary me-2">Volver</Link>
            <button
              className="btn btn-primary"
              onClick={() => addToCart(dispatch, { id: product.id, name: product.name, price: product.price, img: product.img }, 1)}
            >Agregar al carro</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;

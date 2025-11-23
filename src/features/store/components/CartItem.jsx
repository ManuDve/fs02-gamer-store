import { useCartDispatch, removeFromCart, updateQuantity } from '../../../app/context/CartContext';
import { formatPrice } from '../utils/formatPrice';

export default function CartItem({ item }) {
  const dispatch = useCartDispatch();
  
  const itemTotal = (item.price * item.quantity).toFixed(2);

  const handleIncrement = () => {
    updateQuantity(dispatch, item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(dispatch, item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(dispatch, item.id);
  };

  return (
    <div className="row cart-item">
      <div className="col-12 col-md-3">
        <img src={item.img} alt={item.name} className="img-fluid" />
      </div>
      <div className="col-12 col-md-4 py-3">
        <h5><strong>{item.name}</strong></h5>
        <p>{item.description || 'Producto de calidad'}</p>
        <p>Precio Unitario: {formatPrice(item.price)}</p>
      </div>
      <div className="col-12 col-md-5 d-flex align-items-center justify-content-start justify-content-md-end">
        <p className="mb-0 me-3 text-center">Total: {formatPrice(itemTotal)}</p>
        <div className="input-group" style={{ width: '150px' }}>
          <button 
            className="btn btn-outline-secondary" 
            type="button"
            onClick={handleDecrement}
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <input 
            type="number" 
            className="form-control text-center" 
            value={item.quantity}
            readOnly
            min="1"
          />
          <button 
            className="btn btn-outline-secondary" 
            type="button"
            onClick={handleIncrement}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
        <button 
          className="btn btn-sm btn-danger ms-3" 
          onClick={handleRemove}
          aria-label="Eliminar producto"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

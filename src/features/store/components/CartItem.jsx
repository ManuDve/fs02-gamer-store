import { useCartDispatch, removeFromCart, updateQuantity } from '../../../app/context/CartContext';
import { formatPrice } from '../utils/formatPrice';

export default function CartItem({ item, availableStock }) {
  const dispatch = useCartDispatch();
  
  const itemTotal = (item.price * item.quantity).toFixed(2);
  const isOutOfStock = availableStock === 0;
  const exceedsStock = item.quantity > availableStock;

  const handleIncrement = () => {
    if (item.quantity < availableStock) {
      updateQuantity(dispatch, item.id, item.quantity + 1);
    }
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
        <div className="mb-2">
          {isOutOfStock ? (
            <small className="badge bg-danger">Sin stock</small>
          ) : exceedsStock ? (
            <small className="badge bg-warning text-dark">
              Stock disponible: {availableStock} (ajusta la cantidad)
            </small>
          ) : (
            <small className="text-success">
              <strong>Stock disponible: {availableStock}</strong>
            </small>
          )}
        </div>
      </div>
      <div className="col-12 col-md-5 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-start justify-content-md-end gap-2">
        <p className="mb-0 text-nowrap">Total: {formatPrice(itemTotal)}</p>
        <div className="d-flex gap-2 flex-wrap flex-md-nowrap align-items-center">
          <div className="input-group" style={{ width: '140px', minWidth: '140px' }}>
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
              style={{ minWidth: '60px' }}
            />
            <button 
              className="btn btn-outline-secondary" 
              type="button"
              onClick={handleIncrement}
              disabled={item.quantity >= availableStock || isOutOfStock}
              aria-label="Aumentar cantidad"
              title={item.quantity >= availableStock ? 'Stock máximo alcanzado' : ''}
            >
              +
            </button>
          </div>
          <button 
            className="btn btn-sm btn-danger" 
            onClick={handleRemove}
            aria-label="Eliminar producto"
            style={{ whiteSpace: 'nowrap' }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

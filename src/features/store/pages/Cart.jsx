import { useNavigate } from 'react-router-dom';
import { useCartState, useCartDispatch, removeFromCart, updateQuantity, clearCart } from '../../../app/context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { items } = useCartState();
  const dispatch = useCartDispatch();

  const total = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0).toFixed(2);

  if (!items || items.length === 0) {
    return (
      <main className="container py-5">
        <h2>Carrito</h2>
        <p>Tu carrito está vacío.</p>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <h2>Carrito</h2>
      <ul className="list-unstyled">
        {items.map(it => (
          <li key={it.id} className="d-flex align-items-center mb-3">
            <img src={it.img} alt={it.name} style={{ width: 80, height: 80, objectFit: 'cover' }} />
            <div className="ms-3 flex-grow-1">
              <strong>{it.name}</strong>
              <div>$ {it.price} x {it.quantity}</div>
              <div className="mt-2">
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => updateQuantity(dispatch, it.id, Math.max(1, it.quantity - 1))}>-</button>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => updateQuantity(dispatch, it.id, it.quantity + 1)}>+</button>
                <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(dispatch, it.id)}>Eliminar</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <h4>Total: $ {total}</h4>
        <div className="mt-3">
          <button className="btn btn-secondary me-2" onClick={() => clearCart(dispatch)}>Vaciar carrito</button>
          <button className="btn btn-primary" onClick={() => navigate('/pay')}>Ir a pagar</button>
        </div>
      </div>
    </main>
  )
}
export default Cart;

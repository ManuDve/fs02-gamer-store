import { useCartState } from '../../../app/context/CartContext';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';

const Cart = () => {
  const { items } = useCartState();

  const total = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0).toFixed(2);

  if (!items || items.length === 0) {
    return (
      <div className="container p-5">
        <div className="row">
          <h1>Carro de Compras</h1>
          <div className="col-12">
            <p className="mt-4">Tu carrito está vacío.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-3">
      <div className="row">
        <h1>Carro de Compras</h1>
        <div className="col-12 col-md-8 p-3">
          <div className="container">
            {items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>
        <CartSummary total={total} itemsCount={items.length} />
      </div>
    </div>
  );
}

export default Cart;


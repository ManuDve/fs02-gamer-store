import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartDispatch, clearCart } from '../../../app/context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import paymentImage from '../../../assets/img/payment.png';

export default function CartSummary({ total, itemsCount }) {
  const navigate = useNavigate();
  const dispatch = useCartDispatch();
  const [couponCode, setCouponCode] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('');

  const handleApplyCoupon = () => {
    // TODO: Implementar lógica de cupón
    console.log('Cupón aplicado:', couponCode);
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      alert('Por favor selecciona un método de pago');
      return;
    }
    navigate('/pay');
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      clearCart(dispatch);
    }
  };

  return (
    <div className="col-12 col-md-4 p-3">
      <div className="d-flex cart-divider">
        <h4>Total:</h4>
        <h4 className="ms-auto">{formatPrice(total)}</h4>
      </div>
      
      <div className="cart-divider">
        <p>Ingrese cupón de descuento:</p>
        <div className="input-group mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Cupón de descuento"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            aria-label="Cupón de descuento"
          />
          <button 
            className="btn btn-outline-secondary" 
            type="button"
            onClick={handleApplyCoupon}
            aria-label="Aplicar cupón"
          >
            Aplicar
          </button>
        </div>
      </div>

      <div className="cart-divider">
        <select 
          className="form-select mb-3" 
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          aria-label="Método de pago"
        >
          <option value="">Seleccione método de pago</option>
          <option value="credit_card">Tarjeta de Crédito</option>
          <option value="debit_card">Tarjeta de Débito</option>
          <option value="paypal">PayPal</option>
          <option value="transfer">Transferencia Bancaria</option>
        </select>
        <button 
          className="btn btn-primary w-100 mb-3"
          onClick={handlePayment}
          disabled={itemsCount === 0}
          aria-label="Proceder al pago"
        >
          Pagar
        </button>
        <button 
          className="btn btn-outline-secondary w-100 mb-3"
          onClick={handleClearCart}
          aria-label="Vaciar carrito"
        >
          Vaciar carrito
        </button>
        <img src={paymentImage} alt="métodos de pago" className="img-fluid mt-3" />
      </div>
    </div>
  );
}

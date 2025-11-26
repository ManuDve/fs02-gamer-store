import { useCartState } from '../../../app/context/CartContext';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import { useState, useEffect, useRef } from 'react';
import { productService } from '../../../shared/services/productService';

const Cart = () => {
  const { items } = useCartState();
  const [productsStock, setProductsStock] = useState({});
  const [loading, setLoading] = useState(true);
  const isInitialMount = useRef(true);

  // Solo cargar stock al montar el componente
  useEffect(() => {
    loadProductsStock();
  }, []); // Dependencias vacías

  // Actualizar stock solo cuando hay nuevos productos en el carrito
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Verificar si hay productos nuevos que no tienen stock cargado
    const needsUpdate = items.some(item => !(item.id in productsStock));
    if (needsUpdate) {
      loadProductsStock();
    }
  }, [items.length]); // Solo reacciona a cambios en la cantidad de items, no en las cantidades individuales

  const loadProductsStock = async () => {
    try {
      setLoading(true);
      const products = await productService.getAll();
      const stockMap = {};
      products.forEach(product => {
        stockMap[product.id] = product.stock;
      });
      setProductsStock(stockMap);
    } catch (err) {
      console.error('Error al cargar stock:', err);
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0).toFixed(2);

  if (loading && Object.keys(productsStock).length === 0) {
    return (
      <div className="container p-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

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
              <CartItem 
                key={item.id} 
                item={item} 
                availableStock={productsStock[item.id] || 0}
              />
            ))}
          </div>
        </div>
        <CartSummary total={total} itemsCount={items.length} />
      </div>
    </div>
  );
}

export default Cart;
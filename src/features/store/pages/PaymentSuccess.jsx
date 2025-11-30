import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  useEffect(() => {
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // ⬇️ AHORA HACE LO MISMO QUE IMPRIMIR
    window.print();
  };

  const handleBackToStore = () => {
    navigate('/');
  };

  return (
    <div className="payment-success-container">
      <div className="success-content">
        {/* Encabezado de éxito - Solo visible en pantalla */}
        <div className="success-header no-print">
          <div className="success-icon">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <h1>¡Pago Exitoso!</h1>
          <p>Tu pedido ha sido confirmado y procesado correctamente</p>
        </div>

        {/* Boleta */}
        <div className="invoice-wrapper">
          <div className="invoice-header">
            <div className="invoice-company">
              <h1>🎮 LevelUp Gaming Store</h1>
              <p className="company-details">
                <strong>Dirección:</strong> Álvarez 2336, Viña del Mar, Chile<br />
                <strong>Teléfono:</strong> +569 9999 0000<br />
                <strong>Email:</strong> contacto@lupgamer.cl
              </p>
            </div>
            <div className="invoice-number-box">
              <h2>BOLETA DE VENTA</h2>
              <div className="invoice-number">N° {orderData.orderNumber}</div>
              <div className="invoice-date">{formatDate(orderData.timestamp)}</div>
              <div className="invoice-status">
                <span className="status-badge status-completed">
                  <i className="bi bi-check-circle-fill"></i>
                  {orderData.status}
                </span>
              </div>
            </div>
          </div>

          <hr className="invoice-divider" />

          {/* Información del Cliente */}
          <div className="order-info-section">
            <h3>
              <i className="bi bi-person-circle"></i>
              Información del Cliente
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Nombre Completo:</label>
                <span>
                  {orderData.customerInfo.firstName}{' '}
                  {orderData.customerInfo.lastName}
                </span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{orderData.customerInfo.email}</span>
              </div>
              <div className="info-item">
                <label>Teléfono:</label>
                <span>{orderData.customerInfo.phone}</span>
              </div>
            </div>
          </div>

          {/* Dirección de Envío */}
          <div className="order-info-section">
            <h3>
              <i className="bi bi-geo-alt-fill"></i>
              Dirección de Envío
            </h3>
            <div className="info-grid">
              <div className="info-item full-width">
                <label>Dirección:</label>
                <span>{orderData.shippingAddress.address}</span>
              </div>
              <div className="info-item">
                <label>Ciudad:</label>
                <span>{orderData.shippingAddress.city}</span>
              </div>
              <div className="info-item">
                <label>Región:</label>
                <span>{orderData.shippingAddress.state}</span>
              </div>
              <div className="info-item">
                <label>Código Postal:</label>
                <span>{orderData.shippingAddress.zipCode}</span>
              </div>
            </div>
          </div>

          {/* Detalle de Productos */}
          <div className="order-info-section">
            <h3>
              <i className="bi bi-box-seam"></i>
              Detalle de Productos
            </h3>
            <div className="invoice-items-table">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Precio Unit.</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items.map((item, index) => (
                    <tr key={index}>
                      <td><strong>{item.name}</strong></td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">{formatPrice(item.price)}</td>
                      <td className="text-end"><strong>{formatPrice(item.subtotal)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen de Pago */}
          <div className="order-info-section">
            <div className="invoice-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatPrice(orderData.summary.subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Envío:</span>
                <span>{orderData.summary.shipping === 0 ? 'Gratis' : formatPrice(orderData.summary.shipping)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>{formatPrice(orderData.summary.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer con mensaje de agradecimiento */}
          <div className="invoice-footer">
            <p>
              <strong>¡Gracias por tu compra!</strong>
            </p>
            <p className="text-muted">
              Esta boleta es un comprobante de tu pedido. Recibirás un correo de confirmación con el seguimiento de tu envío.
            </p>
          </div>
        </div>

        {/* Botones de acción - Solo visible en pantalla */}
        <div className="action-buttons-container no-print">
          <button 
            className="btn btn-outline-primary"
            onClick={handlePrint}
          >
            <i className="bi bi-printer"></i>
            Imprimir Boleta
          </button>
          <button 
            className="btn btn-outline-success"
            onClick={handleDownloadPDF}
          >
            <i className="bi bi-file-earmark-pdf"></i>
            Descargar PDF
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleBackToStore}
          >
            <i className="bi bi-house-door"></i>
            Volver a la Tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
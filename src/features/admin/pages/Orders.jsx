import React, { useState, useEffect } from 'react';
import orderService from '../../../shared/services/orderService';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      alert('Error al cargar las órdenes');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

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

  const openModal = async (orderNumber) => {
    try {
      const orderDetails = await orderService.getOrderByNumber(orderNumber);
      setSelectedOrder(orderDetails);
      setShowModal(true);
    } catch (error) {
      console.error('Error al cargar detalles de la orden:', error);
      alert('Error al cargar los detalles de la orden');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // ⬇️ AHORA HACE LO MISMO QUE IMPRIMIR
    window.print();
  };

  const filterByDate = (order) => {
    if (dateFilter === 'all') return true;

    const orderDate = new Date(order.timestamp);
    const now = new Date();
    const diffTime = now - orderDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    switch (dateFilter) {
      case 'week':
        return diffDays <= 7;
      case 'month':
        return diffDays <= 30;
      case 'year':
        return diffDays <= 365;
      default:
        return true;
    }
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(search) ||
      order.customerInfo.email.toLowerCase().includes(search) ||
      order.customerInfo.firstName.toLowerCase().includes(search) ||
      order.customerInfo.lastName.toLowerCase().includes(search);
    
    const matchesDate = filterByDate(order);
    
    return matchesSearch && matchesDate;
  }) : [];

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.summary.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  if (loading) {
    return (
      <div className="admin-orders-container">
        <div className="loading-state">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      <div className="orders-header">
        <div>
          <h1>Gestión de Órdenes</h1>
          <p className="text-muted">
            Administra y visualiza todas las órdenes del sistema
          </p>
        </div>
      </div>

      <div className="orders-stats">
        <div className="stat-card">
          <div className="stat-icon bg-primary">
            <i className="bi bi-cart-check-fill"></i>
          </div>
          <div className="stat-info">
            <h3>Total Órdenes</h3>
            <p className="stat-value">{totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-success">
            <i className="bi bi-cash-stack"></i>
          </div>
          <div className="stat-info">
            <h3>Ingresos Totales</h3>
            <p className="stat-value">{formatPrice(totalRevenue)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-warning">
            <i className="bi bi-graph-up-arrow"></i>
          </div>
          <div className="stat-info">
            <h3>Valor Promedio</h3>
            <p className="stat-value">{formatPrice(averageOrderValue)}</p>
          </div>
        </div>
      </div>

      <div className="orders-filters">
        <div className="filter-group">
          <label htmlFor="search">
            <i className="bi bi-search"></i> Buscar
          </label>
          <input
            type="text"
            id="search"
            className="form-control"
            placeholder="Buscar por número, email o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="dateFilter">
            <i className="bi bi-calendar-range"></i> Período
          </label>
          <select
            id="dateFilter"
            className="form-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">Todos los tiempos</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="year">Último año</option>
          </select>
        </div>
      </div>

      <div className="orders-table-container">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-inbox"></i>
            <p>No se encontraron órdenes</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Número de Orden</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Items</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderNumber}>
                  <td>
                    <strong>{order.orderNumber}</strong>
                  </td>
                  <td>
                    <div className="customer-info">
                      <i className="bi bi-person-circle"></i>
                      <div>
                        <div>
                          {order.customerInfo.firstName} {order.customerInfo.lastName}
                        </div>
                        <small>{order.customerInfo.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(order.timestamp)}</td>
                  <td>
                    <span className="items-badge">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </span>
                  </td>
                  <td className="price-cell">{formatPrice(order.summary.total)}</td>
                  <td>
                    <span className="status-badge status-completed">
                      <i className="bi bi-check-circle-fill"></i>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-view"
                        onClick={() => openModal(order.orderNumber)}
                        title="Ver boleta"
                      >
                        <i className="bi bi-receipt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content-wrapper invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header no-print">
              <h2>
                <i className="bi bi-receipt"></i>
                Boleta de Venta
              </h2>
              <button className="modal-close" onClick={closeModal} type="button">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body">
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
                  <div className="invoice-number">N° {selectedOrder.orderNumber}</div>
                  <div className="invoice-date">{formatDate(selectedOrder.timestamp)}</div>
                  <div className="invoice-status">
                    <span className="status-badge status-completed">
                      <i className="bi bi-check-circle-fill"></i>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="invoice-divider" />

              <div className="order-info-section">
                <h3>
                  <i className="bi bi-person-circle"></i>
                  Información del Cliente
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Nombre Completo:</label>
                    <span>
                      {selectedOrder.customerInfo.firstName}{' '}
                      {selectedOrder.customerInfo.lastName}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{selectedOrder.customerInfo.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Teléfono:</label>
                    <span>{selectedOrder.customerInfo.phone}</span>
                  </div>
                </div>
              </div>

              <div className="order-info-section">
                <h3>
                  <i className="bi bi-geo-alt-fill"></i>
                  Dirección de Envío
                </h3>
                <div className="info-grid">
                  <div className="info-item full-width">
                    <label>Dirección:</label>
                    <span>{selectedOrder.shippingAddress.address}</span>
                  </div>
                  <div className="info-item">
                    <label>Ciudad:</label>
                    <span>{selectedOrder.shippingAddress.city}</span>
                  </div>
                  <div className="info-item">
                    <label>Región:</label>
                    <span>{selectedOrder.shippingAddress.state}</span>
                  </div>
                  <div className="info-item">
                    <label>Código Postal:</label>
                    <span>{selectedOrder.shippingAddress.zipCode}</span>
                  </div>
                </div>
              </div>

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
                      {selectedOrder.items.map((item, index) => (
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

              <div className="order-info-section">
                <div className="invoice-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedOrder.summary.subtotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Envío:</span>
                    <span>{selectedOrder.summary.shipping === 0 ? 'Gratis' : formatPrice(selectedOrder.summary.shipping)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>{formatPrice(selectedOrder.summary.total)}</span>
                  </div>
                </div>
              </div>

              {/* ⬇️ SIN FOOTER CON MENSAJE - Se mostrará solo en la vista del cliente */}
            </div>

            <div className="modal-footer no-print">
              <div className="d-flex">
                <button 
                  className="btn btn-outline-primary"
                  onClick={handlePrint}
                  title="Imprimir boleta"
                >
                  <i className="bi bi-printer"></i>
                  Imprimir
                </button>
                <button 
                  className="btn btn-outline-success"
                  onClick={handleDownloadPDF}
                  title="Descargar PDF"
                >
                  <i className="bi bi-file-earmark-pdf"></i>
                  Descargar PDF
                </button>
                <div className="ms-auto">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    <i className="bi bi-x-circle"></i>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
import api from './api';

const orderService = {
  // Crear una nueva orden
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
  },

  // Obtener todas las órdenes (solo admin)
  getAllOrders: async () => {
    try {
      const response = await api.get('/orders/all');
      return response;
    } catch (error) {
      console.error('Error al obtener todas las órdenes:', error);
      throw error;
    }
  },

  // Obtener una orden específica por número
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await api.get(`/orders/${orderNumber}`);
      return response;
    } catch (error) {
      console.error('Error al obtener orden:', error);
      throw error;
    }
  },

  // Obtener órdenes del usuario actual
  getUserOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response;
    } catch (error) {
      console.error('Error al obtener órdenes del usuario:', error);
      throw error;
    }
  }
};

export default orderService;
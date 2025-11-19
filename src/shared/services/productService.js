import api from './api';

export const productService = {
  // Obtener todos los productos (PUBLIC)
  getAll: () => api.get('/products'),
  
  // Obtener producto por ID (PUBLIC)
  getById: (id) => api.get(`/products/${id}`),
  
  // Obtener productos por categoría (PUBLIC)
  getByCategory: (category) => api.get(`/products/category/${encodeURIComponent(category)}`),
  
  // Buscar productos (PUBLIC)
  search: (query) => api.get(`/products/search?query=${encodeURIComponent(query)}`),
  
  // Crear producto (ADMIN ONLY)
  create: (product) => api.post('/products', product),
  
  // Actualizar producto (ADMIN ONLY)
  update: (id, product) => api.put(`/products/${id}`, product),
  
  // Eliminar producto (ADMIN ONLY)
  delete: (id) => api.delete(`/products/${id}`)
};
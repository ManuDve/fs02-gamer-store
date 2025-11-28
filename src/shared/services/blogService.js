import api from './api';

export const blogService = {
  // Obtener todos los posts del blog (PUBLIC)
  getAll: () => api.get('/blog-posts'),
  
  // Obtener post por ID (PUBLIC)
  getById: (id) => api.get(`/blog-posts/${id}`),
  
  // Obtener posts por tag (PUBLIC)
  getByTag: (tag) => api.get(`/blog-posts/tag/${encodeURIComponent(tag)}`),
  
  // Obtener posts por autor (PUBLIC)
  getByAuthor: (author) => api.get(`/blog-posts/author/${encodeURIComponent(author)}`),
  
  // Crear post (ADMIN ONLY)
  create: (post) => api.post('/blog-posts', post),
  
  // Actualizar post (ADMIN ONLY)
  update: (id, post) => api.put(`/blog-posts/${id}`, post),
  
  // Eliminar post (ADMIN ONLY)
  delete: (id) => api.delete(`/blog-posts/${id}`)
};

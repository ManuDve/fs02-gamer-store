import api from './api';

export const userService = {
  // Crear usuario (Público - Registro)
  register: (userData) => api.post('/users', {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    phone: userData.phone || ''
  }),

  // Listar todos los usuarios (Protegido)
  getAllUsers: () => api.get('/users'),

  // GET /api/users/{id} - Obtener usuario por ID (Protegido)
  getUserById: (id) => api.get(`/users/${id}`),

  // Actualizar usuario (Protegido)
  updateUser: (id, userData) => api.put(`/users/${id}`, {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    phone: userData.phone
  }),

  // Eliminar usuario (Protegido)
  deleteUser: (id) => api.delete(`/users/${id}`)
};
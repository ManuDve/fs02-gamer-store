import api from './api';

export const authorityService = {
  // Listar roles
  getAll: () => api.get('/authorities'),

  // Obtener roles por ID de usuario
  getByUserId: (userId) => api.get(`/authorities/user/${userId}`),

  // Obtener rol por ID de rol
  getById: (id) => api.get(`/authorities/${id}`),

  // Crear nuevo rol (asignar rol a usuario)
  create: (authorityData) => api.post('/authorities', {
    userId: authorityData.userId,
    authority: authorityData.authority
  }),

  // Actualizar rol
  update: (id, authorityData) => api.put(`/authorities/${id}`, {
    userId: authorityData.userId,
    authority: authorityData.authority
  }),

  // Eliminar rol
  delete: (id) => api.delete(`/authorities/${id}`)
};
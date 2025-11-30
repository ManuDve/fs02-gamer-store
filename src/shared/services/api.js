const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://66.135.22.150/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('roles');
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }

      if (response.status === 403) {
        throw new Error('No tienes permisos para realizar esta acción');
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const error = new Error(data?.message || `Error: ${response.status}`);
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: data
        };
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      if (!error.response && error.message.includes('fetch')) {
        error.response = {
          status: 500,
          statusText: 'Network Error',
          data: { message: 'Error de conexión' }
        };
      }
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiService();
export default api;
import "@testing-library/jest-dom";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Limpiar después de cada test (cleanup DOM)
afterEach(() => {
  cleanup();
});

// Limpiar localStorage antes de cada test para aislar el estado
beforeEach(() => {
  localStorage.clear();
});

// Mock global para todos los servicios
vi.mock('../src/shared/services/blogService.js', () => ({
  blogService: {
    getAll: vi.fn(() => Promise.resolve([])),
    getById: vi.fn(() => Promise.resolve({})),
    getByTag: vi.fn(() => Promise.resolve([])),
    getByAuthor: vi.fn(() => Promise.resolve([]))
  }
}));

vi.mock('../src/shared/services/productService.js', () => ({
  productService: {
    getAll: vi.fn(() => Promise.resolve([])),
    getById: vi.fn(() => Promise.resolve({})),
    getByCategory: vi.fn(() => Promise.resolve([])),
    search: vi.fn(() => Promise.resolve([]))
  }
}));

vi.mock('../src/shared/services/authService.js', () => ({
  authService: {
    login: vi.fn((email, password) => {
      if (email === 'admin@levelupgamer.cl' && password === 'admin123') {
        return Promise.resolve({
          email: 'admin@levelupgamer.cl',
          name: 'Administrador',
          roles: ['admin']
        });
      }
      return Promise.reject(new Error('Credenciales inválidas'));
    }),
    getCurrentUser: vi.fn(() => null),
    logout: vi.fn(),
    isAdmin: vi.fn(() => false),
    isAuthenticated: vi.fn(() => false)
  }
}));

vi.mock('../src/shared/services/userService.js', () => ({
  userService: {
    register: vi.fn((userData) => {
      // Simular el registro exitoso devolviendo el usuario registrado
      return Promise.resolve({
        email: userData.email || 'test@example.com',
        name: userData.name || 'Test User',
        roles: ['user']
      });
    })
  }
}));
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../src/app/context/CartContext';
import { AuthProvider } from '../src/app/context/AuthContext';

/**
 * Helper para renderizar componentes con los wrappers habituales:
 * - AuthProvider (para contexto de autenticación)
 * - CartProvider (para contexto de carrito)
 * - MemoryRouter (para navegación)
 * 
 * @param {React.ReactElement} ui - Componente a renderizar
 * @param {Object} options - Opciones adicionales
 * @param {string[]} options.initialEntries - Rutas iniciales para MemoryRouter
 * @param {boolean} options.withAuth - Si incluir AuthProvider (default: true)
 * @param {boolean} options.withCart - Si incluir CartProvider (default: true)
 * @param {boolean} options.withRouter - Si incluir MemoryRouter (default: true)
 * @returns {Object} - Resultado de render de @testing-library/react
 */
export function renderWithProviders(
  ui,
  {
    initialEntries = ['/'],
    withAuth = true,
    withCart = true,
    withRouter = true,
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    let content = children;

    if (withCart) {
      content = <CartProvider>{content}</CartProvider>;
    }

    if (withAuth) {
      content = <AuthProvider>{content}</AuthProvider>;
    }

    if (withRouter) {
      content = <MemoryRouter initialEntries={initialEntries}>{content}</MemoryRouter>;
    }

    return content;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-exportar todo de testing-library para conveniencia
export * from '@testing-library/react';

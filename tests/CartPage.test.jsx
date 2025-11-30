import React, { useEffect } from 'react';
import { renderWithProviders, screen, waitFor } from './test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Cart from '../src/features/store/pages/Cart.jsx';
import { addToCart, useCartDispatch } from '../src/app/context/CartContext';
import { productService } from '../src/shared/services/productService';

vi.mock('../src/shared/services/productService', () => ({
  productService: {
    getAll: vi.fn()
  }
}));

describe('Cart Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    productService.getAll.mockResolvedValue([
      { id: 'GM001', name: 'Catan', price: 35.99, stock: 10 },
      { id: 'GM002', name: 'Monopoly', price: 19.99, stock: 15 }
    ]);
  });

  it('muestra items agregados al carrito', async () => {
    function TestApp() {
      const dispatch = useCartDispatch();
      useEffect(() => {
        addToCart(dispatch, { id: 'GM001', name: 'Catan', price: 35.99, img: 'catan.webp' }, 1);
      }, [dispatch]);
      return <Cart />;
    }

    renderWithProviders(<TestApp />);

    await waitFor(() => {
      expect(screen.getByText(/Catan/i)).toBeInTheDocument();
    });
  });

  it('muestra el título del carrito', async () => {
    function TestApp() {
      const dispatch = useCartDispatch();
      useEffect(() => {
        addToCart(dispatch, { id: 'GM001', name: 'Catan', price: 35.99, img: 'catan.webp' }, 1);
      }, [dispatch]);
      return <Cart />;
    }

    renderWithProviders(<TestApp />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Carro de Compras/ })).toBeInTheDocument();
    });
  });

  it('muestra mensaje cuando el carrito está vacío', async () => {
    renderWithProviders(<Cart />, { withCart: true });

    await waitFor(() => {
      expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument();
    });
  });

  it('renderiza múltiples items en el carrito', async () => {
    function TestApp() {
      const dispatch = useCartDispatch();
      useEffect(() => {
        addToCart(dispatch, { id: 'GM001', name: 'Catan', price: 35.99, img: 'catan.webp' }, 1);
        addToCart(dispatch, { id: 'GM002', name: 'Monopoly', price: 19.99, img: 'monopoly.jpg' }, 1);
      }, [dispatch]);
      return <Cart />;
    }

    renderWithProviders(<TestApp />);

    await waitFor(() => {
      expect(screen.getByText(/Catan/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Monopoly/i)).toBeInTheDocument();
  });

  it('renderiza el resumen del carrito', async () => {
    function TestApp() {
      const dispatch = useCartDispatch();
      useEffect(() => {
        addToCart(dispatch, { id: 'GM001', name: 'Catan', price: 35.99, img: 'catan.webp' }, 1);
      }, [dispatch]);
      return <Cart />;
    }

    renderWithProviders(<TestApp />);

    await waitFor(() => {
      const totalTexts = screen.getAllByText(/Total:/);
      expect(totalTexts.length).toBeGreaterThan(0);
    });
  });

  it('renderiza el layout responsive', async () => {
    function TestApp() {
      const dispatch = useCartDispatch();
      useEffect(() => {
        addToCart(dispatch, { id: 'GM001', name: 'Catan', price: 35.99, img: 'catan.webp' }, 1);
      }, [dispatch]);
      return <Cart />;
    }

    const { container } = renderWithProviders(<TestApp />);

    await waitFor(() => {
      const rows = container.querySelectorAll('.row');
      expect(rows.length).toBeGreaterThan(0);
    });
  });

  it('renderiza con estructura de container', () => {
    function TestApp() {
      const dispatch = useCartDispatch();
      useEffect(() => {
        addToCart(dispatch, { id: 'GM001', name: 'Catan', price: 35.99, img: 'catan.webp' }, 1);
      }, [dispatch]);
      return <Cart />;
    }

    const { container } = renderWithProviders(<TestApp />);

    const mainContainer = container.querySelector('.container');
    expect(mainContainer).toBeInTheDocument();
  });
});

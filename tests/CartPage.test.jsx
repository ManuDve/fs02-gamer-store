import React, { useEffect } from 'react';
import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import Cart from '../src/features/store/pages/Cart.jsx';
import { addToCart, useCartDispatch } from '../src/app/context/CartContext';

describe('Cart Page', () => {
  it('muestra items agregados al carrito', () => {
    function TestApp() {
      const dispatch = useCartDispatch();
      useEffect(() => {
        addToCart(dispatch, { id: 'GM001', name: 'Catan', price: 35.99, img: 'catan.webp' }, 1);
      }, [dispatch]);
      return <Cart />;
    }

    renderWithProviders(<TestApp />);

    expect(screen.getByText(/Catan/i)).toBeInTheDocument();
  });

  it('muestra el título del carrito', () => {
    function TestApp() {
      const dispatch = useCartDispatch();
      useEffect(() => {
        addToCart(dispatch, { id: 'GM001', name: 'Catan', price: 35.99, img: 'catan.webp' }, 1);
      }, [dispatch]);
      return <Cart />;
    }

    renderWithProviders(<TestApp />);

    expect(screen.getByRole('heading', { name: /Carro de Compras/ })).toBeInTheDocument();
  });

  it('muestra mensaje cuando el carrito está vacío', () => {
    renderWithProviders(<Cart />, { withCart: true });

    expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument();
  });

  it('renderiza múltiples items en el carrito', () => {
    function TestApp() {
      const dispatch = useCartDispatch();
      useEffect(() => {
        addToCart(dispatch, { id: 'GM001', name: 'Catan', price: 35.99, img: 'catan.webp' }, 1);
        addToCart(dispatch, { id: 'GM002', name: 'Monopoly', price: 19.99, img: 'monopoly.jpg' }, 1);
      }, [dispatch]);
      return <Cart />;
    }

    renderWithProviders(<TestApp />);

    expect(screen.getByText(/Catan/i)).toBeInTheDocument();
    expect(screen.getByText(/Monopoly/i)).toBeInTheDocument();
  });

  it('renderiza el resumen del carrito', () => {
    function TestApp() {
      const dispatch = useCartDispatch();
      useEffect(() => {
        addToCart(dispatch, { id: 'GM001', name: 'Catan', price: 35.99, img: 'catan.webp' }, 1);
      }, [dispatch]);
      return <Cart />;
    }

    renderWithProviders(<TestApp />);

    const totalTexts = screen.getAllByText(/Total:/);
    expect(totalTexts.length).toBeGreaterThan(0);
  });

  it('renderiza el layout responsive', () => {
    function TestApp() {
      const dispatch = useCartDispatch();
      useEffect(() => {
        addToCart(dispatch, { id: 'GM001', name: 'Catan', price: 35.99, img: 'catan.webp' }, 1);
      }, [dispatch]);
      return <Cart />;
    }

    const { container } = renderWithProviders(<TestApp />);

    const cols = container.querySelectorAll('.col-md-8, .col-md-4');
    expect(cols.length).toBeGreaterThan(0);
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

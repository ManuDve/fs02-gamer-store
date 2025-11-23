import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from './test-utils';
import CartItem from '../src/features/store/components/CartItem';
import userEvent from '@testing-library/user-event';

describe('CartItem Component', () => {
  const mockItem = {
    id: 1,
    name: 'Catan',
    img: 'catan.webp',
    price: 29990,
    quantity: 1,
    description: 'Juego de mesa'
  };

  it('renderiza el item del carrito', () => {
    renderWithProviders(<CartItem item={mockItem} />, { withCart: true });

    expect(screen.getByText('Catan')).toBeInTheDocument();
    expect(screen.getByText('Juego de mesa')).toBeInTheDocument();
  });

  it('muestra la imagen del producto', () => {
    renderWithProviders(<CartItem item={mockItem} />, { withCart: true });

    const img = screen.getByAltText('Catan');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'catan.webp');
  });

  it('muestra el precio unitario', () => {
    renderWithProviders(<CartItem item={mockItem} />, { withCart: true });

    expect(screen.getByText(/Precio Unitario:/)).toBeInTheDocument();
  });

  it('muestra el total del item', () => {
    renderWithProviders(<CartItem item={mockItem} />, { withCart: true });

    expect(screen.getByText(/Total:/)).toBeInTheDocument();
  });

  it('renderiza los botones de incrementar y decrementar', () => {
    renderWithProviders(<CartItem item={mockItem} />, { withCart: true });

    const incrementBtn = screen.getByLabelText('Aumentar cantidad');
    const decrementBtn = screen.getByLabelText('Disminuir cantidad');

    expect(incrementBtn).toBeInTheDocument();
    expect(decrementBtn).toBeInTheDocument();
  });

  it('renderiza el botón de eliminar', () => {
    renderWithProviders(<CartItem item={mockItem} />, { withCart: true });

    const deleteBtn = screen.getByLabelText('Eliminar producto');
    expect(deleteBtn).toBeInTheDocument();
  });

  it('muestra la cantidad en el input', () => {
    renderWithProviders(<CartItem item={mockItem} />, { withCart: true });

    const quantityInput = screen.getByDisplayValue('1');
    expect(quantityInput).toBeInTheDocument();
  });

  it('el input de cantidad es readonly', () => {
    renderWithProviders(<CartItem item={mockItem} />, { withCart: true });

    const quantityInput = screen.getByDisplayValue('1');
    expect(quantityInput).toHaveAttribute('readOnly');
  });

  it('renderiza correctamente múltiples items', () => {
    const items = [
      { ...mockItem, id: 1 },
      { ...mockItem, id: 2, name: 'Monopoly', quantity: 2 }
    ];

    const { container } = renderWithProviders(
      <>
        {items.map(item => <CartItem key={item.id} item={item} />)}
      </>,
      { withCart: true }
    );

    expect(screen.getByText('Catan')).toBeInTheDocument();
    expect(screen.getByText('Monopoly')).toBeInTheDocument();
    expect(container.querySelectorAll('.cart-item').length).toBe(2);
  });

  it('tiene estructura de grid responsive', () => {
    const { container } = renderWithProviders(<CartItem item={mockItem} />, { withCart: true });

    const cols = container.querySelectorAll('[class*="col-"]');
    expect(cols.length).toBeGreaterThan(0);
  });
});

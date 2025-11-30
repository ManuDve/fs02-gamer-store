import { renderWithProviders, screen, fireEvent, waitFor } from './test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Filters from '../src/features/store/components/Filters.jsx';
import * as productServiceModule from '../src/shared/services/productService.js';

const mockProductsWithCategories = [
    { id: 'P1', name: 'Catan', category: 'Juego de Mesa', price: 35.99, img: '/catan.jpg' },
    { id: 'P2', name: 'Mouse', category: 'Periférico Gamer', price: 45.99, img: '/mouse.jpg' },
    { id: 'P3', name: 'PS5', category: 'Consola', price: 499.99, img: '/ps5.jpg' }
];

vi.mock('../src/shared/services/productService.js', () => ({
    productService: {
        getAll: vi.fn()
    }
}));

beforeEach(() => {
    productServiceModule.productService.getAll.mockResolvedValue(mockProductsWithCategories);
});

describe('Filters Component', () => {
  it('renderiza el select de categorías', () => {
    const mockOnChange = vi.fn();
    renderWithProviders(
      <Filters onChange={mockOnChange} />,
      { withCart: false, withRouter: false }
    );

    expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('muestra todas las opciones de categoría', async () => {
    const mockOnChange = vi.fn();
    renderWithProviders(
      <Filters onChange={mockOnChange} />,
      { withCart: false, withRouter: false }
    );

    expect(screen.getByText('Todas')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Juego de Mesa')).toBeInTheDocument();
    });
    expect(screen.getByText('Periférico Gamer')).toBeInTheDocument();
    expect(screen.getByText('Consola')).toBeInTheDocument();
  });

  it('llama a onChange cuando se selecciona una categoría', () => {
    const mockOnChange = vi.fn();
    renderWithProviders(
      <Filters onChange={mockOnChange} />,
      { withCart: false, withRouter: false }
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Juego de Mesa' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Function));
  });

  it('actualiza el filtro correctamente al cambiar categoría', async () => {
    let filters = { category: 'all' };
    const mockOnChange = vi.fn((updateFn) => {
      filters = updateFn(filters);
    });

    renderWithProviders(
      <Filters onChange={mockOnChange} />,
      { withCart: false, withRouter: false }
    );

    await waitFor(() => {
      expect(screen.getByText('Juego de Mesa')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Consola' } });

    expect(filters.category).toBe('Consola');
  });

  it('tiene el atributo id y for correctamente vinculados', () => {
    const mockOnChange = vi.fn();
    renderWithProviders(
      <Filters onChange={mockOnChange} />,
      { withCart: false, withRouter: false }
    );

    const label = screen.getByText(/categoría/i);
    const select = screen.getByRole('combobox');

    expect(label).toHaveAttribute('for', select.id);
  });
});

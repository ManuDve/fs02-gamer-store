import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from './test-utils';
import CartSummary from '../src/features/store/components/CartSummary';
import userEvent from '@testing-library/user-event';

describe('CartSummary Component', () => {
  it('renderiza el total del carrito', () => {
    renderWithProviders(<CartSummary total="65.970" itemsCount={3} />, { withCart: true });
    expect(screen.getByText(/Total:/)).toBeInTheDocument();
  });

  it('renderiza el campo de cupón', () => {
    renderWithProviders(<CartSummary total="65.970" itemsCount={3} />, { withCart: true });
    expect(screen.getByText(/Ingrese cupón de descuento:/)).toBeInTheDocument();
  });

  it('renderiza el input de cupón', () => {
    renderWithProviders(<CartSummary total="65.970" itemsCount={3} />, { withCart: true });
    expect(screen.getByPlaceholderText('Cupón de descuento')).toBeInTheDocument();
  });

  it('renderiza el selector de método de pago', () => {
    renderWithProviders(<CartSummary total="65.970" itemsCount={3} />, { withCart: true });
    expect(screen.getByLabelText('Método de pago')).toBeInTheDocument();
  });

  it('renderiza todas las opciones de método de pago', () => {
    renderWithProviders(<CartSummary total="65.970" itemsCount={3} />, { withCart: true });
    expect(screen.getByText('Tarjeta de Crédito')).toBeInTheDocument();
    expect(screen.getByText('Tarjeta de Débito')).toBeInTheDocument();
    expect(screen.getByText('PayPal')).toBeInTheDocument();
    expect(screen.getByText('Transferencia Bancaria')).toBeInTheDocument();
  });

  it('renderiza el botón de vaciar carrito', () => {
    renderWithProviders(<CartSummary total="65.970" itemsCount={3} />, { withCart: true });
    const buttons = screen.getAllByRole('button');
    const clearButton = buttons.find(btn => btn.textContent.includes('Vaciar carrito'));
    expect(clearButton).toBeInTheDocument();
  });

  it('renderiza la imagen de métodos de pago', () => {
    renderWithProviders(<CartSummary total="65.970" itemsCount={3} />, { withCart: true });
    expect(screen.getByAltText('métodos de pago')).toBeInTheDocument();
  });

  it('actualiza el código de cupón cuando se escribe', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CartSummary total="65.970" itemsCount={3} />, { withCart: true });
    
    const couponInput = screen.getByPlaceholderText('Cupón de descuento');
    await user.type(couponInput, 'DESCUENTO10');
    expect(couponInput).toHaveValue('DESCUENTO10');
  });

  it('actualiza el método de pago cuando se selecciona', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CartSummary total="65.970" itemsCount={3} />, { withCart: true });
    
    const select = screen.getByLabelText('Método de pago');
    await user.selectOptions(select, 'credit_card');
    expect(select).toHaveValue('credit_card');
  });

  it('tiene divs con clase cart-divider', () => {
    const { container } = renderWithProviders(<CartSummary total="65.970" itemsCount={3} />, { withCart: true });
    const dividers = container.querySelectorAll('.cart-divider');
    expect(dividers.length).toBeGreaterThan(0);
  });

  it('renderiza dentro de una columna responsive', () => {
    const { container } = renderWithProviders(<CartSummary total="65.970" itemsCount={3} />, { withCart: true });
    const col = container.querySelector('.col-12.col-md-4');
    expect(col).toBeInTheDocument();
  });
});


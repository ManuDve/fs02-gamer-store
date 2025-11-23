import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from './test-utils';
import Contact from '../src/features/store/pages/Contact';

describe('Contact Page', () => {
  it('renderiza el título de la página', () => {
    renderWithProviders(<Contact />, { withCart: true });

    expect(screen.getByRole('heading', { name: /contáctanos/i })).toBeInTheDocument();
  });

  it('renderiza la descripción de la página', () => {
    renderWithProviders(<Contact />, { withCart: true });

    expect(screen.getByText(/contáctanos a través del siguiente formulario/i)).toBeInTheDocument();
  });

  it('renderiza el formulario de contacto', () => {
    renderWithProviders(<Contact />, { withCart: true });

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
  });

  it('renderiza el iframe del mapa', () => {
    const { container } = renderWithProviders(<Contact />, { withCart: true });

    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('title', 'Ubicación Level-Up Gamer');
  });

  it('tiene el layout correcto con dos columnas', () => {
    const { container } = renderWithProviders(<Contact />, { withCart: true });

    const cols = container.querySelectorAll('.col-12');
    expect(cols.length).toBe(2);
  });

  it('renderiza dentro de un contenedor con padding', () => {
    const { container } = renderWithProviders(<Contact />, { withCart: true });

    const mainContainer = container.querySelector('.container.p-5');
    expect(mainContainer).toBeInTheDocument();
  });

  it('tiene la estructura de filas de Bootstrap', () => {
    const { container } = renderWithProviders(<Contact />, { withCart: true });

    const row = container.querySelector('.row');
    expect(row).toBeInTheDocument();
  });

  it('renderiza el botón de envío', () => {
    renderWithProviders(<Contact />, { withCart: true });

    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('el mapa tiene las dimensiones correctas', () => {
    const { container } = renderWithProviders(<Contact />, { withCart: true });

    const iframe = container.querySelector('iframe');
    expect(iframe).toHaveAttribute('width', '100%');
    expect(iframe).toHaveAttribute('height', '400');
  });

  it('las columnas son responsive', () => {
    const { container } = renderWithProviders(<Contact />, { withCart: true });

    const cols = container.querySelectorAll('.col-md-6');
    expect(cols.length).toBe(2);
  });
});

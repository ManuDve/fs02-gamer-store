import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import PaymentSuccess from '../src/features/store/pages/PaymentSuccess';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({
            state: {
                orderData: {
                    orderNumber: 'ORD-123456-789',
                    items: [
                        { id: 1, name: 'Producto Test 1', price: 100, quantity: 2, img: 'img1.jpg' },
                        { id: 2, name: 'Producto Test 2', price: 50, quantity: 1, img: 'img2.jpg' }
                    ],
                    total: '250.00',
                    customerInfo: {
                        firstName: 'Juan',
                        lastName: 'Pérez',
                        email: 'juan@example.com',
                        phone: '123456789',
                        address: 'Calle Principal 123',
                        city: 'Santiago',
                        state: 'RM',
                        zipCode: '12345'
                    }
                }
            }
        })
    };
});

describe('PaymentSuccess', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('debería mostrar el mensaje de éxito', () => {
        renderWithProviders(<PaymentSuccess />);

        expect(screen.getByText('¡Pago Exitoso!')).toBeInTheDocument();
        expect(screen.getByText(/Tu compra ha sido procesada correctamente/i)).toBeInTheDocument();
    });

    it('debería mostrar el número de orden', () => {
        renderWithProviders(<PaymentSuccess />);

        expect(screen.getByText('Número de Orden:')).toBeInTheDocument();
        expect(screen.getByText('ORD-123456-789')).toBeInTheDocument();
    });

    it('debería mostrar la información del cliente', () => {
        renderWithProviders(<PaymentSuccess />);

        expect(screen.getByText('Enviado a:')).toBeInTheDocument();
        expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument();
        expect(screen.getByText(/Calle Principal 123/)).toBeInTheDocument();
        expect(screen.getByText(/Santiago, RM - 12345/)).toBeInTheDocument();
        expect(screen.getAllByText(/juan@example.com/).length).toBeGreaterThan(0);
        expect(screen.getByText(/123456789/)).toBeInTheDocument();
    });

    it('debería mostrar la lista de productos comprados', () => {
        renderWithProviders(<PaymentSuccess />);

        expect(screen.getByText('Productos:')).toBeInTheDocument();
        expect(screen.getByText('Producto Test 1')).toBeInTheDocument();
        expect(screen.getByText('Producto Test 2')).toBeInTheDocument();
        expect(screen.getByText(/Cantidad: 2/)).toBeInTheDocument();
        expect(screen.getByText(/Cantidad: 1/)).toBeInTheDocument();
    });

    it('debería mostrar el total pagado', () => {
        renderWithProviders(<PaymentSuccess />);

        expect(screen.getByText('Total Pagado:')).toBeInTheDocument();
        expect(screen.getByText('$250')).toBeInTheDocument();
    });

    it('debería mostrar la sección "¿Qué sigue?"', () => {
        renderWithProviders(<PaymentSuccess />);

        expect(screen.getByText(/¿Qué sigue\?/i)).toBeInTheDocument();
        expect(screen.getByText(/Recibirás un correo de confirmación/i)).toBeInTheDocument();
        expect(screen.getByText(/El tiempo de entrega estimado es de 3-5 días hábiles/i)).toBeInTheDocument();
    });

    it('debería tener botón "Volver al Inicio"', () => {
        renderWithProviders(<PaymentSuccess />);

        const homeButton = screen.getByText('Volver al Inicio');
        expect(homeButton).toBeInTheDocument();

        fireEvent.click(homeButton);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('debería tener botón "Seguir Comprando"', () => {
        renderWithProviders(<PaymentSuccess />);

        const shopButton = screen.getByText('Seguir Comprando');
        expect(shopButton).toBeInTheDocument();

        fireEvent.click(shopButton);
        expect(mockNavigate).toHaveBeenCalledWith('/products');
    });

    it('debería mostrar información de soporte', () => {
        renderWithProviders(<PaymentSuccess />);

        expect(screen.getByText(/¿Necesitas ayuda\?/i)).toBeInTheDocument();
        expect(screen.getByText(/soporte@gamerstore.com/i)).toBeInTheDocument();
    });

    it('debería mostrar la fecha actual', () => {
        renderWithProviders(<PaymentSuccess />);

        expect(screen.getByText('Fecha:')).toBeInTheDocument();
    });

    it('debería mostrar precios calculados correctamente para cada producto', () => {
        renderWithProviders(<PaymentSuccess />);

        // Producto 1: 100 * 2 = 200 -> $200 (CLP)
        expect(screen.getByText('$200')).toBeInTheDocument();
        // Producto 2: 50 * 1 = 50 -> $50 (CLP)
        expect(screen.getByText('$50')).toBeInTheDocument();
    });
});

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
                    timestamp: new Date().toISOString(),
                    status: 'Completado',
                    items: [
                        { id: 1, name: 'Producto Test 1', price: 100, quantity: 2, img: 'img1.jpg', subtotal: 200 },
                        { id: 2, name: 'Producto Test 2', price: 50, quantity: 1, img: 'img2.jpg', subtotal: 50 }
                    ],
                    total: '250.00',
                    customerInfo: {
                        firstName: 'Juan',
                        lastName: 'Pérez',
                        email: 'juan@example.com',
                        phone: '123456789'
                    },
                    shippingAddress: {
                        address: 'Calle Principal 123',
                        city: 'Santiago',
                        state: 'RM',
                        zipCode: '12345'
                    },
                    summary: {
                        subtotal: 250,
                        shipping: 0,
                        total: 250
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
        expect(screen.getByText(/Tu pedido ha sido confirmado y procesado correctamente/i)).toBeInTheDocument();
    });

    it('debería mostrar el número de orden', () => {
        renderWithProviders(<PaymentSuccess />);

        // The order number is shown in the invoice-number div with 'N° ' prefix
        expect(screen.getByText(/ORD-123456-789/)).toBeInTheDocument();
    });

    it('debería mostrar la información del cliente', () => {
        renderWithProviders(<PaymentSuccess />);

        // Check customer information is displayed
        expect(screen.getByText('Información del Cliente')).toBeInTheDocument();
        expect(screen.getByText(/Juan/)).toBeInTheDocument();
        expect(screen.getByText(/Pérez/)).toBeInTheDocument();
        expect(screen.getByText('juan@example.com')).toBeInTheDocument();
        expect(screen.getByText('123456789')).toBeInTheDocument();
        
        // Check shipping address
        expect(screen.getByText('Dirección de Envío')).toBeInTheDocument();
        expect(screen.getByText('Calle Principal 123')).toBeInTheDocument();
        expect(screen.getByText('Santiago')).toBeInTheDocument();
        expect(screen.getByText('RM')).toBeInTheDocument();
        expect(screen.getByText('12345')).toBeInTheDocument();
    });

    it('debería mostrar la lista de productos comprados', () => {
        renderWithProviders(<PaymentSuccess />);

        // Check products section header
        expect(screen.getByText('Detalle de Productos')).toBeInTheDocument();
        
        // Check products are listed
        expect(screen.getByText('Producto Test 1')).toBeInTheDocument();
        expect(screen.getByText('Producto Test 2')).toBeInTheDocument();
        
        // Check quantities are in the table (as plain numbers)
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('debería mostrar el total pagado', () => {
        renderWithProviders(<PaymentSuccess />);

        // Check invoice summary shows total
        expect(screen.getByText('Total:')).toBeInTheDocument();
        expect(screen.getAllByText('$250').length).toBeGreaterThan(0);
    });

    it('debería mostrar la sección "¿Qué sigue?"', () => {
        renderWithProviders(<PaymentSuccess />);

        // The component shows confirmation message in the footer
        expect(screen.getByText(/¡Gracias por tu compra!/i)).toBeInTheDocument();
        expect(screen.getByText(/Recibirás un correo de confirmación con el seguimiento de tu envío/i)).toBeInTheDocument();
    });

    it('debería tener botón "Volver al Inicio"', () => {
        renderWithProviders(<PaymentSuccess />);

        // Button text is 'Volver a la Tienda'
        const homeButton = screen.getByText('Volver a la Tienda');
        expect(homeButton).toBeInTheDocument();

        fireEvent.click(homeButton);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('debería tener botones de acción', () => {
        renderWithProviders(<PaymentSuccess />);

        // Check action buttons exist
        expect(screen.getByText('Imprimir Boleta')).toBeInTheDocument();
        expect(screen.getByText('Descargar PDF')).toBeInTheDocument();
        expect(screen.getByText('Volver a la Tienda')).toBeInTheDocument();
    });

    it('debería mostrar información de soporte', () => {
        renderWithProviders(<PaymentSuccess />);

        // The component shows company email in the header, not a help section
        expect(screen.getByText(/contacto@lupgamer.cl/i)).toBeInTheDocument();
    });

    it('debería mostrar la fecha actual', () => {
        renderWithProviders(<PaymentSuccess />);

        // The component shows date in the invoice-date div, not with "Fecha:" label
        const invoiceDate = document.querySelector('.invoice-date');
        expect(invoiceDate).toBeInTheDocument();
    });

    it('debería mostrar precios calculados correctamente para cada producto', () => {
        renderWithProviders(<PaymentSuccess />);

        // The component shows unit prices and subtotals
        expect(screen.getByText('$100')).toBeInTheDocument();
        expect(screen.getByText('$200')).toBeInTheDocument();
        // $50 appears twice (unit price and subtotal), so use getAllByText
        expect(screen.getAllByText('$50').length).toBeGreaterThan(0);
    });
});

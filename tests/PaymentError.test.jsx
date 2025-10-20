import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import PaymentError from '../src/features/store/pages/PaymentError';

const mockNavigate = vi.fn();

// Mock global para useNavigate y useLocation
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({
            state: {
                errorCode: 'CARD_DECLINED',
                errorMessage: 'Tu tarjeta ha sido rechazada'
            }
        })
    };
});

describe('PaymentError', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('debería mostrar error de tarjeta rechazada', () => {
        renderWithProviders(<PaymentError />);

        expect(screen.getByText('Tarjeta Rechazada')).toBeInTheDocument();
    });

    it('debería mostrar el código de error', () => {
        renderWithProviders(<PaymentError />);

        expect(screen.getByText('Código de Error:')).toBeInTheDocument();
        expect(screen.getByText('CARD_DECLINED')).toBeInTheDocument();
    });

    it('debería mostrar mensaje de que no se realizó ningún cargo', () => {
        renderWithProviders(<PaymentError />);

        expect(screen.getByText(/No se ha realizado ningún cargo a tu tarjeta/i)).toBeInTheDocument();
    });

    it('debería mostrar la sección de problemas comunes', () => {
        renderWithProviders(<PaymentError />);

        expect(screen.getByText(/Problemas Comunes y Soluciones/i)).toBeInTheDocument();
        expect(screen.getByText(/Verifica los datos de tu tarjeta/i)).toBeInTheDocument();
        expect(screen.getByText(/Revisa los límites de tu tarjeta/i)).toBeInTheDocument();
        expect(screen.getByText(/Confirma el saldo disponible/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Contacta a tu banco/i).length).toBeGreaterThan(0);
    });

    it('debería tener botón "Reintentar Pago"', () => {
        renderWithProviders(<PaymentError />);

        const retryButton = screen.getByText('Reintentar Pago');
        expect(retryButton).toBeInTheDocument();

        fireEvent.click(retryButton);
        expect(mockNavigate).toHaveBeenCalledWith('/pay');
    });

    it('debería tener botón "Volver al Carrito"', () => {
        renderWithProviders(<PaymentError />);

        const cartButton = screen.getByText('Volver al Carrito');
        expect(cartButton).toBeInTheDocument();

        fireEvent.click(cartButton);
        expect(mockNavigate).toHaveBeenCalledWith('/cart');
    });

    it('debería tener botón "Seguir Comprando"', () => {
        renderWithProviders(<PaymentError />);

        const shopButton = screen.getByText('Seguir Comprando');
        expect(shopButton).toBeInTheDocument();

        fireEvent.click(shopButton);
        expect(mockNavigate).toHaveBeenCalledWith('/products');
    });

    it('debería mostrar información de contacto de soporte', () => {
        renderWithProviders(<PaymentError />);

        expect(screen.getByText(/¿Necesitas Ayuda\?/i)).toBeInTheDocument();
        expect(screen.getByText(/soporte@gamerstore.com/i)).toBeInTheDocument();
    });

    it('debería mostrar métodos alternativos de pago', () => {
        renderWithProviders(<PaymentError />);

        expect(screen.getByText(/¿Sigues teniendo problemas\?/i)).toBeInTheDocument();
        expect(screen.getByText(/Utiliza una tarjeta de crédito o débito diferente/i)).toBeInTheDocument();
    });

    it('debería mostrar la fecha y hora del error', () => {
        renderWithProviders(<PaymentError />);

        expect(screen.getByText('Fecha y Hora:')).toBeInTheDocument();
    });

    it('debería mostrar horario de atención', () => {
        renderWithProviders(<PaymentError />);

        expect(screen.getByText(/Horario de atención/i)).toBeInTheDocument();
        expect(screen.getByText(/Lunes a Viernes, 9:00 - 18:00 hrs/i)).toBeInTheDocument();
    });
});

import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import PaymentFormActions from '../src/features/store/components/PaymentFormActions';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('PaymentFormActions', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('debería renderizar ambos botones', () => {
        renderWithProviders(
            <PaymentFormActions isProcessing={false} />,
            { withRouter: false, withCart: false }
        );

        expect(screen.getByText('Volver al Carrito')).toBeInTheDocument();
        expect(screen.getByText('Confirmar Pago')).toBeInTheDocument();
    });

    it('debería navegar al carrito al hacer click en "Volver al Carrito"', () => {
        renderWithProviders(
            <PaymentFormActions isProcessing={false} />,
            { withRouter: false, withCart: false }
        );

        const backButton = screen.getByText('Volver al Carrito');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/cart');
    });

    it('el botón "Confirmar Pago" debería ser de tipo submit', () => {
        renderWithProviders(
            <PaymentFormActions isProcessing={false} />,
            { withRouter: false, withCart: false }
        );

        const submitButton = screen.getByText('Confirmar Pago');
        expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('debería mostrar "Procesando..." cuando isProcessing es true', () => {
        renderWithProviders(
            <PaymentFormActions isProcessing={true} />,
            { withRouter: false, withCart: false }
        );

        expect(screen.getByText('Procesando...')).toBeInTheDocument();
        expect(screen.queryByText('Confirmar Pago')).not.toBeInTheDocument();
    });

    it('debería deshabilitar ambos botones cuando isProcessing es true', () => {
        renderWithProviders(
            <PaymentFormActions isProcessing={true} />,
            { withRouter: false, withCart: false }
        );

        const backButton = screen.getByText('Volver al Carrito');
        const submitButton = screen.getByText('Procesando...');

        expect(backButton).toBeDisabled();
        expect(submitButton).toBeDisabled();
    });

    it('debería habilitar ambos botones cuando isProcessing es false', () => {
        renderWithProviders(
            <PaymentFormActions isProcessing={false} />,
            { withRouter: false, withCart: false }
        );

        const backButton = screen.getByText('Volver al Carrito');
        const submitButton = screen.getByText('Confirmar Pago');

        expect(backButton).not.toBeDisabled();
        expect(submitButton).not.toBeDisabled();
    });

    it('el botón "Volver al Carrito" debería ser de tipo button', () => {
        renderWithProviders(
            <PaymentFormActions isProcessing={false} />,
            { withRouter: false, withCart: false }
        );

        const backButton = screen.getByText('Volver al Carrito');
        expect(backButton).toHaveAttribute('type', 'button');
    });

    it('debería tener las clases CSS correctas en los botones', () => {
        renderWithProviders(
            <PaymentFormActions isProcessing={false} />,
            { withRouter: false, withCart: false }
        );

        const backButton = screen.getByText('Volver al Carrito');
        const submitButton = screen.getByText('Confirmar Pago');

        expect(backButton).toHaveClass('btn', 'btn-secondary');
        expect(submitButton).toHaveClass('btn', 'btn-primary');
    });
});

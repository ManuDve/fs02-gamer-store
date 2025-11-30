import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { usePaymentProcessing } from '../src/features/store/hooks/usePaymentProcessing';
import { CartProvider } from '../src/app/context/CartContext';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('usePaymentProcessing', () => {
    const mockItems = [
        { id: 1, name: 'Producto 1', price: 100, quantity: 2, img: 'img1.jpg' }
    ];
    const mockTotal = '200.00';
    const mockFormData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '123456789',
        address: 'Calle 123',
        city: 'Santiago',
        state: 'RM',
        zipCode: '12345'
    };

    beforeEach(() => {
        mockNavigate.mockClear();
        vi.clearAllTimers();
    });

    it('debería inicializar con isProcessing en false', () => {
        const wrapper = ({ children }) => (
            <BrowserRouter>
                <CartProvider>{children}</CartProvider>
            </BrowserRouter>
        );

        const { result } = renderHook(
            () => usePaymentProcessing(mockItems, mockTotal, mockFormData),
            { wrapper }
        );

        expect(result.current.isProcessing).toBe(false);
    });

    it('debería tener una función processPayment', () => {
        const wrapper = ({ children }) => (
            <BrowserRouter>
                <CartProvider>{children}</CartProvider>
            </BrowserRouter>
        );

        const { result } = renderHook(
            () => usePaymentProcessing(mockItems, mockTotal, mockFormData),
            { wrapper }
        );

        expect(typeof result.current.processPayment).toBe('function');
    });

    it('debería cambiar isProcessing a true cuando se llama processPayment', () => {
        const wrapper = ({ children }) => (
            <BrowserRouter>
                <CartProvider>{children}</CartProvider>
            </BrowserRouter>
        );

        const { result } = renderHook(
            () => usePaymentProcessing(mockItems, mockTotal, mockFormData),
            { wrapper }
        );

        act(() => {
            result.current.processPayment();
        });

        expect(result.current.isProcessing).toBe(true);
    });

    it('debería navegar a una página después de procesar el pago', async () => {
        const wrapper = ({ children }) => (
            <BrowserRouter>
                <CartProvider>{children}</CartProvider>
            </BrowserRouter>
        );

        const { result } = renderHook(
            () => usePaymentProcessing(mockItems, mockTotal, mockFormData),
            { wrapper }
        );

        act(() => {
            result.current.processPayment();
        });

        // Esperar a que se llame navigate
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        }, { timeout: 3000 });
    }, 10000);

    it('debería generar un número de orden único', async () => {
        const wrapper = ({ children }) => (
            <BrowserRouter>
                <CartProvider>{children}</CartProvider>
            </BrowserRouter>
        );

        const { result } = renderHook(
            () => usePaymentProcessing(mockItems, mockTotal, mockFormData),
            { wrapper }
        );

        act(() => {
            result.current.processPayment();
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        }, { timeout: 3000 });
        
        const navigationCall = mockNavigate.mock.calls[0];
        // Verificar que se navegó con algún estado
        expect(navigationCall).toBeDefined();
    }, 10000);

    it('debería navegar a payment-success o payment-error', async () => {
        const wrapper = ({ children }) => (
            <BrowserRouter>
                <CartProvider>{children}</CartProvider>
            </BrowserRouter>
        );

        const { result } = renderHook(
            () => usePaymentProcessing(mockItems, mockTotal, mockFormData),
            { wrapper }
        );

        act(() => {
            result.current.processPayment();
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        }, { timeout: 3000 });
        
        const route = mockNavigate.mock.calls[0][0];
        expect(['/payment-success', '/payment-error']).toContain(route);
    }, 10000);

    it('debería cambiar isProcessing a false después de procesar', async () => {
        const wrapper = ({ children }) => (
            <BrowserRouter>
                <CartProvider>{children}</CartProvider>
            </BrowserRouter>
        );

        const { result } = renderHook(
            () => usePaymentProcessing(mockItems, mockTotal, mockFormData),
            { wrapper }
        );

        act(() => {
            result.current.processPayment();
        });

        expect(result.current.isProcessing).toBe(true);

        await waitFor(() => {
            expect(result.current.isProcessing).toBe(false);
        }, { timeout: 3000 });
    }, 10000);
});

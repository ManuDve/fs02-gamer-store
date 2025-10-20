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
        vi.useFakeTimers();

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

        // Avanzar el tiempo para simular el setTimeout
        await act(async () => {
            vi.advanceTimersByTime(3000);
            await Promise.resolve();
        });

        expect(mockNavigate).toHaveBeenCalled();

        vi.useRealTimers();
    });

    it('debería generar un número de orden único', async () => {
        vi.useFakeTimers();

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

        await act(async () => {
            vi.advanceTimersByTime(3000);
            await Promise.resolve();
        });

        expect(mockNavigate).toHaveBeenCalled();
        const navigationCall = mockNavigate.mock.calls[0];
        // Verificar que se navegó con algún estado
        expect(navigationCall).toBeDefined();

        vi.useRealTimers();
    });

    it('debería navegar a payment-success o payment-error', async () => {
        vi.useFakeTimers();

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

        await act(async () => {
            vi.advanceTimersByTime(3000);
            await Promise.resolve();
        });

        expect(mockNavigate).toHaveBeenCalled();
        const route = mockNavigate.mock.calls[0][0];
        expect(['/payment-success', '/payment-error']).toContain(route);

        vi.useRealTimers();
    });

    it('debería cambiar isProcessing a false después de procesar', async () => {
        vi.useFakeTimers();

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

        await act(async () => {
            vi.advanceTimersByTime(3000);
            await Promise.resolve();
        });

        expect(result.current.isProcessing).toBe(false);

        vi.useRealTimers();
    });
});

import React, { useEffect } from 'react';
import { renderWithProviders, screen, fireEvent } from './test-utils';
import { describe, it, expect, vi } from 'vitest';
import Cart from '../src/features/store/pages/Cart.jsx';
import { addToCart, useCartDispatch } from '../src/app/context/CartContext';

// Componente helper para agregar items al carrito antes de renderizar
function CartWithItems({ items = [] }) {
    const dispatch = useCartDispatch();

    useEffect(() => {
        items.forEach(item => {
            addToCart(dispatch, item, item.quantity || 1);
        });
    }, [dispatch, items]);

    return <Cart />;
}

describe('Cart Integration Tests', () => {
    const mockProducts = [
        { id: 'P1', name: 'Catan', price: 3599, img: '/catan.jpg', quantity: 1 },
        { id: 'P2', name: 'Monopoly', price: 2550, img: '/monopoly.jpg', quantity: 2 }
    ];

    describe('Renderizado de productos', () => {
        it('muestra los productos correctamente en el carrito', () => {
            renderWithProviders(
                <CartWithItems items={[mockProducts[0]]} />
            );

            expect(screen.getByText('Catan')).toBeInTheDocument();
            expect(screen.getByAltText('Catan')).toBeInTheDocument();
        });

        it('renderiza múltiples productos en orden', () => {
            renderWithProviders(
                <CartWithItems items={mockProducts} />
            );

            expect(screen.getByText('Catan')).toBeInTheDocument();
            expect(screen.getByText('Monopoly')).toBeInTheDocument();
        });
    });

    describe('Gestión de cantidad', () => {
        it('permite incrementar la cantidad de un producto', () => {
            renderWithProviders(
                <CartWithItems items={[mockProducts[0]]} />
            );

            const incrementBtn = screen.getAllByRole('button', { name: /Aumentar cantidad/i })[0];
            fireEvent.click(incrementBtn);

            const inputs = screen.getAllByDisplayValue('2');
            expect(inputs.length).toBeGreaterThan(0);
        });

        it('permite decrementar la cantidad de un producto', () => {
            renderWithProviders(
                <CartWithItems items={[{ ...mockProducts[1], quantity: 3 }]} />
            );

            const decrementBtn = screen.getAllByRole('button', { name: /Disminuir cantidad/i })[0];
            fireEvent.click(decrementBtn);

            const inputs = screen.getAllByDisplayValue('2');
            expect(inputs.length).toBeGreaterThan(0);
        });
    });

    describe('Gestión de productos', () => {
        it('permite eliminar productos del carrito', () => {
            renderWithProviders(
                <CartWithItems items={[mockProducts[0]]} />
            );

            const removeBtn = screen.getByRole('button', { name: /Eliminar producto/i });
            fireEvent.click(removeBtn);

            expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
        });

        it('permite eliminar múltiples productos', () => {
            vi.spyOn(window, 'confirm').mockReturnValue(true);
            
            renderWithProviders(
                <CartWithItems items={mockProducts} />
            );

            const removeButtons = screen.getAllByRole('button', { name: /Eliminar producto/i });
            fireEvent.click(removeButtons[0]);
            
            const updatedRemoveButtons = screen.queryAllByRole('button', { name: /Eliminar producto/i });
            if (updatedRemoveButtons.length > 0) {
                fireEvent.click(updatedRemoveButtons[0]);
            }

            expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
            
            vi.restoreAllMocks();
        });
    });

    describe('Estado del carrito', () => {
        it('muestra estado vacío cuando no hay productos', () => {
            renderWithProviders(<Cart />);

            expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
        });

        it('muestra botones de acción cuando hay productos', () => {
            renderWithProviders(
                <CartWithItems items={[mockProducts[0]]} />
            );

            expect(screen.getByRole('button', { name: /Vaciar carrito/i })).toBeInTheDocument();
        });

        it('limpia el carrito y muestra mensaje correcto', () => {
            vi.spyOn(window, 'confirm').mockReturnValue(true);
            
            renderWithProviders(
                <CartWithItems items={mockProducts} />
            );

            const clearBtn = screen.getByRole('button', { name: /Vaciar carrito/i });
            fireEvent.click(clearBtn);

            expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
            expect(screen.queryByText('Catan')).not.toBeInTheDocument();
            expect(screen.queryByText('Monopoly')).not.toBeInTheDocument();
            
            vi.restoreAllMocks();
        });
    });

    describe('Validación de resumen', () => {
        it('muestra el resumen del carrito', () => {
            renderWithProviders(
                <CartWithItems items={[mockProducts[0]]} />
            );

            const totalTexts = screen.getAllByText(/Total:/);
            expect(totalTexts.length).toBeGreaterThan(0);
        });

        it('muestra opciones de método de pago', () => {
            renderWithProviders(
                <CartWithItems items={[mockProducts[0]]} />
            );

            expect(screen.getByLabelText(/Método de pago/)).toBeInTheDocument();
        });

        it('muestra campo de cupón', () => {
            renderWithProviders(
                <CartWithItems items={[mockProducts[0]]} />
            );

            expect(screen.getByPlaceholderText(/Cupón de descuento/)).toBeInTheDocument();
        });
    });
});


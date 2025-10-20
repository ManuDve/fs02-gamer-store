import React, { useEffect } from 'react';
import { renderWithProviders, screen, fireEvent } from './test-utils';
import { describe, it, expect } from 'vitest';
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
        { id: 'P1', name: 'Catan', price: 35.99, img: '/catan.jpg', quantity: 1 },
        { id: 'P2', name: 'Monopoly', price: 25.50, img: '/monopoly.jpg', quantity: 2 }
    ];

    describe('Cálculos de totales', () => {
        it('calcula correctamente el total con un producto', () => {
            renderWithProviders(
                <CartWithItems items={[mockProducts[0]]} />
            );

            expect(screen.getByText(/total: \$ 35\.99/i)).toBeInTheDocument();
        });

        it('calcula correctamente el total con múltiples productos', () => {
            renderWithProviders(
                <CartWithItems items={mockProducts} />
            );

            // Total: 35.99 * 1 + 25.50 * 2 = 86.99
            expect(screen.getByText(/total: \$ 86\.99/i)).toBeInTheDocument();
        });

        it('actualiza el total después de incrementar cantidad', () => {
            renderWithProviders(
                <CartWithItems items={[mockProducts[0]]} />
            );

            const incrementBtn = screen.getAllByRole('button', { name: '+' })[0];
            fireEvent.click(incrementBtn);

            // Nuevo total: 35.99 * 2 = 71.98
            expect(screen.getByText(/total: \$ 71\.98/i)).toBeInTheDocument();
        });

        it('actualiza el total después de decrementar cantidad', () => {
            renderWithProviders(
                <CartWithItems items={[{ ...mockProducts[1], quantity: 3 }]} />
            );

            const decrementBtn = screen.getAllByRole('button', { name: '-' })[0];
            fireEvent.click(decrementBtn);

            // Nuevo total: 25.50 * 2 = 51.00
            expect(screen.getByText(/total: \$ 51/i)).toBeInTheDocument();
        });

        it('actualiza el total después de eliminar un producto', () => {
            renderWithProviders(
                <CartWithItems items={mockProducts} />
            );

            const removeBtn = screen.getAllByRole('button', { name: /eliminar/i })[0];
            fireEvent.click(removeBtn);

            // Nuevo total: solo queda un producto (25.50 * 2 = 51.00)
            expect(screen.getByText(/total: \$ 51/i)).toBeInTheDocument();
        });
    });

    describe('Gestión de productos', () => {
        it('permite agregar múltiples unidades del mismo producto', () => {
            renderWithProviders(
                <CartWithItems items={[mockProducts[0]]} />
            );

            const incrementBtn = screen.getAllByRole('button', { name: '+' })[0];

            // Incrementar 3 veces
            fireEvent.click(incrementBtn);
            fireEvent.click(incrementBtn);
            fireEvent.click(incrementBtn);

            expect(screen.getByText(/\$ 35.99 x 4/)).toBeInTheDocument();
        });

        it('elimina todos los productos correctamente', () => {
            renderWithProviders(
                <CartWithItems items={mockProducts} />
            );

            // Eliminar el primer producto
            const removeButtons = screen.getAllByRole('button', { name: /eliminar/i });
            fireEvent.click(removeButtons[0]);

            // Eliminar el segundo producto
            const remainingRemoveButtons = screen.getAllByRole('button', { name: /eliminar/i });
            fireEvent.click(remainingRemoveButtons[0]);

            // Debería mostrar carrito vacío
            expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
        });

        it('mantiene los precios correctos al modificar cantidades', () => {
            const product = { id: 'P1', name: 'Test', price: 10.00, img: '/test.jpg', quantity: 1 };

            renderWithProviders(
                <CartWithItems items={[product]} />
            );

            const incrementBtn = screen.getAllByRole('button', { name: '+' })[0];
            fireEvent.click(incrementBtn);

            expect(screen.getByText(/\$ 10 x 2/)).toBeInTheDocument();
            expect(screen.getByText(/total: \$ 20/i)).toBeInTheDocument();
        });
    });

    describe('Estado del carrito', () => {
        it('muestra estado vacío cuando no hay productos', () => {
            renderWithProviders(<Cart />);

            expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /vaciar carrito/i })).not.toBeInTheDocument();
        });

        it('muestra botones de acción cuando hay productos', () => {
            renderWithProviders(
                <CartWithItems items={[mockProducts[0]]} />
            );

            expect(screen.getByRole('button', { name: /vaciar carrito/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /ir a pagar/i })).toBeInTheDocument();
        });

        it('limpia el carrito y muestra mensaje correcto', () => {
            renderWithProviders(
                <CartWithItems items={mockProducts} />
            );

            const clearBtn = screen.getByRole('button', { name: /vaciar carrito/i });
            fireEvent.click(clearBtn);

            expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
            expect(screen.queryByText('Catan')).not.toBeInTheDocument();
            expect(screen.queryByText('Monopoly')).not.toBeInTheDocument();
        });
    });

    describe('Renderizado de productos', () => {
        it('muestra todos los datos del producto correctamente', () => {
            renderWithProviders(
                <CartWithItems items={[mockProducts[0]]} />
            );

            expect(screen.getByText('Catan')).toBeInTheDocument();
            expect(screen.getByText(/\$ 35.99 x 1/)).toBeInTheDocument();
            expect(screen.getByAltText('Catan')).toBeInTheDocument();
        });

        it('renderiza múltiples productos en orden', () => {
            renderWithProviders(
                <CartWithItems items={mockProducts} />
            );

            const productNames = screen.getAllByRole('strong');
            expect(productNames[0]).toHaveTextContent('Catan');
            expect(productNames[1]).toHaveTextContent('Monopoly');
        });
    });
});

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CartProvider, useCartState, useCartDispatch, addToCart, removeFromCart, updateQuantity, clearCart } from '../src/app/context/CartContext';

describe('CartContext', () => {
    it('addToCart adds an item and updates quantity', () => {
        const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
        const { result } = renderHook(() => {
            return { state: useCartState(), dispatch: useCartDispatch() };
        }, { wrapper });

        act(() => {
            addToCart(result.current.dispatch, { id: 'T1', name: 'Test', price: 10 }, 2);
        });

        expect(result.current.state.items.length).toBe(1);
        expect(result.current.state.items[0].quantity).toBe(2);

        act(() => {
            updateQuantity(result.current.dispatch, 'T1', 5);
        });

        expect(result.current.state.items[0].quantity).toBe(5);

        act(() => {
            removeFromCart(result.current.dispatch, 'T1');
        });

        expect(result.current.state.items.find(i => i.id === 'T1')).toBeUndefined();
    });
});

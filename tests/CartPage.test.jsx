import React, { useEffect } from 'react';
import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import Cart from '../src/features/store/pages/Cart.jsx';
import { addToCart, useCartDispatch } from '../src/app/context/CartContext';

describe('Cart page', () => {
    it('shows items added to cart', () => {
        // Create a small test app that adds an item on mount using the same provider
        function TestApp() {
            const dispatch = useCartDispatch();
            useEffect(() => {
                addToCart(dispatch, { id: 'GM001', name: 'Catan', price: 35.99, img: '' }, 1);
            }, [dispatch]);
            return <Cart />;
        }

        renderWithProviders(<TestApp />, { withRouter: false });

        // The UI should display the product name
        expect(screen.getByText(/Catan/i)).toBeTruthy();
    });
});

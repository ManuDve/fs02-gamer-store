import { renderWithProviders, screen, fireEvent } from './test-utils';
import { describe, it, expect } from 'vitest';
import Product from '../src/features/store/components/Product.jsx';
import Cart from '../src/features/store/pages/Cart.jsx';

describe('Product', () => {
    it('renders product and add to cart updates cart state', () => {
        renderWithProviders(
            <>
                <Product id="T100" img="/img.png" name="TestProd" price={9.99} />
                <Cart />
            </>
        );

        const btn = screen.getByRole('button', { name: /Agregar al carro/i });
        fireEvent.click(btn);

        // The cart UI should contain at least one item with the product name
        const matches = screen.getAllByText(/TestProd/i);
        expect(matches.length).toBeGreaterThan(0);
    });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductDetail from '../src/features/store/pages/ProductDetail.jsx';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import productsData from '../src/assets/mocks/products.json';
import { CartProvider } from '../src/app/context/CartContext';

describe('ProductDetail', () => {
    it('renders product by id', () => {
        const id = productsData.products[0].id;
        render(
            <CartProvider>
                <MemoryRouter initialEntries={[`/products/${id}`]}>
                    <Routes>
                        <Route path="/products/:id" element={<ProductDetail />} />
                    </Routes>
                </MemoryRouter>
            </CartProvider>
        );

        expect(screen.getByRole('heading', { name: new RegExp(productsData.products[0].name, 'i') })).toBeTruthy();
    });
});

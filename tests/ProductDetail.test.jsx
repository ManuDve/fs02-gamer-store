import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import ProductDetail from '../src/features/store/pages/ProductDetail.jsx';
import { Route, Routes } from 'react-router-dom';
import productsData from '../src/assets/mocks/products.json';

describe('ProductDetail', () => {
    it('renders product by id', () => {
        const id = productsData.products[0].id;
        renderWithProviders(
            <Routes>
                <Route path="/products/:id" element={<ProductDetail />} />
            </Routes>,
            { initialEntries: [`/products/${id}`] }
        );

        expect(screen.getByRole('heading', { name: new RegExp(productsData.products[0].name, 'i') })).toBeTruthy();
    });
});

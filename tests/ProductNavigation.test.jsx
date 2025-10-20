import { renderWithProviders, screen, fireEvent } from './test-utils';
import { describe, it, expect } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import Products from '../src/features/store/pages/Products.jsx';
import ProductDetail from '../src/features/store/pages/ProductDetail.jsx';
import productsData from '../src/assets/mocks/products.json';

describe('Product Navigation Integration', () => {
    const mockProducts = productsData.products.slice(0, 3);

    it('muestra todos los productos inicialmente', () => {
        renderWithProviders(<Products products={mockProducts} />);

        mockProducts.forEach(product => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        });
    });

    it('navega a detalle del producto al hacer clic', () => {
        const firstProduct = mockProducts[0];

        renderWithProviders(
            <Routes>
                <Route path="/" element={<Products products={mockProducts} />} />
                <Route path="/products/:id" element={<ProductDetail />} />
            </Routes>,
            { initialEntries: ['/'] }
        );

        // Buscar el enlace del primer producto
        const productLinks = screen.getAllByRole('link');
        const productLink = productLinks.find(link =>
            link.getAttribute('href')?.includes(`/products/${firstProduct.id}`)
        );

        expect(productLink).toBeInTheDocument();
    });

    it('filtra productos correctamente por categoría', () => {
        renderWithProviders(<Products products={mockProducts} />);

        // Obtener productos por categoría
        const juegosDeMesa = mockProducts.filter(p => p.category === 'Juego de Mesa');

        // Cambiar filtro a "Juego de Mesa"
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'Juego de Mesa' } });

        // Verificar que solo se muestran juegos de mesa
        juegosDeMesa.forEach(product => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        });

        // Verificar que otros productos no se muestran
        const otherProducts = mockProducts.filter(p => p.category !== 'Juego de Mesa');
        otherProducts.forEach(product => {
            expect(screen.queryByText(product.name)).not.toBeInTheDocument();
        });
    });

    it('muestra el banner correspondiente al filtro seleccionado', () => {
        renderWithProviders(<Products products={mockProducts} />);

        const select = screen.getByRole('combobox');

        // Filtrar por Consola
        fireEvent.change(select, { target: { value: 'Consola' } });

        expect(screen.getByRole('heading', { name: /consolas/i })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /juegos de mesa/i })).not.toBeInTheDocument();
    });
});

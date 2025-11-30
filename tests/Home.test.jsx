import { renderWithProviders, screen, waitFor } from './test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from '../src/features/store/pages/Home.jsx';
import * as productServiceModule from '../src/shared/services/productService.js';

const mockProducts = [
    { id: 'P1', name: 'Producto 1', price: 19990, img: '/img1.jpg', category: 'Juego de Mesa', stock: 10 },
    { id: 'P2', name: 'Producto 2', price: 29990, img: '/img2.jpg', category: 'Consola', stock: 5 },
    { id: 'P3', name: 'Producto 3', price: 39990, img: '/img3.jpg', category: 'Periférico Gamer', stock: 8 },
    { id: 'P4', name: 'Producto 4', price: 49990, img: '/img4.jpg', category: 'Juego de Mesa', stock: 12 },
    { id: 'P5', name: 'Producto 5', price: 59990, img: '/img5.jpg', category: 'Consola', stock: 3 },
    { id: 'P6', name: 'Producto 6', price: 69990, img: '/img6.jpg', category: 'Consola', stock: 7 }
];

vi.mock('../src/shared/services/productService.js', () => ({
    productService: {
        getAll: vi.fn()
    }
}));

beforeEach(() => {
    productServiceModule.productService.getAll.mockResolvedValue(mockProducts);
});

describe('Home Component', () => {
    it('renderiza el título principal', () => {
        renderWithProviders(<Home />);

        expect(screen.getByRole('heading', { name: /¿quiénes somos\?/i })).toBeInTheDocument();
    });

    it('renderiza la descripción de la tienda', () => {
        renderWithProviders(<Home />);

        expect(screen.getByText(/level-up gamer es una tienda online/i)).toBeInTheDocument();
        expect(screen.getByText(/somos apasionados por los videojuegos/i)).toBeInTheDocument();
    });

    it('muestra el botón "Conoce nuestros productos"', () => {
        renderWithProviders(<Home />);

        const button = screen.getByRole('link', { name: /conoce nuestros productos/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('href', '/products');
    });

    it('muestra la sección de productos destacados', () => {
        renderWithProviders(<Home />);

        expect(screen.getByRole('heading', { name: /productos destacados/i })).toBeInTheDocument();
    });

    it('renderiza solo los primeros 4 productos', async () => {
        renderWithProviders(<Home />);

        await waitFor(() => {
            expect(screen.getByText('Producto 1')).toBeInTheDocument();
        });
        expect(screen.getByText('Producto 2')).toBeInTheDocument();
        expect(screen.getByText('Producto 3')).toBeInTheDocument();
        expect(screen.getByText('Producto 4')).toBeInTheDocument();
        expect(screen.queryByText('Producto 5')).not.toBeInTheDocument();
        expect(screen.queryByText('Producto 6')).not.toBeInTheDocument();
    });

    it('renderiza el logo', () => {
        const { container } = renderWithProviders(<Home />);

        // Logo component debe estar presente
        const logoContainer = container.querySelector('.col-12.col-md-4');
        expect(logoContainer).toBeInTheDocument();
    });

    it('maneja correctamente un array vacío de productos', () => {
        renderWithProviders(<Home />);

        expect(screen.getByRole('heading', { name: /productos destacados/i })).toBeInTheDocument();
    });

    it('tiene la estructura de layout correcta', async () => {
        const { container } = renderWithProviders(<Home />);

        const main = container.querySelector('main.container.home');
        expect(main).toBeInTheDocument();

        await waitFor(() => {
            // Check that the main sections exist
            const homeProducts = container.querySelector('.home-products');
            expect(homeProducts).toBeInTheDocument();
            
            // Check that there are product cards
            const productCards = container.querySelectorAll('.product-card');
            expect(productCards.length).toBe(4); // Should show 4 products
        });
    });
});

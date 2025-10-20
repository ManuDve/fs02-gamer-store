import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import Home from '../src/features/store/pages/Home.jsx';

const mockProducts = [
    { id: 'P1', name: 'Producto 1', price: 19.99, img: '/img1.jpg' },
    { id: 'P2', name: 'Producto 2', price: 29.99, img: '/img2.jpg' },
    { id: 'P3', name: 'Producto 3', price: 39.99, img: '/img3.jpg' },
    { id: 'P4', name: 'Producto 4', price: 49.99, img: '/img4.jpg' },
    { id: 'P5', name: 'Producto 5', price: 59.99, img: '/img5.jpg' },
    { id: 'P6', name: 'Producto 6', price: 69.99, img: '/img6.jpg' }
];

describe('Home Component', () => {
    it('renderiza el título principal', () => {
        renderWithProviders(<Home products={mockProducts} />);

        expect(screen.getByRole('heading', { name: /¿quiénes somos\?/i })).toBeInTheDocument();
    });

    it('renderiza la descripción de la tienda', () => {
        renderWithProviders(<Home products={mockProducts} />);

        expect(screen.getByText(/level-up gamer es una tienda online/i)).toBeInTheDocument();
        expect(screen.getByText(/somos apasionados por los videojuegos/i)).toBeInTheDocument();
    });

    it('muestra el botón "Conoce nuestros productos"', () => {
        renderWithProviders(<Home products={mockProducts} />);

        const button = screen.getByRole('link', { name: /conoce nuestros productos/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('href', '/products');
    });

    it('muestra la sección de productos destacados', () => {
        renderWithProviders(<Home products={mockProducts} />);

        expect(screen.getByRole('heading', { name: /productos destacados/i })).toBeInTheDocument();
    });

    it('renderiza solo los primeros 4 productos', () => {
        renderWithProviders(<Home products={mockProducts} />);

        expect(screen.getByText('Producto 1')).toBeInTheDocument();
        expect(screen.getByText('Producto 2')).toBeInTheDocument();
        expect(screen.getByText('Producto 3')).toBeInTheDocument();
        expect(screen.getByText('Producto 4')).toBeInTheDocument();
        expect(screen.queryByText('Producto 5')).not.toBeInTheDocument();
        expect(screen.queryByText('Producto 6')).not.toBeInTheDocument();
    });

    it('renderiza el logo', () => {
        const { container } = renderWithProviders(<Home products={mockProducts} />);

        // Logo component debe estar presente
        const logoContainer = container.querySelector('.col-12.col-md-4');
        expect(logoContainer).toBeInTheDocument();
    });

    it('maneja correctamente un array vacío de productos', () => {
        renderWithProviders(<Home products={[]} />);

        expect(screen.getByRole('heading', { name: /productos destacados/i })).toBeInTheDocument();
        // No debería mostrar productos
        expect(screen.queryByText(/producto \d/i)).not.toBeInTheDocument();
    });

    it('tiene la estructura de layout correcta', () => {
        const { container } = renderWithProviders(<Home products={mockProducts} />);

        const main = container.querySelector('main.container.home');
        expect(main).toBeInTheDocument();

        const rows = container.querySelectorAll('.row');
        expect(rows.length).toBeGreaterThanOrEqual(2);
    });
});

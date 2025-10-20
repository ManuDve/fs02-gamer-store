import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import Navbar from '../src/shared/components/Navbar.jsx';

describe('Navbar Component', () => {
    it('renderiza el logo/brand', () => {
        renderWithProviders(<Navbar />, { withCart: true });

        const brand = screen.getByAltText('LevelUp Gamer Logo');
        expect(brand).toBeInTheDocument();
        expect(brand).toHaveAttribute('src');
    });

    it('renderiza todos los enlaces de navegación', () => {
        renderWithProviders(<Navbar />, { withCart: true });

        expect(screen.getByRole('link', { name: /inicio/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /productos/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /contacto/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    });

    it('los enlaces apuntan a las rutas correctas', () => {
        renderWithProviders(<Navbar />, { withCart: true });

        expect(screen.getByRole('link', { name: /inicio/i })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: /productos/i })).toHaveAttribute('href', '/products');
        expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute('href', '/blog');
        expect(screen.getByRole('link', { name: /contacto/i })).toHaveAttribute('href', '/contact');
        expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
    });

    it('tiene el botón toggle para dispositivos móviles', () => {
        renderWithProviders(<Navbar />, { withCart: true });

        const toggleButton = screen.getByRole('button');
        expect(toggleButton).toHaveClass('navbar-toggler');
    });

    it('tiene las clases de Bootstrap correctas', () => {
        const { container } = renderWithProviders(<Navbar />, { withCart: true });

        const nav = container.querySelector('nav');
        expect(nav).toHaveClass('navbar', 'navbar-expand-lg');
    });

    it('los enlaces están dentro de items de lista', () => {
        const { container } = renderWithProviders(<Navbar />, { withCart: true });

        const navItems = container.querySelectorAll('.nav-item');
        expect(navItems.length).toBeGreaterThanOrEqual(5);
    });

    it('el colapso tiene el id correcto para Bootstrap', () => {
        const { container } = renderWithProviders(<Navbar />, { withCart: true });

        const collapse = container.querySelector('#navbarNav');
        expect(collapse).toBeInTheDocument();

        const toggleButton = screen.getByRole('button');
        expect(toggleButton).toHaveAttribute('data-bs-target', '#navbarNav');
    });
});

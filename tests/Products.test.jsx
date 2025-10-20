import { renderWithProviders, screen, fireEvent, within } from './test-utils';
import { describe, it, expect } from 'vitest';
import Products from '../src/features/store/pages/Products.jsx';

const mockProducts = [
    { id: 'P1', name: 'Catan', price: 35.99, img: '/catan.jpg', category: 'Juego de Mesa' },
    { id: 'P2', name: 'Monopoly', price: 25.99, img: '/monopoly.jpg', category: 'Juego de Mesa' },
    { id: 'P3', name: 'Mouse Gamer', price: 45.99, img: '/mouse.jpg', category: 'Periférico Gamer' },
    { id: 'P4', name: 'Teclado RGB', price: 89.99, img: '/teclado.jpg', category: 'Periférico Gamer' },
    { id: 'P5', name: 'PlayStation 5', price: 499.99, img: '/ps5.jpg', category: 'Consola' },
    { id: 'P6', name: 'Xbox Series X', price: 449.99, img: '/xbox.jpg', category: 'Consola' }
];

describe('Products Component', () => {
    it('renderiza el título principal', () => {
        renderWithProviders(<Products products={mockProducts} />);

        expect(screen.getByRole('heading', { name: /nuestros productos/i })).toBeInTheDocument();
    });

    it('renderiza el componente Filters', () => {
        renderWithProviders(<Products products={mockProducts} />);

        expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
    });

    describe('Mostrar todas las categorías (filtro por defecto)', () => {
        it('muestra todos los banners cuando no hay filtro', () => {
            renderWithProviders(<Products products={mockProducts} />);

            expect(screen.getByRole('heading', { name: /juegos de mesa/i })).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: /periféricos gamer/i })).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: /consolas/i })).toBeInTheDocument();
        });

        it('muestra todos los productos cuando no hay filtro', () => {
            renderWithProviders(<Products products={mockProducts} />);

            expect(screen.getByText('Catan')).toBeInTheDocument();
            expect(screen.getByText('Monopoly')).toBeInTheDocument();
            expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
            expect(screen.getByText('Teclado RGB')).toBeInTheDocument();
            expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
            expect(screen.getByText('Xbox Series X')).toBeInTheDocument();
        });
    });

    describe('Filtrar por Juego de Mesa', () => {
        it('muestra solo productos de Juego de Mesa al filtrar', () => {
            renderWithProviders(<Products products={mockProducts} />);

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'Juego de Mesa' } });

            expect(screen.getByText('Catan')).toBeInTheDocument();
            expect(screen.getByText('Monopoly')).toBeInTheDocument();
            expect(screen.queryByText('Mouse Gamer')).not.toBeInTheDocument();
            expect(screen.queryByText('PlayStation 5')).not.toBeInTheDocument();
        });

        it('muestra solo el banner de Juegos de Mesa', () => {
            renderWithProviders(<Products products={mockProducts} />);

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'Juego de Mesa' } });

            expect(screen.getByRole('heading', { name: /juegos de mesa/i })).toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: /periféricos gamer/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: /consolas/i })).not.toBeInTheDocument();
        });
    });

    describe('Filtrar por Periférico Gamer', () => {
        it('muestra solo productos de Periférico Gamer al filtrar', () => {
            renderWithProviders(<Products products={mockProducts} />);

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'Periférico Gamer' } });

            expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
            expect(screen.getByText('Teclado RGB')).toBeInTheDocument();
            expect(screen.queryByText('Catan')).not.toBeInTheDocument();
            expect(screen.queryByText('PlayStation 5')).not.toBeInTheDocument();
        });

        it('muestra solo el banner de Periféricos Gamer', () => {
            renderWithProviders(<Products products={mockProducts} />);

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'Periférico Gamer' } });

            expect(screen.getByRole('heading', { name: /periféricos gamer/i })).toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: /juegos de mesa/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: /consolas/i })).not.toBeInTheDocument();
        });
    });

    describe('Filtrar por Consola', () => {
        it('muestra solo productos de Consola al filtrar', () => {
            renderWithProviders(<Products products={mockProducts} />);

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'Consola' } });

            expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
            expect(screen.getByText('Xbox Series X')).toBeInTheDocument();
            expect(screen.queryByText('Catan')).not.toBeInTheDocument();
            expect(screen.queryByText('Mouse Gamer')).not.toBeInTheDocument();
        });

        it('muestra solo el banner de Consolas', () => {
            renderWithProviders(<Products products={mockProducts} />);

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'Consola' } });

            expect(screen.getByRole('heading', { name: /consolas/i })).toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: /juegos de mesa/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: /periféricos gamer/i })).not.toBeInTheDocument();
        });
    });

    describe('Cambiar entre filtros', () => {
        it('actualiza los productos al cambiar de filtro', () => {
            renderWithProviders(<Products products={mockProducts} />);

            const select = screen.getByRole('combobox');

            // Filtrar por Juego de Mesa
            fireEvent.change(select, { target: { value: 'Juego de Mesa' } });
            expect(screen.getByText('Catan')).toBeInTheDocument();
            expect(screen.queryByText('Mouse Gamer')).not.toBeInTheDocument();

            // Cambiar a Periférico Gamer
            fireEvent.change(select, { target: { value: 'Periférico Gamer' } });
            expect(screen.queryByText('Catan')).not.toBeInTheDocument();
            expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();

            // Volver a Todas
            fireEvent.change(select, { target: { value: 'all' } });
            expect(screen.getByText('Catan')).toBeInTheDocument();
            expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
        });
    });

    it('renderiza las imágenes de los banners con alt correcto', () => {
        renderWithProviders(<Products products={mockProducts} />);

        const banners = screen.getAllByRole('img');
        const altTexts = banners.map(img => img.getAttribute('alt'));

        expect(altTexts).toContain('juegos de mesa');
        expect(altTexts).toContain('periféricos gamer');
        expect(altTexts).toContain('consolas');
    });

    it('maneja array vacío de productos', () => {
        renderWithProviders(<Products products={[]} />);

        expect(screen.getByRole('heading', { name: /nuestros productos/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
    });
});

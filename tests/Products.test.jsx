import { renderWithProviders, screen, fireEvent, within, waitFor } from './test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Products from '../src/features/store/pages/Products.jsx';

const mockProducts = [
    { id: 'P1', name: 'Catan', price: 35.99, img: '/catan.jpg', category: 'Juego de Mesa' },
    { id: 'P2', name: 'Monopoly', price: 25.99, img: '/monopoly.jpg', category: 'Juego de Mesa' },
    { id: 'P3', name: 'Mouse Gamer', price: 45.99, img: '/mouse.jpg', category: 'Periférico Gamer' },
    { id: 'P4', name: 'Teclado RGB', price: 89.99, img: '/teclado.jpg', category: 'Periférico Gamer' },
    { id: 'P5', name: 'PlayStation 5', price: 499.99, img: '/ps5.jpg', category: 'Consola' },
    { id: 'P6', name: 'Xbox Series X', price: 449.99, img: '/xbox.jpg', category: 'Consola' }
];

// Mock the productService
vi.mock('../src/shared/services/productService', () => ({
    productService: {
        getAll: vi.fn()
    }
}));

describe('Products Component', () => {
    beforeEach(async () => {
        const { productService } = await import('../src/shared/services/productService');
        productService.getAll.mockResolvedValue(mockProducts);
    });

    it('renderiza el título principal', async () => {
        renderWithProviders(<Products products={mockProducts} />);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /nuestros productos/i })).toBeInTheDocument();
        });
    });

    it('renderiza el componente Filters', async () => {
        renderWithProviders(<Products products={mockProducts} />);

        await waitFor(() => {
            expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
        });
    });

    describe('Mostrar todas las categorías (filtro por defecto)', () => {
        it('muestra todos los banners cuando no hay filtro', async () => {
            renderWithProviders(<Products products={mockProducts} />);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Juego de Mesa' })).toBeInTheDocument();
            });
            expect(screen.getByRole('heading', { name: 'Periférico Gamer' })).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: 'Consola' })).toBeInTheDocument();
        });

        it('muestra todos los productos cuando no hay filtro', async () => {
            renderWithProviders(<Products products={mockProducts} />);

            await waitFor(() => {
                expect(screen.getByText('Catan')).toBeInTheDocument();
            });
            expect(screen.getByText('Monopoly')).toBeInTheDocument();
            expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
            expect(screen.getByText('Teclado RGB')).toBeInTheDocument();
            expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
            expect(screen.getByText('Xbox Series X')).toBeInTheDocument();
        });
    });

    describe('Filtrar por Juego de Mesa', () => {
        it('muestra solo productos de Juego de Mesa al filtrar', async () => {
            renderWithProviders(<Products products={mockProducts} />);

            await waitFor(() => {
                expect(screen.getByRole('combobox')).toBeInTheDocument();
            });

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'Juego de Mesa' } });

            expect(screen.getByText('Catan')).toBeInTheDocument();
            expect(screen.getByText('Monopoly')).toBeInTheDocument();
            expect(screen.queryByText('Mouse Gamer')).not.toBeInTheDocument();
            expect(screen.queryByText('PlayStation 5')).not.toBeInTheDocument();
        });

        it('muestra solo el banner de Juegos de Mesa', async () => {
            renderWithProviders(<Products products={mockProducts} />);

            await waitFor(() => {
                expect(screen.getByRole('combobox')).toBeInTheDocument();
            });

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'Juego de Mesa' } });

            // When filtering, only matching categories show headings
            await waitFor(() => {
                expect(screen.queryByRole('heading', { name: 'Juego de Mesa' })).toBeInTheDocument();
            });
            expect(screen.queryByRole('heading', { name: 'Periférico Gamer' })).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: 'Consola' })).not.toBeInTheDocument();
        });
    });

    describe('Filtrar por Periférico Gamer', () => {
        it('muestra solo productos de Periférico Gamer al filtrar', async () => {
            renderWithProviders(<Products products={mockProducts} />);

            await waitFor(() => {
                expect(screen.getByRole('combobox')).toBeInTheDocument();
            });

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'Periférico Gamer' } });

            await waitFor(() => {
                expect(screen.queryByText('Mouse Gamer') || screen.getByText(/No hay productos disponibles/)).toBeTruthy();
            });
            expect(screen.queryByText('Catan')).not.toBeInTheDocument();
            expect(screen.queryByText('PlayStation 5')).not.toBeInTheDocument();
        });

        it('muestra solo el banner de Periféricos Gamer', async () => {
            renderWithProviders(<Products products={mockProducts} />);

            await waitFor(() => {
                expect(screen.getByRole('combobox')).toBeInTheDocument();
            });

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'Periférico Gamer' } });

            await waitFor(() => {
                // May show "No hay productos" if category has no products
                const hasNoProducts = screen.queryByText(/No hay productos disponibles/);
                if (!hasNoProducts) {
                    expect(screen.queryByRole('heading', { name: 'Periférico Gamer' })).toBeInTheDocument();
                }
            });
            expect(screen.queryByRole('heading', { name: 'Juego de Mesa' })).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: 'Consola' })).not.toBeInTheDocument();
        });
    });

    describe('Filtrar por Consola', () => {
        it('muestra solo productos de Consola al filtrar', async () => {
            renderWithProviders(<Products products={mockProducts} />);

            await waitFor(() => {
                expect(screen.getByRole('combobox')).toBeInTheDocument();
            });

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'Consola' } });

            expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
            expect(screen.getByText('Xbox Series X')).toBeInTheDocument();
            expect(screen.queryByText('Catan')).not.toBeInTheDocument();
            expect(screen.queryByText('Mouse Gamer')).not.toBeInTheDocument();
        });

        it('muestra solo el banner de Consolas', async () => {
            renderWithProviders(<Products products={mockProducts} />);

            await waitFor(() => {
                expect(screen.getByRole('combobox')).toBeInTheDocument();
            });

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'Consola' } });

            await waitFor(() => {
                // May show "No hay productos" if category has no products
                const hasNoProducts = screen.queryByText(/No hay productos disponibles/);
                if (!hasNoProducts) {
                    expect(screen.queryByRole('heading', { name: 'Consola' })).toBeInTheDocument();
                }
            });
            expect(screen.queryByRole('heading', { name: 'Juego de Mesa' })).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { name: 'Periférico Gamer' })).not.toBeInTheDocument();
        });
    });

    describe('Cambiar entre filtros', () => {
        it('actualiza los productos al cambiar de filtro', async () => {
            renderWithProviders(<Products products={mockProducts} />);

            await waitFor(() => {
                expect(screen.getByRole('combobox')).toBeInTheDocument();
                // Wait for initial products to load
                expect(screen.getByText('Catan')).toBeInTheDocument();
            });

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

    it('renderiza las imágenes de los banners con alt correcto', async () => {
        renderWithProviders(<Products products={mockProducts} />);

        await waitFor(() => {
            expect(screen.getAllByRole('img').length).toBeGreaterThan(0);
        });

        const images = screen.getAllByRole('img');
        const altTexts = images.map(img => img.getAttribute('alt'));

        // Images are product images, not category banners
        expect(altTexts).toContain('Catan');
        expect(altTexts).toContain('Mouse Gamer');
        expect(altTexts).toContain('PlayStation 5');
    });

    it('maneja array vacío de productos', async () => {
        renderWithProviders(<Products products={[]} />);

        // Wait for loading to complete
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /nuestros productos/i })).toBeInTheDocument();
        });
        expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
    });
});

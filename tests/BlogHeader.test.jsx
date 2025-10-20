import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import BlogHeader from '../src/features/blog/components/BlogHeader.jsx';

describe('BlogHeader Component', () => {
    it('renderiza el título principal', () => {
        renderWithProviders(
            <BlogHeader />,
            { withCart: false, withRouter: false }
        );

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('LEVEL-UP NEWS & GUIDES');
    });

    it('renderiza el subtítulo descriptivo', () => {
        renderWithProviders(
            <BlogHeader />,
            { withCart: false, withRouter: false }
        );

        expect(screen.getByText(/explora los últimos lanzamientos/i)).toBeInTheDocument();
    });

    it('tiene la estructura de header correcta', () => {
        const { container } = renderWithProviders(
            <BlogHeader />,
            { withCart: false, withRouter: false }
        );

        const header = container.querySelector('header');
        expect(header).toBeInTheDocument();
        expect(header).toHaveClass('blog-header');
    });

    it('contiene un separador horizontal', () => {
        const { container } = renderWithProviders(
            <BlogHeader />,
            { withCart: false, withRouter: false }
        );

        const hr = container.querySelector('hr.custom-sep');
        expect(hr).toBeInTheDocument();
    });

    it('tiene clases de Bootstrap aplicadas', () => {
        const { container } = renderWithProviders(
            <BlogHeader />,
            { withCart: false, withRouter: false }
        );

        const textCenter = container.querySelector('.text-center');
        expect(textCenter).toBeInTheDocument();

        const textWhite = container.querySelector('.text-white');
        expect(textWhite).toBeInTheDocument();
    });
});

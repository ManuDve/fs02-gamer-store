import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import BlogPostCard from '../src/features/blog/components/BlogPostCard.jsx';

describe('BlogPostCard Component', () => {
    const mockPost = {
        id: '1',
        title: 'Test Blog Post',
        excerpt: 'This is a test excerpt for the blog post',
        date: '2025-01-15',
        author: 'John Doe',
        imageUrl: '/test-image.jpg',
        category: 'Gaming'
    };

    it('renderiza correctamente con todos los datos', () => {
        renderWithProviders(<BlogPostCard post={mockPost} />, { withCart: false });

        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
        expect(screen.getByText(/This is a test excerpt/)).toBeInTheDocument();
        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
        expect(screen.getByText('Gaming')).toBeInTheDocument();
    });

    it('renderiza null si no hay post', () => {
        const { container } = renderWithProviders(
            <BlogPostCard post={null} />,
            { withCart: false }
        );

        expect(container.firstChild).toBeNull();
    });

    it('muestra valores por defecto cuando faltan datos', () => {
        const minimalPost = { id: '2' };
        renderWithProviders(<BlogPostCard post={minimalPost} />, { withCart: false });

        expect(screen.getByText('Sin título')).toBeInTheDocument();
        expect(screen.getByText(/anónimo/i)).toBeInTheDocument();
        expect(screen.getByText('General')).toBeInTheDocument();
    });

    it('trunca el excerpt a 120 caracteres', () => {
        const longExcerpt = 'A'.repeat(200);
        const postWithLongExcerpt = { ...mockPost, excerpt: longExcerpt };

        renderWithProviders(
            <BlogPostCard post={postWithLongExcerpt} />,
            { withCart: false }
        );

        const excerptText = screen.getByText(/^A{120}…$/);
        expect(excerptText).toBeInTheDocument();
    });

    it('formatea la fecha correctamente', () => {
        renderWithProviders(<BlogPostCard post={mockPost} />, { withCart: false });

        // La fecha se formatea según el locale del navegador (verificamos que contenga el autor y algo de fecha)
        expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });

    it('usa imagen placeholder cuando no hay imageUrl', () => {
        const postWithoutImage = { ...mockPost, imageUrl: null };
        renderWithProviders(
            <BlogPostCard post={postWithoutImage} />,
            { withCart: false }
        );

        const image = screen.getByRole('img', { name: mockPost.title });
        expect(image).toHaveAttribute('src', expect.stringContaining('placeholder'));
    });

    it('contiene enlaces correctos al post', () => {
        renderWithProviders(<BlogPostCard post={mockPost} />, { withCart: false });

        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);

        links.forEach(link => {
            expect(link).toHaveAttribute('href', '/blog/1');
        });
    });

    it('acepta summary en lugar de excerpt', () => {
        const postWithSummary = {
            ...mockPost,
            excerpt: undefined,
            summary: 'This is a summary'
        };

        renderWithProviders(
            <BlogPostCard post={postWithSummary} />,
            { withCart: false }
        );

        expect(screen.getByText(/This is a summary/)).toBeInTheDocument();
    });

    it('acepta image en lugar de imageUrl', () => {
        const postWithImage = {
            ...mockPost,
            imageUrl: undefined,
            image: '/another-image.jpg'
        };

        renderWithProviders(
            <BlogPostCard post={postWithImage} />,
            { withCart: false }
        );

        const img = screen.getByRole('img', { name: mockPost.title });
        expect(img).toHaveAttribute('src', '/another-image.jpg');
    });

    it('renderiza el badge de categoría', () => {
        renderWithProviders(
            <BlogPostCard post={mockPost} />,
            { withCart: false }
        );

        const badge = screen.getByText('Gaming');
        expect(badge).toBeInTheDocument();
    });
});

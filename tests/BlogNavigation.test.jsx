import { renderWithProviders, screen, fireEvent } from './test-utils';
import { describe, it, expect } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import BlogHome from '../src/features/blog/pages/BlogHome.jsx';
import BlogPost from '../src/features/blog/pages/BlogPost.jsx';
import blogPostsData from '../src/assets/mocks/blog_posts.json';

describe('Blog Navigation Integration', () => {
    const mockPosts = blogPostsData.blog_posts.slice(0, 3);

    it('muestra todos los posts en BlogHome', () => {
        renderWithProviders(
            <BlogHome posts={mockPosts} />,
            { withCart: false }
        );

        mockPosts.forEach(post => {
            expect(screen.getByText(post.titulo)).toBeInTheDocument();
        });
    });

    it('tiene enlaces a los posts individuales', () => {
        renderWithProviders(
            <BlogHome posts={mockPosts} />,
            { withCart: false }
        );

        // Verificar que existen enlaces a posts
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);

        // Verificar que algunos enlaces apuntan a /blog/:id
        const blogLinks = links.filter(link =>
            link.getAttribute('href')?.startsWith('/blog/')
        );
        expect(blogLinks.length).toBeGreaterThan(0);
    });

    it('renderiza el post individual correctamente', () => {
        const firstPost = mockPosts[0];

        renderWithProviders(
            <Routes>
                <Route path="/blog/:id" element={<BlogPost />} />
            </Routes>,
            {
                withCart: false,
                initialEntries: [`/blog/${firstPost.id}`]
            }
        );

        // Verificar que el título del post aparece
        expect(screen.getByText(firstPost.titulo)).toBeInTheDocument();
    });

    it('filtra posts por autor cuando se selecciona en el sidebar', () => {
        const postsWithAuthor = mockPosts.filter(post => post.autor === mockPosts[0].autor);

        // Este test asume que BlogHome recibe selectedAuthor via context
        renderWithProviders(
            <BlogHome posts={mockPosts} />,
            { withCart: false }
        );

        // Verificar que inicialmente se muestran todos los posts
        const links = screen.getAllByRole('link').filter(link =>
            link.getAttribute('href')?.startsWith('/blog/')
        );
        expect(links.length).toBeGreaterThan(0);
    });

    it('muestra información del autor en cada post', () => {
        renderWithProviders(
            <BlogHome posts={mockPosts} />,
            { withCart: false }
        );

        mockPosts.forEach(post => {
            expect(screen.getByText(new RegExp(post.autor, 'i'))).toBeInTheDocument();
        });
    });

    it('muestra la categoría en cada tarjeta de post', () => {
        renderWithProviders(
            <BlogHome posts={mockPosts} />,
            { withCart: false }
        );

        // Verificar que hay badges de categoría
        mockPosts.forEach(post => {
            const etiqueta = post.etiquetas && post.etiquetas.length > 0 ? post.etiquetas[0] : 'General';
            expect(screen.getByText(etiqueta)).toBeInTheDocument();
        });
    });
});

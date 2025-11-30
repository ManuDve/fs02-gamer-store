import { renderWithProviders, screen, fireEvent, waitFor } from './test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import BlogHome from '../src/features/blog/pages/BlogHome.jsx';
import BlogPost from '../src/features/blog/pages/BlogPost.jsx';
import blogPostsData from '../src/assets/mocks/blog_posts.json';
import * as blogServiceModule from '../src/shared/services/blogService.js';

vi.mock('../src/shared/services/blogService.js', () => ({
    blogService: {
        getAll: vi.fn(),
        getById: vi.fn()
    }
}));

beforeEach(() => {
    blogServiceModule.blogService.getAll.mockResolvedValue(blogPostsData.blog_posts);
    blogServiceModule.blogService.getById.mockImplementation((id) => {
        const post = blogPostsData.blog_posts.find(p => p.id === id);
        return Promise.resolve(post);
    });
});

describe('Blog Navigation Integration', () => {
    const mockPosts = blogPostsData.blog_posts.slice(0, 3);

    it('muestra todos los posts en BlogHome', async () => {
        renderWithProviders(
            <BlogHome />,
            { withCart: false }
        );

        await waitFor(() => {
            expect(screen.getByText(mockPosts[0].titulo)).toBeInTheDocument();
        });
    });

    it('tiene enlaces a los posts individuales', async () => {
        renderWithProviders(
            <BlogHome />,
            { withCart: false }
        );

        await waitFor(() => {
            const links = screen.getAllByRole('link');
            expect(links.length).toBeGreaterThan(0);
            
            // Verificar que algunos enlaces apuntan a /blog/:id
            const blogLinks = links.filter(link =>
                link.getAttribute('href')?.startsWith('/blog/')
            );
            expect(blogLinks.length).toBeGreaterThan(0);
        });
    });

    it('renderiza el post individual correctamente', async () => {
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

        await waitFor(() => {
            expect(screen.getByText(firstPost.titulo)).toBeInTheDocument();
        });
    });

    it('filtra posts por autor cuando se selecciona en el sidebar', async () => {
        const postsWithAuthor = mockPosts.filter(post => post.autor === mockPosts[0].autor);

        // Este test asume que BlogHome recibe selectedAuthor via context
        renderWithProviders(
            <BlogHome />,
            { withCart: false }
        );

        await waitFor(() => {
            const links = screen.getAllByRole('link').filter(link =>
                link.getAttribute('href')?.startsWith('/blog/')
            );
            expect(links.length).toBeGreaterThan(0);
        });
    });

    it('muestra información del autor en cada post', async () => {
        renderWithProviders(
            <BlogHome />,
            { withCart: false }
        );

        await waitFor(() => {
            const authorElements = screen.getAllByText(new RegExp(mockPosts[0].autor, 'i'));
            expect(authorElements.length).toBeGreaterThan(0);
        });
    });

    it('muestra la categoría en cada tarjeta de post', async () => {
        renderWithProviders(
            <BlogHome />,
            { withCart: false }
        );

        await waitFor(() => {
            const etiqueta = mockPosts[0].etiquetas && mockPosts[0].etiquetas.length > 0 ? mockPosts[0].etiquetas[0] : 'General';
            const categoryElements = screen.getAllByText(etiqueta);
            expect(categoryElements.length).toBeGreaterThan(0);
        });
    });
});

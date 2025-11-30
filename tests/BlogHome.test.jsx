import { renderWithProviders, screen, waitFor } from './test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BlogHome from '../src/features/blog/pages/BlogHome.jsx';
import postsData from '../src/assets/mocks/blog_posts.json';
import * as blogServiceModule from '../src/shared/services/blogService.js';

vi.mock('../src/shared/services/blogService.js', () => ({
    blogService: {
        getAll: vi.fn()
    }
}));

beforeEach(() => {
    blogServiceModule.blogService.getAll.mockResolvedValue(postsData.blog_posts);
});

describe('BlogHome', () => {
    it('renders posts from mock', async () => {
        renderWithProviders(
            <BlogHome />,
            { withCart: false } // No necesita CartProvider
        );
        // Wait for posts to load
        await waitFor(() => {
            const firstTitle = postsData.blog_posts[0].titulo;
            expect(screen.getByText(new RegExp(firstTitle, 'i'))).toBeTruthy();
        });
    });
});

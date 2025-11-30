import { renderWithProviders, screen, waitFor } from './test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BlogPost from '../src/features/blog/pages/BlogPost.jsx';
import { Route, Routes } from 'react-router-dom';
import postsData from '../src/assets/mocks/blog_posts.json';
import * as blogServiceModule from '../src/shared/services/blogService.js';

vi.mock('../src/shared/services/blogService.js', () => ({
    blogService: {
        getById: vi.fn()
    }
}));

beforeEach(() => {
    blogServiceModule.blogService.getById.mockImplementation((id) => {
        const post = postsData.blog_posts.find(p => p.id === id);
        return Promise.resolve(post);
    });
});

describe('BlogPost page', () => {
    it('renders an article by id', async () => {
        const id = postsData.blog_posts[0].id;
        renderWithProviders(
            <Routes>
                <Route path="/blog/:id" element={<BlogPost />} />
            </Routes>,
            { initialEntries: [`/blog/${id}`], withCart: false }
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(new RegExp(postsData.blog_posts[0].titulo, 'i'));
        });
        expect(screen.getByText(new RegExp(postsData.blog_posts[0].autor, 'i'))).toBeTruthy();
    });
});

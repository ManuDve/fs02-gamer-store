import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import BlogPost from '../src/features/blog/pages/BlogPost.jsx';
import { Route, Routes } from 'react-router-dom';
import postsData from '../src/assets/mocks/blog_posts.json';

describe('BlogPost page', () => {
    it('renders an article by id', () => {
        const id = postsData.blog_posts[0].id;
        renderWithProviders(
            <Routes>
                <Route path="/blog/:id" element={<BlogPost />} />
            </Routes>,
            { initialEntries: [`/blog/${id}`], withCart: false }
        );

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(new RegExp(postsData.blog_posts[0].titulo, 'i'));
        expect(screen.getByText(new RegExp(postsData.blog_posts[0].autor, 'i'))).toBeTruthy();
    });
});

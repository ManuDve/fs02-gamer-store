import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import BlogHome from '../src/features/blog/pages/BlogHome.jsx';
import postsData from '../src/assets/mocks/blog_posts.json';

describe('BlogHome', () => {
    it('renders posts from mock', () => {
        renderWithProviders(
            <BlogHome posts={postsData.blog_posts} />,
            { withCart: false } // No necesita CartProvider
        );
        // Check that at least one post title from mock appears
        const firstTitle = postsData.blog_posts[0].titulo;
        expect(screen.getByText(new RegExp(firstTitle, 'i'))).toBeTruthy();
    });
});

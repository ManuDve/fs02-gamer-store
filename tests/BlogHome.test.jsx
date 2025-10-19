import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogHome from '../src/features/blog/pages/BlogHome.jsx';
import postsData from '../src/assets/mocks/blog_posts.json';
import { MemoryRouter } from 'react-router-dom';

describe('BlogHome', () => {
    it('renders posts from mock', () => {
        render(
            <MemoryRouter>
                <BlogHome posts={postsData.blog_posts} />
            </MemoryRouter>
        );
        // Check that at least one post title from mock appears
        const firstTitle = postsData.blog_posts[0].titulo;
        expect(screen.getByText(new RegExp(firstTitle, 'i'))).toBeTruthy();
    });
});

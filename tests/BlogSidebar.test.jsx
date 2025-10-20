import { renderWithProviders, screen, fireEvent } from './test-utils';
import { describe, it, expect, vi } from 'vitest';
import BlogSidebar from '../src/features/blog/components/BlogSidebar.jsx';

describe('BlogSidebar', () => {
    it('calls onSelectAuthor when an author is clicked and resets with Todos', () => {
        const mock = vi.fn();
        const authors = ["Sofía 'Boardgame' Reyes", "Roberto 'Tech' Gómez"];

        renderWithProviders(
            <BlogSidebar authors={authors} selectedAuthor={null} onSelectAuthor={mock} />,
            { withCart: false, withRouter: false } // No necesita providers
        );

        // Click an author
        const authorBtn = screen.getByRole('button', { name: /Sofía 'Boardgame' Reyes/i });
        fireEvent.click(authorBtn);
        expect(mock).toHaveBeenCalledWith("Sofía 'Boardgame' Reyes");

        // Click 'Todos'
        const todosBtn = screen.getByRole('button', { name: /todos/i });
        fireEvent.click(todosBtn);
        expect(mock).toHaveBeenCalledWith(null);
    });
});

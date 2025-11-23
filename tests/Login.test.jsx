import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import Login from '../src/features/auth/pages/Login.jsx';

describe('Login Page', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renderiza correctamente', () => {
        renderWithProviders(
            <Login />,
            { withCart: false }
        );

        expect(screen.getByRole('heading', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    });

    it('renderiza dentro de un div', () => {
        const { container } = renderWithProviders(
            <Login />,
            { withCart: false }
        );

        const div = container.querySelector('div');
        expect(div).toBeInTheDocument();
    });
});

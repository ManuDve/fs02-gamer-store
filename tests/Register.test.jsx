import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import Register from '../src/features/auth/pages/Register.jsx';

describe('Register Page', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renderiza correctamente', () => {
        renderWithProviders(
            <Register />,
            { withCart: false }
        );

        expect(screen.getByRole('heading', { name: /Crear Cuenta/i })).toBeInTheDocument();
    });

    it('renderiza dentro de un div', () => {
        const { container } = renderWithProviders(
            <Register />,
            { withCart: false }
        );

        const div = container.querySelector('div');
        expect(div).toBeInTheDocument();
    });
});

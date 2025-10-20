import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import Register from '../src/features/auth/pages/Register.jsx';

describe('Register Page', () => {
    it('renderiza correctamente', () => {
        renderWithProviders(
            <Register />,
            { withCart: false, withRouter: false }
        );

        expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('renderiza dentro de un div', () => {
        const { container } = renderWithProviders(
            <Register />,
            { withCart: false, withRouter: false }
        );

        const div = container.querySelector('div');
        expect(div).toBeInTheDocument();
        expect(div).toHaveTextContent('Register');
    });
});

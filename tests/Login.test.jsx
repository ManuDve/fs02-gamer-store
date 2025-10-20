import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import Login from '../src/features/auth/pages/Login.jsx';

describe('Login Page', () => {
    it('renderiza correctamente', () => {
        renderWithProviders(
            <Login />,
            { withCart: false, withRouter: false }
        );

        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('renderiza dentro de un div', () => {
        const { container } = renderWithProviders(
            <Login />,
            { withCart: false, withRouter: false }
        );

        const div = container.querySelector('div');
        expect(div).toBeInTheDocument();
        expect(div).toHaveTextContent('Login');
    });
});

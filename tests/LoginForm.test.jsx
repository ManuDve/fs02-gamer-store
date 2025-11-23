import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import LoginForm from '../src/features/auth/components/LoginForm.jsx';

describe('LoginForm Component', () => {
    it('renderiza correctamente', () => {
        renderWithProviders(
            <LoginForm />,
            { withCart: false, withRouter: false }
        );

        expect(screen.getByText('LoginForm')).toBeInTheDocument();
    });

    it('renderiza dentro de un div', () => {
        const { container } = renderWithProviders(
            <LoginForm />,
            { withCart: false, withRouter: false }
        );

        const div = container.querySelector('div');
        expect(div).toBeInTheDocument();
        expect(div).toHaveTextContent('LoginForm');
    });
});

import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import RegisterForm from '../src/features/auth/components/RegisterForm.jsx';

describe('RegisterForm Component', () => {
    it('renderiza correctamente', () => {
        renderWithProviders(
            <RegisterForm />,
            { withCart: false, withRouter: false }
        );

        expect(screen.getByText('RegisterForm')).toBeInTheDocument();
    });

    it('renderiza dentro de un div', () => {
        const { container } = renderWithProviders(
            <RegisterForm />,
            { withCart: false, withRouter: false }
        );

        const div = container.querySelector('div');
        expect(div).toBeInTheDocument();
        expect(div).toHaveTextContent('RegisterForm');
    });
});

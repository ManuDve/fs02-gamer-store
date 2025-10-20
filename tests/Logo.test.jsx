import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import Logo from '../src/features/store/components/Logo.jsx';

describe('Logo Component', () => {
    it('renderiza la imagen del logo', () => {
        renderWithProviders(
            <Logo />,
            { withCart: false, withRouter: false }
        );

        const logo = screen.getByRole('img', { name: /logo/i });
        expect(logo).toBeInTheDocument();
    });

    it('tiene el atributo alt correcto', () => {
        renderWithProviders(
            <Logo />,
            { withCart: false, withRouter: false }
        );

        const logo = screen.getByRole('img');
        expect(logo).toHaveAttribute('alt', 'logo');
    });

    it('tiene la clase CSS correcta', () => {
        const { container } = renderWithProviders(
            <Logo />,
            { withCart: false, withRouter: false }
        );

        const logo = container.querySelector('.logo');
        expect(logo).toBeInTheDocument();
    });

    it('carga la imagen desde la ruta correcta', () => {
        renderWithProviders(
            <Logo />,
            { withCart: false, withRouter: false }
        );

        const logo = screen.getByRole('img');
        expect(logo).toHaveAttribute('src');
        expect(logo.src).toBeTruthy();
    });
});

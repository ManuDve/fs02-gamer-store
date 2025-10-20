import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import Footer from '../src/shared/components/Footer.jsx';

describe('Footer Component', () => {
    it('renderiza el texto de copyright', () => {
        renderWithProviders(
            <Footer />,
            { withCart: false, withRouter: false }
        );

        expect(screen.getByText(/gamer store/i)).toBeInTheDocument();
        expect(screen.getByText(/todos los derechos reservados/i)).toBeInTheDocument();
    });

    it('muestra el año actual dinámicamente', () => {
        renderWithProviders(
            <Footer />,
            { withCart: false, withRouter: false }
        );

        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
    });

    it('tiene la estructura de footer correcta', () => {
        const { container } = renderWithProviders(
            <Footer />,
            { withCart: false, withRouter: false }
        );

        const footer = container.querySelector('footer');
        expect(footer).toBeInTheDocument();
    });

    it('tiene las clases de Bootstrap correctas', () => {
        const { container } = renderWithProviders(
            <Footer />,
            { withCart: false, withRouter: false }
        );

        const footer = container.querySelector('footer');
        expect(footer).toHaveClass('bg-dark', 'text-white', 'py-4', 'mt-4');
    });

    it('el contenido está centrado', () => {
        const { container } = renderWithProviders(
            <Footer />,
            { withCart: false, withRouter: false }
        );

        const centerDiv = container.querySelector('.text-center');
        expect(centerDiv).toBeInTheDocument();
    });

    it('renderiza el copyright completo con formato correcto', () => {
        renderWithProviders(
            <Footer />,
            { withCart: false, withRouter: false }
        );

        const currentYear = new Date().getFullYear();
        const copyrightText = `© ${currentYear} Gamer Store. Todos los derechos reservados.`;

        expect(screen.getByText(copyrightText)).toBeInTheDocument();
    });
});

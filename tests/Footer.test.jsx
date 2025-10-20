import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import Footer from '../src/shared/components/Footer.jsx';

describe('Footer Component', () => {
    it('renderiza las secciones principales del footer', () => {
        renderWithProviders(
            <Footer />,
            { withCart: false, withRouter: false }
        );

        expect(screen.getByText(/tienda level-up gaming/i)).toBeInTheDocument();
        expect(screen.getByText(/contáctanos/i)).toBeInTheDocument();
        expect(screen.getByText(/newsletter/i)).toBeInTheDocument();
    });

    it('muestra la información de contacto', () => {
        renderWithProviders(
            <Footer />,
            { withCart: false, withRouter: false }
        );

        expect(screen.getByText(/\+569 9999 0000/)).toBeInTheDocument();
        expect(screen.getByText('contacto@lupgamer.cl')).toBeInTheDocument();
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
        expect(footer).toBeInTheDocument();
        const rows = container.querySelectorAll('.row');
        expect(rows.length).toBeGreaterThan(0);
    });

    it('el contenido tiene estructura de grid', () => {
        const { container } = renderWithProviders(
            <Footer />,
            { withCart: false, withRouter: false }
        );

        const container_div = container.querySelector('.container');
        const cols = container.querySelectorAll('.col-12');
        expect(container_div).toBeInTheDocument();
        expect(cols.length).toBeGreaterThan(0);
    });

    it('renderiza el formulario de newsletter', () => {
        renderWithProviders(
            <Footer />,
            { withCart: false, withRouter: false }
        );

        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
        const button = screen.getByRole('button', { name: /enviar/i });
        expect(button).toBeInTheDocument();
    });
});

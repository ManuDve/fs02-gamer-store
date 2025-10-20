import { renderWithProviders } from './test-utils';
import { describe, it, expect } from 'vitest';
import { AddToCartIcon } from '../src/shared/components/AddToCartIcon.jsx';

describe('AddToCartIcon Component', () => {
    it('renderiza un SVG', () => {
        const { container } = renderWithProviders(
            <AddToCartIcon />,
            { withCart: false, withRouter: false }
        );

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('tiene las dimensiones correctas', () => {
        const { container } = renderWithProviders(
            <AddToCartIcon />,
            { withCart: false, withRouter: false }
        );

        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
    });

    it('contiene los paths del ícono del carrito', () => {
        const { container } = renderWithProviders(
            <AddToCartIcon />,
            { withCart: false, withRouter: false }
        );

        const paths = container.querySelectorAll('path');
        expect(paths.length).toBeGreaterThan(0);
    });

    it('tiene los atributos SVG necesarios', () => {
        const { container } = renderWithProviders(
            <AddToCartIcon />,
            { withCart: false, withRouter: false }
        );

        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
        expect(svg).toHaveAttribute('stroke', 'currentColor');
        expect(svg).toHaveAttribute('fill', 'none');
    });
});

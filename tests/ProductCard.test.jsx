import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import ProductCard from '../src/features/store/components/ProductCard.jsx';

describe('ProductCard Component', () => {
    it('renderiza correctamente', () => {
        renderWithProviders(
            <ProductCard />,
            { withCart: false, withRouter: false }
        );

        expect(screen.getByText('ProductCard')).toBeInTheDocument();
    });

    it('renderiza dentro de un div', () => {
        const { container } = renderWithProviders(
            <ProductCard />,
            { withCart: false, withRouter: false }
        );

        const div = container.querySelector('div');
        expect(div).toBeInTheDocument();
        expect(div).toHaveTextContent('ProductCard');
    });
});

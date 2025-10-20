import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import NotFound from '../src/shared/pages/NotFound.jsx';

describe('NotFound Component', () => {
    it('renderiza correctamente', () => {
        renderWithProviders(
            <NotFound />,
            { withCart: false, withRouter: false }
        );

        expect(screen.getByText('NotFound')).toBeInTheDocument();
    });

    it('renderiza dentro de un div', () => {
        const { container } = renderWithProviders(
            <NotFound />,
            { withCart: false, withRouter: false }
        );

        const div = container.querySelector('div');
        expect(div).toBeInTheDocument();
        expect(div).toHaveTextContent('NotFound');
    });
});

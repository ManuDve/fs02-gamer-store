import { renderWithProviders, screen } from './test-utils';
import { describe, it, expect } from 'vitest';
import Banner from '../src/features/store/components/Banner.jsx';

describe('Banner Component', () => {
  it('renderiza correctamente con props válidas', () => {
    renderWithProviders(
      <Banner img="/banner.jpg" alt="Banner principal" />,
      { withCart: false, withRouter: false }
    );

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/banner.jpg');
    expect(image).toHaveAttribute('alt', 'Banner principal');
  });

  it('renderiza con diferentes imágenes', () => {
    const { rerender } = renderWithProviders(
      <Banner img="/banner1.jpg" alt="Banner 1" />,
      { withCart: false, withRouter: false }
    );

    let image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/banner1.jpg');

    rerender(<Banner img="/banner2.jpg" alt="Banner 2" />);
    
    image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/banner2.jpg');
    expect(image).toHaveAttribute('alt', 'Banner 2');
  });

  it('tiene la clase CSS correcta', () => {
    const { container } = renderWithProviders(
      <Banner img="/banner.jpg" alt="Test" />,
      { withCart: false, withRouter: false }
    );

    const banner = container.querySelector('.banner');
    expect(banner).toBeInTheDocument();
  });
});

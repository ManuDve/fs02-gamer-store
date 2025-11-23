import './BlogHeader.css';

export default function BlogHeader() {
  return (
    <header className="blog-header py-5 mb-4">
      <div className="container">
        <h1 className="display-4 fw-bold mb-3">
          LEVEL-UP NEWS & GUIDES
        </h1>
        <p className="blog-header-p mb-3">
          Explora los últimos lanzamientos, noticias de esports y guías de juego para mejorar tu experiencia.
        </p>
        <hr className="custom-sep" />
      </div>
    </header>
  );
}

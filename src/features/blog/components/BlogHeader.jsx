import './BlogHeader.css';

export default function BlogHeader() {
  return (
    <header className="text-center mb-4 blog-header">
      <div className="p-5 text-center text-white">
        <div className="container">
          <h1 className="display-4 fw-bold">
            LEVEL-UP NEWS & GUIDES
          </h1>
          <p className="blog-header-p mt-3">
            Explora los últimos lanzamientos, noticias de esports y guías de juego para mejorar tu experiencia.
          </p>
          <hr className="my-4 custom-sep" />
        </div>
      </div>
    </header>
  );
}

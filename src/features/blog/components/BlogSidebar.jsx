import './BlogSidebar.css';

export default function BlogSidebar({ authors = [], selectedAuthor = null, onSelectAuthor = () => {} }) {
  return (
    <aside className="blog-sidebar">
      <div className="blog-sidebar-section">
        <h5 className="blog-sidebar-title">Autores</h5>
        <ul className="blog-sidebar-authors list-unstyled">
          <li>
            <button
              type="button"
              className={`blog-sidebar-author ${selectedAuthor === null ? 'active' : ''}`}
              onClick={() => onSelectAuthor(null)}
            >
              Todos
            </button>
          </li>
          {authors.map((a) => (
            <li key={a}>
              <button
                type="button"
                className={`blog-sidebar-author ${selectedAuthor === a ? 'active' : ''}`}
                onClick={() => onSelectAuthor(a)}
              >
                {a}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="blog-sidebar-section">
        <h5 className="blog-sidebar-title">Recientes</h5>
        <ul className="list-unstyled">
          <li><a href="#" className="blog-sidebar-link">Novedades</a></li>
        </ul>
      </div>
    </aside>
  );
}

import './BlogSidebar.css';

export default function BlogSidebar({ authors = [], selectedAuthor = null, onSelectAuthor = () => {} }) {
  return (
    <div>
      <h5>Autores</h5>
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
      <h5 className="mt-4">Recientes</h5>
      <ul className="list-unstyled">
        <li><a href="#">Novedades</a></li>
      </ul>
    </div>
  );
}

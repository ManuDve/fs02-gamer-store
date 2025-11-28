import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { blogService } from '../../../shared/services/blogService';
import './BlogPost.css';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogService.getById(id);
      
      // Normalizar campos de la API
      const normalizedPost = {
        id: data.id,
        title: data.titulo || data.title,
        author: data.autor || data.author,
        date: data.fecha || data.date,
        imageUrl: data.imagen || data.image,
        excerpt: data.descripcion || data.excerpt || data.articulo,
        content: data.articulo || data.descripcion || data.excerpt,
        tags: data.etiquetas || [],
      };
      
      setPost(normalizedPost);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar post:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando post...</span>
        </div>
        <p className='mt-3'>Cargando post...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error al cargar el post</h4>
          <p>{error}</p>
          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={loadPost}>
              Reintentar
            </button>
            <Link to="/blog" className="btn btn-secondary">
              Volver al blog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="container py-5 text-center">
        <div className="alert alert-warning" role="alert">
          <h2>Entrada no encontrada</h2>
          <p>El post que buscas no existe o fue eliminado.</p>
          <Link to="/blog" className="btn btn-secondary">Volver al blog</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5 blog-post-page">
      <article className="row justify-content-center">
        <div className="col-lg-10">
          <header className="mb-4">
            <h1 className="fw-bold">{post.title}</h1>
            <p className="text-muted">Por {post.author} {post.date ? `• ${new Date(post.date).toLocaleDateString()}` : ''}</p>
          </header>

          {post.imageUrl && (
            <div className="mb-4 post-image-wrap">
              <img src={post.imageUrl} alt={post.title} className="img-fluid rounded" />
            </div>
          )}

          <section className="post-content mb-4">
            <p>{post.content}</p>
          </section>

          <footer>
            {post.tags.length > 0 && (
              <div className="mb-3">
                {post.tags.map((t) => (
                  <span key={t} className="badge bg-light text-dark me-2">{t}</span>
                ))}
              </div>
            )}
            <Link to="/blog" className="btn btn-outline-primary">Volver al listado</Link>
          </footer>
        </div>
      </article>
    </main>
  );
};

export default BlogPost;

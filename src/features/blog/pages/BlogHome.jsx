import { useState, useEffect } from 'react';
import BlogPostCard from './../components/BlogPostCard.jsx';
import './BlogHome.css';
import { useOutletContext } from 'react-router-dom';
import { blogService } from '../../../shared/services/blogService';

const BlogHome = () => {
  const { selectedAuthor } = useOutletContext() || {};
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogService.getAll();
      setPosts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedAuthor
    ? posts.filter(p => (p.autor || p.author || '').toString() === selectedAuthor)
    : posts;

  const hasPosts = Array.isArray(filteredPosts) && filteredPosts.length > 0;

  if (loading) {
    return (
      <div className="blog-home text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando posts...</span>
        </div>
        <p className='mt-3'>Cargando posts del blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-home py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error al cargar posts</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadPosts}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-home">
      <div className="row justify-content-center">
        {hasPosts ? (
          filteredPosts.map((rawPost) => {
            const normalized = {
              id: rawPost.id,
              title: rawPost.titulo || rawPost.title || 'Sin título',
              author: rawPost.autor || rawPost.author || 'Anónimo',
              date: rawPost.fecha || rawPost.date || null,
              imageUrl: rawPost.imagen || rawPost.image || rawPost.imageUrl || null,
              excerpt: rawPost.descripcion || rawPost.excerpt || rawPost.articulo || rawPost.summary || '',
              category: Array.isArray(rawPost.etiquetas) && rawPost.etiquetas.length > 0 ? rawPost.etiquetas[0] : 'General',
            };

            return <BlogPostCard key={normalized.id} post={normalized} />;
          })
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted">No hay entradas disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogHome;

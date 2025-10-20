import BlogHeader from './../components/BlogHeader.jsx';
import BlogPostCard from './../components/BlogPostCard.jsx';
import './BlogHome.css';
import { useOutletContext } from 'react-router-dom';

const BlogHome = ({ posts = [] }) => {
  const { selectedAuthor } = useOutletContext() || {};

  const filteredPosts = selectedAuthor
    ? posts.filter(p => (p.autor || p.author || '').toString() === selectedAuthor)
    : posts;

  const hasPosts = Array.isArray(filteredPosts) && filteredPosts.length > 0;

  return (
    <div className="blog-home">
      <BlogHeader />

      <main className="container py-5">
        <h2 className="text-center mb-4">Últimas Entradas</h2>

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
      </main>

    </div>
  );
};

export default BlogHome;

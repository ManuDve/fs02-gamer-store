import { useParams, Link } from 'react-router-dom';
import postsData from '../../../assets/mocks/blog_posts.json';
import './BlogPost.css';

const BlogPost = () => {
  const { id } = useParams();

  const rawPosts = postsData && postsData.blog_posts ? postsData.blog_posts : [];
  const rawPost = rawPosts.find((p) => p.id === id);

  if (!rawPost) {
    return (
      <main className="container py-5">
        <h2>Entrada no encontrada</h2>
        <p>El post que buscas no existe o fue eliminado.</p>
        <Link to="/blog" className="btn btn-secondary">Volver al blog</Link>
      </main>
    );
  }

  // Normalizar campos
  const post = {
    id: rawPost.id,
    title: rawPost.titulo || rawPost.title,
    author: rawPost.autor || rawPost.author,
    date: rawPost.fecha || rawPost.date,
    imageUrl: rawPost.imagen || rawPost.image,
    excerpt: rawPost.descripcion || rawPost.excerpt || rawPost.articulo,
    content: rawPost.articulo || rawPost.descripcion || rawPost.excerpt,
    tags: rawPost.etiquetas || [],
  };

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

// src/features/blog/components/BlogPostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './BlogPostCard.css';

// Componente para renderizar una tarjeta de entrada del blog.
// Acepta la prop `post` con campos esperados: id, title, summary/excerpt, date, author, imageUrl, category
const BlogPostCard = ({ post }) => {
    if (!post) return null;

    const {
        id,
        title = 'Sin título',
        summary,
        excerpt,
        date,
        author = 'Anónimo',
        imageUrl,
        image,
        category = 'General',
    } = post;

    const preview = (excerpt || summary || '')
        ? (excerpt || summary).slice(0, 150).trim()
        : '';

    const imgSrc = imageUrl || image || 'https://via.placeholder.com/800x450?text=Blog+Post';

    let formattedDate = '';
    if (date) {
        try {
            formattedDate = new Date(date).toLocaleDateString();
        } catch (e) {
            formattedDate = String(date);
        }
    }

    return (
        <article className="col-md-6 col-lg-4 mb-4 blog-post-card">
            <div className="card h-100 shadow-sm blog-post-card__card">
                <Link to={`/blog/${id}`} className="text-reset" aria-label={`Leer ${title}`}>
                    <div className="blog-post-card__img-wrap">
                        <img
                            src={imgSrc}
                            alt={title}
                            className="card-img-top blog-post-card__img"
                        />
                    </div>
                </Link>

                <div className="card-body d-flex flex-column">
                    <div className="mb-2">
                        <span className="badge category-badge">{category}</span>
                    </div>

                    <h5 className="card-title post-title">
                        <Link to={`/blog/${id}`} className="text-decoration-none text-dark">{title}</Link>
                    </h5>

                    {preview ? (
                        <p className="card-text text-muted post-excerpt">{preview}{preview.length >= 150 ? '…' : ''}</p>
                    ) : (
                        <p className="card-text text-muted post-excerpt">Sin resumen disponible.</p>
                    )}

                    <div className="mt-3">
                        <Link to={`/blog/${id}`} className="btn btn-outline-primary btn-sm">Leer más</Link>
                    </div>
                </div>

                <div className="card-footer blog-post-card__footer">
                    <small className="text-muted">Por {author}{formattedDate ? ` • ${formattedDate}` : ''}</small>
                </div>
            </div>
        </article>
    );
};

export default BlogPostCard;
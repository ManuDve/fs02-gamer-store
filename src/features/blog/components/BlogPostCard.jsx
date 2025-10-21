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
        ? (excerpt || summary).slice(0, 120).trim()
        : '';

    const imgSrc = imageUrl || image || 'https://via.placeholder.com/800x450?text=Blog+Post';

    let formattedDate = '';
    if (date) {
        try {
            formattedDate = new Date(date).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        } catch (e) {
            formattedDate = String(date);
        }
    }

    return (
        <article className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 blog-post-card">
                <Link to={`/blog/${id}`} className="text-reset text-decoration-none">
                    <div className="card-img-container">
                        <img
                            src={imgSrc}
                            alt={title}
                            className="card-img-top"
                        />
                    </div>
                </Link>

                <div className="card-body d-flex flex-column">
                    <div className="mb-2">
                        <span className="badge bg-light text-dark fs-7">{category}</span>
                    </div>

                    <h5 className="card-title mb-2">
                        <Link to={`/blog/${id}`} className="text-decoration-none text-dark">{title}</Link>
                    </h5>

                    <p className="card-text text-muted flex-grow-1 mb-4 small">
                        {preview}{preview.length >= 120 ? '…' : ''}
                    </p>

                    <div className="blog-post-footer">
                        <div className="blog-post-author">{author}</div>
                        {formattedDate && <div className="blog-post-date">{formattedDate}</div>}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogPostCard;
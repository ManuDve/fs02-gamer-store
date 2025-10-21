

import { Outlet } from "react-router-dom";
import { useState } from "react";
import MainLayout from "./MainLayout";
import BlogHeader from "../../features/blog/components/BlogHeader.jsx";
import BlogSidebar from "../../features/blog/components/BlogSidebar.jsx";
import postsData from '../../assets/mocks/blog_posts.json';

export default function BlogLayout() {
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  // extraer autores únicos desde el mock (campo 'autor' si existe)
  const rawPosts = postsData && postsData.blog_posts ? postsData.blog_posts : [];
  const authors = Array.from(new Set(rawPosts.map(p => p.autor || p.author).filter(Boolean)));

  return (
    <MainLayout>
      <div className="container mt-4">
        <BlogHeader />
        <div className="row mt-5">
          <main className="col-md-8">
            <h2 className="mb-4 fw-bold text-dark blog-section-title">Últimas Entradas</h2>
            {/* Pasamos selectedAuthor vía contexto del Outlet por si algún hijo lo necesita */}
            <Outlet context={{ selectedAuthor }} />
          </main>
          <aside className="col-md-4">
            <BlogSidebar
              authors={authors}
              selectedAuthor={selectedAuthor}
              onSelectAuthor={(a) => setSelectedAuthor(a)}
            />
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}

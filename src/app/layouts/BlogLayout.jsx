

import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";
import BlogHeader from "../../features/blog/components/BlogHeader.jsx";
import BlogSidebar from "../../features/blog/components/BlogSidebar.jsx";



export default function BlogLayout() {
  return (
    <MainLayout>
      <div className="container mt-4">
        <BlogHeader />
        <div className="row mt-4">
          <main className="col-md-8">
            <Outlet />
          </main>
          <aside className="col-md-4">
            <BlogSidebar />
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}

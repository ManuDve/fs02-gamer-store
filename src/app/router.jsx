import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import BlogLayout from "./layouts/BlogLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import Home from "../features/store/pages/Home.jsx";
import Products from "../features/store/pages/Products.jsx";
import ProductDetail from "../features/store/pages/ProductDetail.jsx";
import Cart from "../features/store/pages/Cart.jsx";

import BlogHome from "../features/blog/pages/BlogHome.jsx";
import BlogPost from "../features/blog/pages/BlogPost.jsx";

import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";

import AdminDashboard from "../features/admin/pages/Dashboard.jsx";
import AdminProducts from "../features/admin/pages/Products.jsx";

import NotFound from "../shared/pages/NotFound.jsx";

import { products } from "../assets/mocks/products.json"
import { blog_posts } from "../assets/mocks/blog_posts.json"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home products={products}/> },
      { path: "products", element: <Products products={products}/> },
  { path: "products/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
    ],
  },
  {
    path: "/blog",
    element: <BlogLayout />,
    children: [
      { index: true, element: <BlogHome posts={blog_posts}/> },
  { path: ":id", element: <BlogPost /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/admin", 
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <AdminProducts /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;

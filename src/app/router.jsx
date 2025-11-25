import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import BlogLayout from "./layouts/BlogLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "../features/store/pages/Home.jsx";
import Products from "../features/store/pages/Products.jsx";
import ProductDetail from "../features/store/pages/ProductDetail.jsx";
import Cart from "../features/store/pages/Cart.jsx";
import Contact from "../features/store/pages/Contact.jsx";
import Pay from "../features/store/pages/Pay.jsx";
import PaymentSuccess from "../features/store/pages/PaymentSuccess.jsx";
import PaymentError from "../features/store/pages/PaymentError.jsx";

import BlogHome from "../features/blog/pages/BlogHome.jsx";
import BlogPost from "../features/blog/pages/BlogPost.jsx";

import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";

import AdminDashboard from "../features/admin/pages/Dashboard.jsx";
import AdminProducts from "../features/admin/pages/Products.jsx";

import NotFound from "../shared/pages/NotFound.jsx";

import { products } from "../assets/mocks/products.json";
import { blog_posts } from "../assets/mocks/blog_posts.json";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home products={products} /> },
      { path: "products", element: <Products products={products} /> },
      { path: "products/:id", element: <ProductDetail /> },
      { path: "contact", element: <Contact /> },
      
      // Rutas protegidas (requieren login)
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "pay",
        element: (
          <ProtectedRoute>
            <Pay />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment-success",
        element: (
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment-error",
        element: (
          <ProtectedRoute>
            <PaymentError />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/blog",
    element: <BlogLayout />,
    children: [
      { index: true, element: <BlogHome posts={blog_posts} /> },
      { path: ":id", element: <BlogPost /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  // Rutas de ADMIN (requieren ROLE_ADMIN)
  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "products", element: <AdminProducts /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
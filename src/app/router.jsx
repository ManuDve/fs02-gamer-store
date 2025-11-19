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

import { blog_posts } from "../assets/mocks/blog_posts.json"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "contact", element: <Contact /> },
      { path: "pay", element: <Pay /> },
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "payment-error", element: <PaymentError /> },
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
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
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

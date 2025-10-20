
import Navbar from "../../shared/components/Navbar.jsx";
import Footer from "../../shared/components/Footer.jsx";
import { Outlet } from "react-router-dom";
import { CartProvider } from '../context/CartContext.jsx';


export default function MainLayout({ children }) {
  return (
    <CartProvider>
      <Navbar />
      <main className="min-vh-60">
        {children ? children : <Outlet />}
      </main>
      <Footer />
    </CartProvider>
  );
}

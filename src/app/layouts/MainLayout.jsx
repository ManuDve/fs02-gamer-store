
import Navbar from "../../shared/components/Navbar.jsx";
import Footer from "../../shared/components/Footer.jsx";
import { Outlet } from "react-router-dom";


export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-vh-100">
        {children ? children : <Outlet />}
      </main>
      <Footer />
    </>
  );
}

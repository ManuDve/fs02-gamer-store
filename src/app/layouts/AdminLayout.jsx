import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="d-flex">
      <aside className="bg-dark text-white p-3" style={{ width: 240, minHeight: '100vh' }}>
        <h4>Admin</h4>
        <ul className="nav flex-column">
          <li className="nav-item"><Link to="/admin" className="nav-link text-white">Dashboard</Link></li>
          <li className="nav-item"><Link to="/admin/products" className="nav-link text-white">Productos</Link></li>
        </ul>
      </aside>
      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}

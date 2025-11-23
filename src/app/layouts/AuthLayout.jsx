import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="p-4 bg-white shadow rounded" style={{ minWidth: 360 }}>
        <Outlet />
      </div>
    </div>
  );
}

import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import router from "./router.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

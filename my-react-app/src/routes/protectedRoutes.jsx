import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Javascript&jsx/context/context.jsx";

// Ruta protegida básica - solo requiere autenticación
export const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

// Ruta protegida por rol específico
export const RoleProtectedRoute = ({ requiredRoles }) => {
  const { token, role } = useAuth();

  // Si no está autenticado, redirige a login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si está autenticado pero no tiene el rol requerido, redirige a home
  if (requiredRoles && !requiredRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
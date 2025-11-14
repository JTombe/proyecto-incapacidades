import { Routes as RouterRoutes, Route } from "react-router-dom";
import { ProtectedRoute, RoleProtectedRoute } from "./protectedRoutes";
import Logout from "../login/logout";
import Login from "../login/Login";
import SignUpForm from "../signup/SignupForm";

const Routes = () => {
  return (
    <RouterRoutes>
      {/* Rutas públicas */}
      <Route path="/" element={<div>User Home Page</div>} />
      <Route path="/service" element={<div>Service Page</div>} />
      <Route path="/about-us" element={<div>About Us</div>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUpForm />} />

      {/* Rutas protegidas - ProtectedRoute se encarga de verificar el token */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<div>User Profile</div>} />
        <Route path="/logout" element={<Logout />} />
      </Route>

      {/* Rutas solo para Jefe */}
      <Route element={<RoleProtectedRoute requiredRoles={['jefe']} />}>
        <Route path="/admin" element={<div>Admin Panel - Jefe</div>} />
        <Route path="/reports" element={<div>Reports - Jefe</div>} />
      </Route>

      {/* Rutas para Jefe y Recepcionista */}
      <Route element={<RoleProtectedRoute requiredRoles={['jefe', 'recepcionista']} />}>
        <Route path="/employees" element={<div>Employees - Jefe/Recepcionista</div>} />
      </Route>

      {/* Rutas para Trabajador */}
      <Route element={<RoleProtectedRoute requiredRoles={['trabajador']} />}>
        <Route path="/my-incapacidades" element={<div>My Incapacidades - Trabajador</div>} />
      </Route>
    </RouterRoutes>
  );
};

export default Routes;

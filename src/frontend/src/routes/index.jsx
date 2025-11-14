import { Routes as RouterRoutes, Route } from "react-router-dom";
import { ProtectedRoute } from "./protectedRoutes";
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
    </RouterRoutes>
  );
};

export default Routes;

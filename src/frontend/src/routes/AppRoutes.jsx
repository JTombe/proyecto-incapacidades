import { Routes as RouterRoutes, Route } from "react-router-dom";
import { ProtectedRoute } from "./protectedRoutes";
import Logout from "../components/Logout";
import Login from "../components/Login";
import SignUpForm from "../components/SignupForm";
import RegistrarIncapacidad from "../components/Users/RegistrarIncapacidad";
import EstadoIncapacidades from "../components/Users/EstadoIncapacidades";
import ConsultarIncapacidades from "../components/Users/ConsultarIncapacidades";
import GestionIncapacidades from "../components/Users/GestionIncapacidades";
import HorariosEmpleados from "../components/Users/HorariosEmpleados";
import CrearEmpleado from "../components/Users/CrearEmpleado";

const AppRoutes = () => {
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
        {/* Empleado */}
        <Route path="/empleado/registrar" element={<RegistrarIncapacidad />} />
        <Route path="/empleado/estado" element={<EstadoIncapacidades />} />

        {/* Recepcionista */}
        <Route path="/recepcionista/consultar" element={<ConsultarIncapacidades />} />

        {/* Jefe de área */}
        <Route path="/jefe/horarios" element={<HorariosEmpleados />} />
        {/* Gestión de empleados (admin / gestor_humana) */}
        <Route path="/empleados/crear" element={<CrearEmpleado />} />
        {/* Gestión de incapacidades por Gestión Humana */}
        <Route path="/gestor/incapacidades" element={<GestionIncapacidades />} />
      </Route>
    </RouterRoutes>
  );
};

export default AppRoutes;

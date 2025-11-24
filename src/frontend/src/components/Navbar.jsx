import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, hasRole, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <nav className="app-navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">MiLogo</Link>

        {/* Colocar los botones de navegación justo a la derecha del logo */}
        <div className="navbar-links">
          {/* Enlaces para administración/gestión humana */}
          {isAuthenticated && (hasRole('admin') || hasRole('gestor_humana')) && (
            <>
              <Link to="/empleados/crear" className="nav-button">Crear Empleado</Link>
            </>
          )}

          {/* Enlaces para empleados */}
          {isAuthenticated && (hasRole('trabajador') || hasRole('empleado')) && (
            <>
              <Link to="/empleado/registrar" className="nav-button">Registrar Incapacidad</Link>
              <Link to="/empleado/estado" className="nav-button">Estado Incapacidades</Link>
            </>
          )}

          {/* Enlaces para recepcionista */}
          {isAuthenticated && hasRole('recepcionista') && (
            <>
              <Link to="/recepcionista/consultar" className="nav-button">Consultar Incapacidades</Link>
              <Link to="/empleado/registrar" className="nav-button">Registrar Incapacidad</Link>
            </>
          )}

          {/* Enlaces para jefe de área */}
          {isAuthenticated && hasRole('jefe') && (
            <>
              <Link to="/jefe/horarios" className="nav-button">Horarios Empleados</Link>
            </>
          )}
        </div>
      </div>

      <div className="navbar-right">
        {/* Si no está autenticado: mostrar Login/Signup a la derecha */}
        {!isAuthenticated && (
          <>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/signup" className="nav-button nav-button--primary">Signup</Link>
          </>
        )}

        {/* Si está autenticado: mostrar botón de logout en su lugar */}
        {isAuthenticated && (
          <>
            <button className="nav-button nav-button--danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

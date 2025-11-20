import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, hasRole } = useAuth();

  return (
    <nav className="app-navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">MiLogo</Link>
      </div>

      <div className="navbar-right">
        {/* Enlaces públicos */}
        {!isAuthenticated && (
          <>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/signup" className="nav-button nav-button--primary">Signup</Link>
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
    </nav>
  );
};

export default Navbar;

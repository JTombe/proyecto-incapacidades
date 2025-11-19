import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Navbar = () => {
  return (
    <nav className="app-navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">MiLogo</Link>
      </div>

      <div className="navbar-right">
        {/* Aquí irán los botones que dependan del tipo de usuario (ej: admin, user, guest) */}

        <Link to="/login" className="nav-button">Login</Link>
        <Link to="/signup" className="nav-button nav-button--primary">Signup</Link>
      </div>
    </nav>
  );
};

export default Navbar;

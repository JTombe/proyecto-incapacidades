import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, hasRole, logout, user } = useAuth();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

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
          {/* Build an array of nav items and collapse extras into a dropdown when there are many */}
          {(() => {
            const items = [];

            // Admin/gestor links
            if (isAuthenticated && (hasRole('admin') || hasRole('gestor_humana'))) {
              items.push({ to: '/empleados/crear', label: 'Crear Empleado' });
              items.push({ to: '/gestor/incapacidades', label: 'Gestion Incapacidades' });
              items.push({ to: '/empleado/registrar', label: 'Registrar Incapacidad' });
            }

            // Empleado links (also allow admin)
            if (isAuthenticated && (hasRole('admin') || hasRole('trabajador') || hasRole('empleado'))) {
              items.push({ to: '/empleado/estado', label: 'Estado Incapacidades' });
            }

            // Recepcionista links (also allow admin)
            if (isAuthenticated && (hasRole('admin') || hasRole('recepcionista'))) {
              items.push({ to: '/recepcionista/consultar', label: 'Consultar Incapacidades' });
              items.push({ to: '/empleado/registrar', label: 'Registrar Incapacidad' });
            }

            // Jefe links (also allow admin)
            if (isAuthenticated && (hasRole('admin') || hasRole('jefe'))) {
              items.push({ to: '/jefe/horarios', label: 'Horarios Empleados' });
            }

            // Remove duplicates by label+to
            const seen = new Set();
            const uniq = items.filter((it) => {
              const key = it.to + '|' + it.label;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });

            // If there are more than 4 items, show first 3 and collapse the rest into a "Más" dropdown
            const VISIBLE_LIMIT = 4;
            const visible = uniq.slice(0, VISIBLE_LIMIT);
            const extra = uniq.slice(VISIBLE_LIMIT);

            return (
              <NavItemsWithDropdown visible={visible} extra={extra} />
            );
          })()}
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

// Helper component placed at bottom to keep top component clean
const NavItemsWithDropdown = ({ visible, extra }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {visible.map((it) => (
        <Link key={it.to + it.label} to={it.to} className="nav-button">{it.label}</Link>
      ))}

      {extra && extra.length > 0 && (
        <div className="nav-dropdown">
          <button className="nav-button" onClick={() => setOpen((s) => !s)}>Más ▾</button>
          {open && (
            <div className="nav-dropdown-menu">
              {extra.map((it) => (
                <div key={it.to + it.label} className="nav-dropdown-item">
                  <Link to={it.to} className="nav-dropdown-link">{it.label}</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

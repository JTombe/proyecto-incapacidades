import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SignUpForm from '../signup/SignupForm'; // Asume que SignUpForm.jsx está en el mismo nivel
import Login from '../login/Login';
import Navbar from '../navbar/Navbar';
// importamos los demás componentes para que react router funcione

// Componente para la página de inicio o cualquier otra página con el botón
const HomePage = () => {
  const navigate = useNavigate();

  // Función para manejar el clic y redirigir
  const handleSignUpClick = () => {
    navigate('/signup'); 
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>¡Bienvenido a la Aplicación!</h1>
      <p>Aquí puedes empezar a gestionar tus incapacidades.</p>
      
      {/* EL BOTÓN CLAVE */}
      <button 
        onClick={handleSignUpClick} 
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Presiona para Registrarte
      </button>
    </div>
  );
};


// Componente principal: define las rutas
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Ruta principal (/) que carga el botón */}
        <Route path="/" element={<HomePage />} />
        
        {/* Ruta /signup que carga el formulario de registro */}
        <Route path="/signup" element={<SignUpForm />} />
  {/* Ruta /login que carga el formulario de acceso */}
  <Route path="/login" element={<Login />} />
        
        {/* Puedes añadir más rutas aquí, como /login, /dashboard, etc. */}
      </Routes>
    </Router>
  );
};

export default App;
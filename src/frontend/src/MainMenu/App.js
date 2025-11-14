import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from '../navbar/Navbar';
import { AuthProvider } from "../Javascript&jsx/context/context.jsx";
import Routes from '../routes/index.jsx';

// Componente principal: define las rutas
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes />
      </AuthProvider>
    </Router>
  );
};

export default App;
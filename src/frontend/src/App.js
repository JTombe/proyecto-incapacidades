import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from './components/Navbar';
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from './routes/AppRoutes';

// Componente principal: define las rutas
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
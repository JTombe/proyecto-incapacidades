import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

// Función para decodificar el JWT y extraer el rol
const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
};

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem("token"));
  
  // State para el rol del usuario
  const [role, setRole] = useState(null);

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
    
    // Decodificar el token y extraer el rol
    if (newToken) {
      const decoded = decodeToken(newToken);
      setRole(decoded?.role || null);
    } else {
      setRole(null);
    }
  };

  // Inicializar rol desde el token guardado
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      setRole(decoded?.role || null);
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      role,
      isAuthenticated: !!token,
      isJefe: role === 'jefe',
      isRecepcionista: role === 'recepcionista',
      isTrabajador: role === 'trabajador',
    }),
    [token, role]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, AuthContext };
export default AuthProvider;
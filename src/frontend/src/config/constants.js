// Constantes de configuración de la aplicación
// La URL base del backend puede sobreescribirse con la variable de entorno
// REACT_APP_API_URL (por ejemplo en .env local).

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5192/swagger/index.html';

export const ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/api/auth/register`,
  EMPLEADOS: `${API_BASE_URL}/api/empleados`,
  INCAPACIDADES: `${API_BASE_URL}/api/incapacidades`,
  USERS: `${API_BASE_URL}/api/users`,
};

export const ROLES = {
  JEFE: 'jefe',
  RECEPCIONISTA: 'recepcionista',
  TRABAJADOR: 'trabajador',
  USUARIO: 'usuario',
};

export default {
  API_BASE_URL,
  ENDPOINTS,
  ROLES,
};

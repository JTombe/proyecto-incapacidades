import axios from 'axios';
import { ENDPOINTS } from '../config/constants';

// Obtener todos los usuarios (permite elegir un usuario ya creado)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${ENDPOINTS.USERS}`);
    // El controlador devuelve array de UserDto
    return response.data;
  } catch (err) {
    if (err.response && err.response.data) {
      throw new Error(err.response.data?.message || JSON.stringify(err.response.data));
    }
    throw err;
  }
};

// Crear empleado a partir de CrearEmpleadoRequest
// request: { NombreCompleto, DocumentoIdentidad, CorreoElectronico?, Telefono?, Cargo, FechaIngreso }
export const crearEmpleado = async (request) => {
  try {
    const response = await axios.post(`${ENDPOINTS.EMPLEADOS}`, request);
    if (response.data && response.data.success) return response.data.data;
    // Si la API no envuelve en ApiResponse, devolver el body
    return response.data;
  } catch (err) {
    if (err.response && err.response.data) {
      const msg = err.response.data?.message || JSON.stringify(err.response.data);
      throw new Error(msg);
    }
    throw err;
  }
};

export default { getAllUsers, crearEmpleado };

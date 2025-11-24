import axios from 'axios';
import { ENDPOINTS } from '../config/constants';

// Registrar una incapacidad usando multipart/form-data.
// data: {
//   empleadoId: number,
//   empleadoNombre?: string,
//   tipo: number, // 1..6 (puede mapearse a texto en UI más tarde)
//   fechaInicio: string|Date,
//   dias?: number,
//   diagnostico: string,
//   EPS: string,
//   tiposDocumentos?: number[], // enum values
//   documentos?: File[]
// }
export const registrarIncapacidad = async (data) => {
	try {
		const form = new FormData();

		form.append('EmpleadoId', data.empleadoId);
		if (data.empleadoNombre) form.append('EmpleadoNombre', data.empleadoNombre);
		if (data.tipo !== undefined && data.tipo !== null) form.append('Tipo', data.tipo);
		if (data.fechaInicio) form.append('FechaInicio', new Date(data.fechaInicio).toISOString());
		// Dias en el backend tiene rango 1..365; si no llega, enviamos 1 por defecto
		form.append('Dias', data.dias ? data.dias : 1);
		if (data.diagnostico) form.append('Diagnostico', data.diagnostico);
		if (data.EPS) form.append('EPS', data.EPS);

		if (Array.isArray(data.tiposDocumentos)) {
			data.tiposDocumentos.forEach((t) => form.append('TiposDocumentos', t));
		}

		if (Array.isArray(data.documentos)) {
			data.documentos.forEach((file) => form.append('Documentos', file));
		}

		const response = await axios.post(`${ENDPOINTS.INCAPACIDADES}/registrar`, form, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});

		// La API envuelve la respuesta en ApiResponse<T>
		if (response.data && response.data.success) {
			return response.data.data; // devuelve la Incapacidad creada
		}

		throw new Error(response.data?.message || 'Error registrando incapacidad');
	} catch (err) {
		if (err.response && err.response.data) {
			const msg = err.response.data?.message || JSON.stringify(err.response.data);
			throw new Error(msg);
		}
		throw err;
	}
};

// Obtener usuario por id (usa endpoint /api/users/{id}).
export const getUserById = async (id) => {
	try {
		const response = await axios.get(`${ENDPOINTS.USERS}/${id}`);
		return response.data; // puede ser UserDto o ApiResponse según controlador
	} catch (err) {
		if (err.response && err.response.data) {
			throw new Error(err.response.data?.message || JSON.stringify(err.response.data));
		}
		throw err;
	}
};

// Obtener incapacidades por empleado
// retorna un arreglo de IncapacidadResponse u lanza Error
export const getIncapacidadesByEmpleado = async (empleadoId, desde, hasta) => {
	try {
		const params = {};
		if (desde) params.desde = new Date(desde).toISOString();
		if (hasta) params.hasta = new Date(hasta).toISOString();

		const query = new URLSearchParams(params).toString();
		const url = `${ENDPOINTS.INCAPACIDADES}/empleado/${empleadoId}` + (query ? `?${query}` : '');

		const response = await axios.get(url);
		if (response.data && response.data.success) return response.data.data;
		throw new Error(response.data?.message || 'Error al obtener incapacidades');
	} catch (err) {
		if (err.response && err.response.data) {
			throw new Error(err.response.data?.message || JSON.stringify(err.response.data));
		}
		throw err;
	}
};

// Obtener todas las incapacidades (opcional: filtrar por estado, desde, hasta)
export const getAllIncapacidades = async (estado, desde, hasta) => {
	try {
		const params = {};
		if (estado !== undefined && estado !== null) params.estado = estado;
		if (desde) params.desde = new Date(desde).toISOString();
		if (hasta) params.hasta = new Date(hasta).toISOString();

		const query = new URLSearchParams(params).toString();
		const url = `${ENDPOINTS.INCAPACIDADES}` + (query ? `?${query}` : '');

		const response = await axios.get(url);
		if (response.data && response.data.success) return response.data.data;
		throw new Error(response.data?.message || 'Error al obtener incapacidades');
	} catch (err) {
		if (err.response && err.response.data) {
			throw new Error(err.response.data?.message || JSON.stringify(err.response.data));
		}
		throw err;
	}
};

// Actualizar estado de una incapacidad (body: { estado: <number> })
export const actualizarEstado = async (id, estado) => {
	try {
		await axios.put(`${ENDPOINTS.INCAPACIDADES}/${id}/estado`, { estado });
		return true;
	} catch (err) {
		if (err.response && err.response.data) {
			throw new Error(err.response.data?.message || JSON.stringify(err.response.data));
		}
		throw err;
	}
};

export default {
	registrarIncapacidad,
	getUserById,
	getIncapacidadesByEmpleado,
  getAllIncapacidades,
  actualizarEstado,
};

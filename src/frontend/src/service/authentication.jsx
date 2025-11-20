import { ENDPOINTS } from '../config/constants';
import axios from "axios";
// Login: realiza petición a la API y retorna { token, user, roles }
export const login = async (correo, contrasena) => {
	try {
		const response = await axios.post(ENDPOINTS.AUTH_LOGIN, {
			email: correo,
			password: contrasena,
		});
		// Espera respuesta tipo { success, token, user }
		if (response.data && response.data.success && response.data.token) {
			return {
				token: response.data.token,
				user: response.data.user,
				roles: response.data.user?.roles || [],
			};
		} else {
			throw new Error(response.data?.message || 'Credenciales incorrectas');
		}
	} catch (err) {
		throw err;
	}
};


// Manejo de token en localStorage y axios
export const setAuthToken = (token) => {
	if (token) {
		axios.defaults.headers.common["Authorization"] = "Bearer " + token;
		localStorage.setItem('token', token);
	} else {
		delete axios.defaults.headers.common["Authorization"];
		localStorage.removeItem('token');
	}
};

export const getAuthToken = () => {
	return localStorage.getItem("token");
};

// Logout: limpia token y cabeceras
export const logoutService = () => {
	setAuthToken(null);
};

// Decodifica payload del JWT y devuelve objeto
export const decodeJwt = (token) => {
	try {
		if (!token) return null;
		const parts = token.split('.');
		if (parts.length < 2) return null;
		const base64Url = parts[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);
		return JSON.parse(jsonPayload);
	} catch (e) {
		console.error('decodeJwt error', e);
		return null;
	}
};

// Extrae usuario y roles del token según el backend (soporta 'role' o 'roles' o claim de esquema)
export const getUserFromToken = (token) => {
	const payload = decodeJwt(token);
	if (!payload) return null;

	// common claim keys: sub, name, email, role (string) or roles (array)
	const user = {
		id: payload.sub || payload.nameid || null,
		name: payload.name || payload.unique_name || null,
		email: payload.email || null,
	};

	let roles = null;
	if (payload.roles) roles = payload.roles;
	else if (payload.role) roles = Array.isArray(payload.role) ? payload.role : [payload.role];
	else if (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
		const r = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
		roles = Array.isArray(r) ? r : [r];
	}

	return { user, roles };
};

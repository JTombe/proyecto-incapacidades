import axios from 'axios';
import { ENDPOINTS } from '../config/constants';

export const getUser = async (id) => {
  try {
    const response = await axios.get(`${ENDPOINTS.USERS}/${id}`);
    if (response.data && response.data.success !== false) return response.data; // caller may expect ApiResponse or raw
    return response.data;
  } catch (err) {
    if (err.response && err.response.data) throw new Error(err.response.data?.message || JSON.stringify(err.response.data));
    throw err;
  }
};

export const updateUser = async (id, payload) => {
  try {
    // payload: { firstName?, lastName?, email? }
    await axios.put(`${ENDPOINTS.USERS}/${id}`, payload);
    return true;
  } catch (err) {
    if (err.response && err.response.data) throw new Error(err.response.data?.message || JSON.stringify(err.response.data));
    throw err;
  }
};

export const changePassword = async (id, currentPassword, newPassword) => {
  try {
    await axios.post(`${ENDPOINTS.USERS}/${id}/change-password`, {
      currentPassword,
      newPassword,
    });
    return true;
  } catch (err) {
    if (err.response && err.response.data) throw new Error(err.response.data?.message || JSON.stringify(err.response.data));
    throw err;
  }
};

export default { getUser, updateUser, changePassword };

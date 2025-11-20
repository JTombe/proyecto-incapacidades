import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from '../service/authentication';

const Login = () => {
  const [formData, setFormData] = useState({ correo: '', contrasena: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  // Elimina el login simulado

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const temp = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo || !emailRegex.test(formData.correo)) temp.correo = 'Ingrese un correo válido.';
    if (!formData.contrasena || formData.contrasena.length < 6) temp.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      const result = await loginService(formData.correo, formData.contrasena);
      setToken(result.token);
      navigate('/');
    } catch (err) {
      setErrors({ general: err.message || 'Error de autenticación' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {errors.general && <p className="login-error">{errors.general}</p>}
        <div className="login-group">
          <label htmlFor="correo">Correo:</label>
          <input
            id="correo"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            className="login-input"
          />
          {errors.correo && <p className="login-error">{errors.correo}</p>}
        </div>

        <div className="login-group">
          <label htmlFor="contrasena">Contraseña:</label>
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            value={formData.contrasena}
            onChange={handleChange}
            className="login-input"
          />
          {errors.contrasena && <p className="login-error">{errors.contrasena}</p>}
        </div>

        {/* Placeholder para integración con sistemas de autenticación (ej: OAuth, remember me) */}

        <button type="submit" className="login-button" disabled={isSubmitting}>
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;

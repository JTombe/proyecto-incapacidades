import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';



const Login = () => {
  const [formData, setFormData] = useState({ correo: '', contrasena: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setToken("this is a test token");
    navigate("/", { replace: true });
  };

  setTimeout(() => {
    handleLogin();
  }, 3 * 1000);


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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    // Aquí iría la llamada a la API de autenticación (fetch/axios).
    // Simulamos éxito o fallo con setTimeout.
    setTimeout(() => {
      setIsSubmitting(false);
      // En una app real: si auth ok -> guardar token / contexto y redirigir
      // Por ahora redirigimos a la home como ejemplo
      navigate('/');
    }, 1200);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
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

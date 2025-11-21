import React, { useState } from 'react';
import { register, setAuthToken } from '../service/authentication';
import '../index.css';

const SignUpForm = () => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  // Estado para manejar los errores de validación
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Manejador de cambios: actualiza el estado cuando el usuario escribe
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Limpiar el error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // 2. Función de validación: verifica los campos antes de enviar
  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.username) tempErrors.username = 'El nombre de usuario es obligatorio.';
    if (!formData.firstName) tempErrors.firstName = 'El nombre es obligatorio.';
    if (!formData.lastName) tempErrors.lastName = 'El apellido es obligatorio.';

    if (!formData.correo || !emailRegex.test(formData.correo)) {
      tempErrors.correo = 'Ingrese un correo electrónico válido.';
    }

    if (formData.contrasena.length < 6) {
      tempErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
    }
    
    if (formData.contrasena !== formData.confirmarContrasena) {
      tempErrors.confirmarContrasena = 'Las contraseñas no coinciden.';
    }

    setErrors(tempErrors);
    // Retorna true si no hay errores
    return Object.keys(tempErrors).length === 0;
  };

  // 3. Manejador de envío: se ejecuta al hacer clic en el botón
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const result = await register(
          formData.username,
          formData.correo,
          formData.contrasena,
          formData.firstName,
          formData.lastName
        );

        if (result && result.token) {
          // Guardar token y establecer cabecera por defecto
          setAuthToken(result.token);
          alert('Registro exitoso');
          // Opcional: redirigir o actualizar UI
        } else {
          alert('Registro completado, pero no se recibió token');
        }
      } catch (err) {
        const message = err?.response?.data?.message || err.message || 'Error en el registro';
        alert(message);
      } finally {
        setIsSubmitting(false);
      }

    } else {
      console.log('Errores de validación:', errors);
    }
  };

  return (
    <div className="signup-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="signup-form">

        {/* Campo: Username */}
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
        </div>

        {/* Campo: Nombre */}
        <div className="form-group">
          <label htmlFor="firstName">Nombre:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="form-input"
          />
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        </div>

        {/* Campo: Apellido */}
        <div className="form-group">
          <label htmlFor="lastName">Apellido:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="form-input"
          />
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        </div>

        {/* Campo: Correo Electrónico */}
        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="form-input"
          />
          {errors.correo && <p className="error-message">{errors.correo}</p>}
        </div>

        {/* Campo: Contraseña */}
        <div className="form-group">
          <label htmlFor="contrasena">Contraseña:</label>
          <input
            type="password"
            id="contrasena"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            className="form-input"
          />
          {errors.contrasena && <p className="error-message">{errors.contrasena}</p>}
        </div>

        {/* Campo: Confirmar Contraseña (Importante para seguridad) */}
        <div className="form-group">
          <label htmlFor="confirmarContrasena">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmarContrasena"
            name="confirmarContrasena"
            value={formData.confirmarContrasena}
            onChange={handleChange}
            className="form-input"
          />
          {errors.confirmarContrasena && <p className="error-message">{errors.confirmarContrasena}</p>}
        </div>

        {/* Botón de Envío */}
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;


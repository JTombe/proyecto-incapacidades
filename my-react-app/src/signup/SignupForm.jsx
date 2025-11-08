import React, { useState } from 'react';
import '../css/SignupForm.css';

const SignUpForm = () => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    numeroId: '',
    dependencia: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '', // Se añade para verificación
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
    
    if (!formData.nombreCompleto) tempErrors.nombreCompleto = 'El nombre completo es obligatorio.';
    if (!formData.numeroId) tempErrors.numeroId = 'El número de identificación es obligatorio.';
    if (!formData.dependencia) tempErrors.dependencia = 'La dependencia es obligatoria.';
    
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      console.log('Datos de registro válidos:', {
        nombreCompleto: formData.nombreCompleto,
        numeroId: formData.numeroId,
        dependencia: formData.dependencia,
        correo: formData.correo,
        // En una aplicación real, NUNCA envíes la contraseña en texto plano, 
        // ¡debe ser hasheada en el backend!
        contrasena: formData.contrasena, 
      });

      // Aquí iría la llamada a la API (fetch/axios) para enviar los datos al servidor.
      setTimeout(() => {
        alert('Registro exitoso (simulado)!');
        setIsSubmitting(false);
        // Opcional: Redirigir al usuario
      }, 1500);

    } else {
      console.log('Errores de validación:', errors);
    }
  };

  return (
    <div className="signup-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        
        {/* Campo: Nombre Completo */}
        <div className="form-group">
          <label htmlFor="nombreCompleto">Nombre Completo:</label>
          <input
            type="text"
            id="nombreCompleto"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            className="form-input"
          />
          {errors.nombreCompleto && <p className="error-message">{errors.nombreCompleto}</p>}
        </div>

        {/* Campo: Número de ID */}
        <div className="form-group">
          <label htmlFor="numeroId">Número de Identificación:</label>
          <input
            type="text"
            id="numeroId"
            name="numeroId"
            value={formData.numeroId}
            onChange={handleChange}
            className="form-input"
          />
          {errors.numeroId && <p className="error-message">{errors.numeroId}</p>}
        </div>

        {/* Campo: Dependencia */}
        <div className="form-group">
          <label htmlFor="dependencia">Dependencia:</label>
          <input
            type="text"
            id="dependencia"
            name="dependencia"
            value={formData.dependencia}
            onChange={handleChange}
            className="form-input"
          />
          {errors.dependencia && <p className="error-message">{errors.dependencia}</p>}
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


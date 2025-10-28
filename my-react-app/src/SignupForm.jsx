import React, { useState } from 'react';

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
    <div style={styles.container}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* Campo: Nombre Completo */}
        <div style={styles.group}>
          <label htmlFor="nombreCompleto">Nombre Completo:</label>
          <input
            type="text"
            id="nombreCompleto"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.nombreCompleto && <p style={styles.error}>{errors.nombreCompleto}</p>}
        </div>

        {/* Campo: Número de ID */}
        <div style={styles.group}>
          <label htmlFor="numeroId">Número de Identificación:</label>
          <input
            type="text"
            id="numeroId"
            name="numeroId"
            value={formData.numeroId}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.numeroId && <p style={styles.error}>{errors.numeroId}</p>}
        </div>

        {/* Campo: Dependencia */}
        <div style={styles.group}>
          <label htmlFor="dependencia">Dependencia:</label>
          <input
            type="text"
            id="dependencia"
            name="dependencia"
            value={formData.dependencia}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.dependencia && <p style={styles.error}>{errors.dependencia}</p>}
        </div>

        {/* Campo: Correo Electrónico */}
        <div style={styles.group}>
          <label htmlFor="correo">Correo Electrónico:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.correo && <p style={styles.error}>{errors.correo}</p>}
        </div>

        {/* Campo: Contraseña */}
        <div style={styles.group}>
          <label htmlFor="contrasena">Contraseña:</label>
          <input
            type="password"
            id="contrasena"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.contrasena && <p style={styles.error}>{errors.contrasena}</p>}
        </div>

        {/* Campo: Confirmar Contraseña (Importante para seguridad) */}
        <div style={styles.group}>
          <label htmlFor="confirmarContrasena">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmarContrasena"
            name="confirmarContrasena"
            value={formData.confirmarContrasena}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.confirmarContrasena && <p style={styles.error}>{errors.confirmarContrasena}</p>}
        </div>

        {/* Botón de Envío */}
        <button type="submit" disabled={isSubmitting} style={styles.button}>
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;

// Estilos básicos para el ejemplo (puedes usar CSS/Tailwind/Styled-Components en su lugar)
const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  group: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  error: {
    color: 'red',
    fontSize: '0.85em',
    marginTop: '5px',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  }
};
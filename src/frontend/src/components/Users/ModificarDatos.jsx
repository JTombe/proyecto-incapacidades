import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUser, updateUser } from '../../service/User';

const ModificarDatos = () => {
  const { isAuthenticated, user, setToken } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      if (!isAuthenticated || !user?.id) return;
      setLoading(true);
      try {
        const res = await getUser(Number(user.id));
        // UsersController returns UserDto directly (not wrapped)
        const data = res?.data ?? res;
        setForm({ firstName: data.firstName || '', lastName: data.lastName || '', email: data.email || '' });
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      if (!user?.id) throw new Error('Usuario no autenticado');
      await updateUser(Number(user.id), { firstName: form.firstName, lastName: form.lastName, email: form.email });
      setMessage('Datos actualizados correctamente');
      // optionally refresh token/user info by re-parsing token if needed
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return <div className="registrar-container"><p className="error-message-inline">Inicia sesión para modificar datos.</p></div>;

  return (
    <div className="registrar-container">
      <h2>Modificar mis datos</h2>
      {loading && <p>Cargando...</p>}
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message-inline">{error}</div>}

      <form className="registrar-form" onSubmit={handleSubmit}>
        <div className="registrar-group">
          <label>Nombre</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} className="registrar-input" />
        </div>

        <div className="registrar-group">
          <label>Apellido</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} className="registrar-input" />
        </div>

        <div className="registrar-group">
          <label>Correo electrónico</label>
          <input name="email" value={form.email} onChange={handleChange} className="registrar-input" />
        </div>

        <div className="registrar-actions">
          <button type="submit" className="registrar-submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
        </div>
      </form>
    </div>
  );
};

export default ModificarDatos;

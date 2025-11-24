import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { changePassword } from '../../service/User';

const CambiarContrasena = () => {
  const { isAuthenticated, user } = useAuth();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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
      if (!isAuthenticated || !user?.id) throw new Error('Usuario no autenticado');
      if (!form.current || !form.next) throw new Error('Rellena los campos');
      if (form.next.length < 6) throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
      if (form.next !== form.confirm) throw new Error('La contraseña nueva y la confirmación no coinciden');

      await changePassword(Number(user.id), form.current, form.next);
      setMessage('Contraseña actualizada correctamente');
      setForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return <div className="registrar-container"><p className="error-message-inline">Inicia sesión para cambiar tu contraseña.</p></div>;

  return (
    <div className="registrar-container">
      <h2>Cambiar contraseña</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message-inline">{error}</div>}

      <form className="registrar-form" onSubmit={handleSubmit}>
        <div className="registrar-group">
          <label>Contraseña actual</label>
          <input type="password" name="current" value={form.current} onChange={handleChange} className="registrar-input" />
        </div>

        <div className="registrar-group">
          <label>Nueva contraseña</label>
          <input type="password" name="next" value={form.next} onChange={handleChange} className="registrar-input" />
        </div>

        <div className="registrar-group">
          <label>Confirmar nueva contraseña</label>
          <input type="password" name="confirm" value={form.confirm} onChange={handleChange} className="registrar-input" />
        </div>

        <div className="registrar-actions">
          <button type="submit" className="registrar-submit" disabled={saving}>{saving ? 'Cambiando...' : 'Cambiar contraseña'}</button>
        </div>
      </form>
    </div>
  );
};

export default CambiarContrasena;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllUsers, crearEmpleado } from '../../service/RegistroEmpleados';

const CrearEmpleado = () => {
  const { isAuthenticated, hasRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [form, setForm] = useState({
    NombreCompleto: '',
    DocumentoIdentidad: '',
    CorreoElectronico: '',
    Telefono: '',
    Cargo: '',
    FechaIngreso: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Sólo admin o gestor_humana pueden usar esta pantalla
  const allowed = isAuthenticated && (hasRole('admin') || hasRole('gestor_humana'));

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    if (allowed) fetchUsers();
  }, [allowed]);

  // Cuando se selecciona un usuario existente, autocompletar nombre y correo
  useEffect(() => {
    if (!selectedUserId) {
      setForm((s) => ({ ...s, NombreCompleto: '', CorreoElectronico: '' }));
      return;
    }
    const u = users.find((x) => String(x.id) === String(selectedUserId));
    if (u) {
      const nombre = [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.username || '';
      setForm((s) => ({ ...s, NombreCompleto: nombre, CorreoElectronico: u.email || '' }));
    }
  }, [selectedUserId, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!allowed) {
      setError('No autorizado');
      return;
    }

    if (!selectedUserId) {
      setError('Selecciona un usuario existente para crear el empleado');
      return;
    }

    if (!form.DocumentoIdentidad) {
      setError('El número de identificación es obligatorio');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        NombreCompleto: form.NombreCompleto,
        DocumentoIdentidad: form.DocumentoIdentidad,
        CorreoElectronico: form.CorreoElectronico || undefined,
        Telefono: form.Telefono || undefined,
        Cargo: form.Cargo || undefined,
        FechaIngreso: form.FechaIngreso ? new Date(form.FechaIngreso).toISOString() : new Date().toISOString(),
      };

      const result = await crearEmpleado(payload);
      setMessage('Empleado creado correctamente. ID: ' + (result?.id ?? '—'));
      // reset form (keep selected user)
      setForm((s) => ({ ...s, DocumentoIdentidad: '', Telefono: '', Cargo: '' }));
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return <div className="registrar-container"><p className="error-message-inline">Inicia sesión para crear empleados.</p></div>;
  if (!allowed) return <div className="registrar-container"><p className="error-message-inline">No tienes permisos para crear empleados.</p></div>;

  return (
    <div className="registrar-container">
      <h2>Crear Empleado desde Usuario Existente</h2>

      {loading && <p>Cargando usuarios...</p>}
      {error && <div className="error-message-inline">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      {!loading && (
        <form className="registrar-form" onSubmit={handleSubmit}>
          <div className="registrar-group">
            <label>Usuario existente</label>
            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="registrar-select">
              <option value="">-- Selecciona un usuario --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.email} — {u.username}</option>
              ))}
            </select>
          </div>

          <div className="registrar-group">
            <label>Nombre completo (autocompleta)</label>
            <input name="NombreCompleto" value={form.NombreCompleto} onChange={handleChange} className="registrar-input" />
          </div>

          <div className="registrar-group">
            <label>Correo electrónico</label>
            <input name="CorreoElectronico" value={form.CorreoElectronico} onChange={handleChange} className="registrar-input" />
          </div>

          <div className="registrar-group">
            <label>Número de identificación</label>
            <input name="DocumentoIdentidad" value={form.DocumentoIdentidad} onChange={handleChange} className="registrar-input" required />
          </div>

          <div className="registrar-group">
            <label>Teléfono</label>
            <input name="Telefono" value={form.Telefono} onChange={handleChange} className="registrar-input" />
          </div>

          <div className="registrar-group">
            <label>Cargo</label>
            <input name="Cargo" value={form.Cargo} onChange={handleChange} className="registrar-input" />
          </div>

          <div className="registrar-group">
            <label>Fecha de ingreso</label>
            <input type="date" name="FechaIngreso" value={form.FechaIngreso} onChange={handleChange} className="registrar-input" />
          </div>

          <div className="registrar-actions">
            <button type="submit" className="registrar-submit" disabled={saving}>
              {saving ? 'Creando...' : 'Crear empleado'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CrearEmpleado;

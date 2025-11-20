import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { registrarIncapacidad } from '../../service/Incapacidades';

const RegistrarIncapacidad = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    tipo: 1,
    fechaInicio: new Date().toISOString().slice(0, 10),
    dias: 1,
    diagnostico: '',
    EPS: '',
    documentos: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setForm((s) => ({ ...s, documentos: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      if (!user || !user.id) throw new Error('Usuario no autenticado');

      const payload = {
        empleadoId: Number(user.id),
        empleadoNombre: user.name || undefined,
        tipo: Number(form.tipo),
        fechaInicio: form.fechaInicio,
        dias: form.dias ? Number(form.dias) : undefined,
        diagnostico: form.diagnostico,
        EPS: form.EPS,
        tiposDocumentos: undefined,
        documentos: form.documentos
      };

      const result = await registrarIncapacidad(payload);
      setMessage('Incapacidad registrada correctamente. ID: ' + (result?.id ?? '—'));
      setForm({ tipo: 1, fechaInicio: new Date().toISOString().slice(0, 10), dias: 1, diagnostico: '', EPS: '', documentos: [] });
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 720 }}>
      <h2>Registrar Incapacidad</h2>

      {!user && <p style={{ color: 'orange' }}>No autenticado. Inicia sesión para registrar una incapacidad.</p>}

      {message && <div style={{ color: 'green', marginBottom: 8 }}>{message}</div>}
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Tipo (1-6): </label>
          <select name="tipo" value={form.tipo} onChange={handleChange}>
            <option value={1}>Maternidad</option>
            <option value={2}>Paternidad</option>
            <option value={3}>Enfermedad general</option>
            <option value={4}>Accidente en el trabajo</option>
            <option value={5}>Accidente externo al trabajo</option>
            <option value={6}>Otro</option>
          </select>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Fecha inicio: </label>
          <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Días: </label>
          <input type="number" min={1} max={365} name="dias" value={form.dias} onChange={handleChange} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Diagnóstico: </label>
          <input type="text" name="diagnostico" value={form.diagnostico} onChange={handleChange} required />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>EPS: </label>
          <input type="text" name="EPS" value={form.EPS} onChange={handleChange} required />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Documentos: </label>
          <input type="file" multiple onChange={handleFiles} />
        </div>

        <div>
          <button type="submit" disabled={isSubmitting || !user}>
            {isSubmitting ? 'Registrando...' : 'Registrar incapacidad'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarIncapacidad;

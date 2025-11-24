import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllIncapacidades, actualizarEstado } from '../../service/Incapacidades';

const ESTADO_MAP = {
  1: 'Enviada',
  2: 'Recibida',
  3: 'Equivocada',
  4: 'Radicando',
  5: 'Aceptado',
  6: 'Finalizado'
};

// Estados que el gestor puede ver según requerimiento
const VISIBLE_ESTADOS = [3, 4, 5, 6];

const GestionIncapacidades = () => {
  const { isAuthenticated, hasRole } = useAuth();
  const allowed = isAuthenticated && (hasRole('gestor_humana') || hasRole('admin'));

  const [estadoFiltro, setEstadoFiltro] = useState(''); // '' = todos
  const [incapacidades, setIncapacidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const estado = estadoFiltro === '' ? undefined : Number(estadoFiltro);
      const data = await getAllIncapacidades(estado);
      setIncapacidades(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!allowed) return;
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, estadoFiltro]);

  const handleCambioEstado = async (inc, nuevoEstado) => {
    try {
      await actualizarEstado(inc.id, nuevoEstado);
      // actualizar en memoria para evitar reconsulta pesada
      setIncapacidades((prev) => prev.map((p) => (p.id === inc.id ? { ...p, estado: nuevoEstado } : p)));
    } catch (err) {
      setError(err.message || String(err));
    }
  };

  if (!isAuthenticated) return <div className="registrar-container"><p className="error-message-inline">Inicia sesión para ver incapacidades.</p></div>;
  if (!allowed) return <div className="registrar-container"><p className="error-message-inline">No tienes permisos para ver esta pantalla.</p></div>;

  return (
    <div className="registrar-container">
      <h2>Gestión de Incapacidades</h2>

      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Filtrar por estado:</label>
        <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
          <option value="">-- Todos (Equivocada / Radicando / Aceptado / Finalizado) --</option>
          {VISIBLE_ESTADOS.map((s) => (
            <option key={s} value={s}>{ESTADO_MAP[s] ?? s}</option>
          ))}
        </select>
        <button style={{ marginLeft: 8 }} onClick={fetch}>Refrescar</button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <div className="error-message-inline">{error}</div>}

      {!loading && (
        <div>
          {incapacidades.length === 0 && <p>No hay incapacidades para el filtro seleccionado.</p>}

          {incapacidades.length > 0 && (
            <div className="estado-table-wrap">
              <table className="estado-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Empleado</th>
                    <th>Tipo</th>
                    <th>Fecha inicio</th>
                    <th>Días</th>
                    <th>Diagnóstico</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {incapacidades.map((inc) => (
                    <tr key={inc.id}>
                      <td>{inc.id}</td>
                      <td>{inc.empleadoNombre ?? inc.empleadoId}</td>
                      <td>{inc.tipo}</td>
                      <td>{inc.fechaInicio ? new Date(inc.fechaInicio).toLocaleDateString() : ''}</td>
                      <td>{inc.dias}</td>
                      <td>{inc.diagnostico}</td>
                      <td>
                        <span className={`estado-badge estado-badge--${(ESTADO_MAP[inc.estado] || 'otro').toLowerCase().replace(/\s+/g,'-')}`}>
                          {ESTADO_MAP[inc.estado] ?? inc.estado}
                        </span>
                      </td>
                      <td>
                        {/* Permitir solo transiciones Radicando(4)->Aceptado(5) y Aceptado(5)->Finalizado(6) */}
                        {Number(inc.estado) === 4 && (
                          <button onClick={() => handleCambioEstado(inc, 5)}>Aceptar</button>
                        )}

                        {Number(inc.estado) === 5 && (
                          <button onClick={() => handleCambioEstado(inc, 6)}>Finalizar</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GestionIncapacidades;

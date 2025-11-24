import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllIncapacidades, actualizarEstado, getIncapacidadById, descargarArchivo } from '../../service/Incapacidades';

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
// Estados que el gestor puede controlar (solo estos deben aparecer en el selector)
const CONTROLABLE_ESTADOS = [4, 5, 6];

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

  const handleCambioEstadoConConfirm = async (inc, nuevoEstado) => {
    // no permitir cambios si ya está finalizada
    if (Number(inc.estado) === 6) {
      setError('No se puede modificar una incapacidad que ya está finalizada.');
      return;
    }

    // manejar confirmación mediante modal: si es Finalizado, abrimos modal externo
    if (Number(nuevoEstado) === 6) {
      // abrir modal de confirmación
      setPendingChange({ inc, nuevoEstado });
      setConfirmOpen(true);
      return;
    }

    await handleCambioEstado(inc, nuevoEstado);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);

  const applyPendingChange = async () => {
    if (!pendingChange) return;
    try {
      await handleCambioEstado(pendingChange.inc, pendingChange.nuevoEstado);
    } finally {
      setPendingChange(null);
      setConfirmOpen(false);
    }
  };

  const cancelPendingChange = () => {
    setPendingChange(null);
    setConfirmOpen(false);
  };

  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const openDetalle = async (inc) => {
    setDetailLoading(true);
    setSelected(null);
    try {
      const full = await getIncapacidadById(inc.id);
      setSelected(full);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetalle = () => setSelected(null);

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
                        {Number(inc.estado) === 6 ? (
                          <span className="estado-badge estado-badge--finalizado">Finalizada</span>
                        ) : (
                          // Sólo permitir editar si el estado actual es Radicando(4) o Aceptado(5)
                          (Number(inc.estado) === 4 || Number(inc.estado) === 5) ? (
                            <select
                              value={inc.estado}
                              onChange={(e) => handleCambioEstadoConConfirm(inc, Number(e.target.value))}
                            >
                              <option value="">-- Cambiar a --</option>
                              {CONTROLABLE_ESTADOS.map((k) => (
                                <option key={k} value={k}>{ESTADO_MAP[k] ?? k}</option>
                              ))}
                            </select>
                          ) : (
                            // Si no está en estados editables, mostrar sólo badge (no editable)
                            <span className={`estado-badge estado-badge--${(ESTADO_MAP[inc.estado] || 'otro').toLowerCase().replace(/\s+/g,'-')}`}>
                              {ESTADO_MAP[inc.estado] ?? inc.estado}
                            </span>
                          )
                        )}
                        <div style={{ marginTop: 6 }}>
                          <button onClick={() => openDetalle(inc)}>Ver archivos</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selected && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Incapacidad: {selected.id}</h3>
            {detailLoading && <p>Cargando...</p>}
            <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
              <p><strong>Empleado:</strong> {selected.empleadoNombre} (ID: {selected.empleadoId})</p>
              <p><strong>Diagnóstico:</strong> {selected.diagnostico}</p>
              <div>
                <strong>Documentos:</strong>
                {selected.documentos && selected.documentos.length > 0 ? (
                  <ul>
                    {selected.documentos.map((d) => (
                      <li key={d.id}>
                        <button className="nav-button" onClick={() => descargarArchivo(d.urlArchivo, d.nombreOriginal ?? d.id)}>
                          Ver / Descargar
                        </button>
                        {' '}{d.nombreOriginal ?? d.id} — {new Date(d.fechaCarga).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                ) : (<p>No hay documentos adjuntos.</p>)}
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <button onClick={closeDetalle}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación personalizada para marcar Finalizado */}
      {confirmOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Confirmar finalización</h3>
            <p>Estás a punto de marcar la incapacidad <strong>{pendingChange?.inc?.id}</strong> como <strong>Finalizada</strong>. Esta acción no puede deshacerse. ¿Deseas continuar?</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={applyPendingChange} className="nav-button">Confirmar</button>
              <button onClick={cancelPendingChange} className="nav-button">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionIncapacidades;

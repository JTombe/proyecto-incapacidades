import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllIncapacidades, getIncapacidadById, actualizarEstado, agregarDocumentos, descargarArchivo } from '../../service/Incapacidades';

const ESTADO_MAP = {
  1: 'Enviada',
  2: 'Recibida',
  3: 'Equivocada',
  4: 'Radicando',
  5: 'Aceptado',
  6: 'Finalizado'
};

// Esta pantalla: recepcionista/admin
const ConsultarIncapacidades = () => {
  const { isAuthenticated, hasRole } = useAuth();
  const allowed = isAuthenticated && (hasRole('recepcionista') || hasRole('admin'));

  const [incapacidades, setIncapacidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const fetchLista = async () => {
    setLoading(true);
    setError(null);
    try {
      // traer solo estado 1
      const data = await getAllIncapacidades(1);
      setIncapacidades(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!allowed) return;
    fetchLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed]);

  const openDetalle = async (inc) => {
    setDetailLoading(true);
    setError(null);
    try {
      // marcar como recibido (1 -> 2) apenas se entre a comprobar
      await actualizarEstado(inc.id, 2);
      // actualizar lista localmente
      setIncapacidades((prev) => prev.filter((p) => p.id !== inc.id));

      // obtener detalle para mostrar
      const full = await getIncapacidadById(inc.id);
      setSelected(full);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCerrarDetalle = () => {
    setSelected(null);
  };

  const marcarRadicando = async (id) => {
    setError(null);
    try {
      await actualizarEstado(id, 4);
      // cerrar detalle y refrescar lista
      setSelected(null);
      fetchLista();
    } catch (err) {
      setError(err.message || String(err));
    }
  };

  const marcarEquivocada = async (id) => {
    setError(null);
    const files = fileRef.current?.files ? Array.from(fileRef.current.files) : [];
    if (files.length === 0) {
      setError('Adjunta un archivo que indique la corrección necesaria');
      return;
    }

    setUploading(true);
    try {
      await agregarDocumentos(id, files);
      await actualizarEstado(id, 3);
      setSelected(null);
      fetchLista();
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) return <div className="registrar-container"><p className="error-message-inline">Inicia sesión para consultar incapacidades.</p></div>;
  if (!allowed) return <div className="registrar-container"><p className="error-message-inline">No tienes permisos para ver esta pantalla.</p></div>;

  return (
    <div className="registrar-container">
      <h2>Consultar Incapacidades (Recepcionista)</h2>

      {loading && <p>Cargando lista...</p>}
      {error && <div className="error-message-inline">{error}</div>}

      {!loading && (
        <div>
          {incapacidades.length === 0 && <p>No hay incapacidades en estado 1 para comprobar.</p>}

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
                        <button onClick={() => openDetalle(inc)}>Comprobar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Detalle modal */}
      {selected && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Incapacidad: {selected.id}</h3>
            {detailLoading && <p>Cargando...</p>}
            <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
              <p><strong>Empleado:</strong> {selected.empleadoNombre} (ID: {selected.empleadoId})</p>
              <p><strong>Tipo:</strong> {selected.tipo}</p>
              <p><strong>Fecha inicio:</strong> {selected.fechaInicio ? new Date(selected.fechaInicio).toLocaleString() : ''}</p>
              <p><strong>Fecha fin:</strong> {selected.fechaFin ? new Date(selected.fechaFin).toLocaleString() : ''}</p>
              <p><strong>Días:</strong> {selected.dias}</p>
              <p><strong>Diagnóstico:</strong> {selected.diagnostico}</p>
              <p><strong>EPS:</strong> {selected.eps}</p>
              <p><strong>Estado:</strong> {ESTADO_MAP[selected.estado] ?? selected.estado}</p>

              <div>
                <strong>Documentos:</strong>
                {selected.documentos && selected.documentos.length > 0 ? (
                  <ul>
                    {selected.documentos.map((d) => (
                      <li key={d.id}>
                        <button className="nav-button" onClick={() => descargarArchivo(d.urlArchivo, d.nombreOriginal ?? d.id)}>
                          Ver / Descargar
                        </button>
                        {' '}
                        {d.nombreOriginal ?? d.id} — {new Date(d.fechaCarga).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                ) : (<p>No hay documentos adjuntos.</p>)}
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <div>
                <label>Si está equivocada, adjunta un archivo con la corrección:</label>
                <input type="file" ref={fileRef} />
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => marcarEquivocada(selected.id)} disabled={uploading}>{uploading ? 'Subiendo...' : 'Marcar como Equivocada'}</button>
                <button onClick={() => marcarRadicando(selected.id)}>Pasar a Radicando</button>
                <button onClick={handleCerrarDetalle}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultarIncapacidades;

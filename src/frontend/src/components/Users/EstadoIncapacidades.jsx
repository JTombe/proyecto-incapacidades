import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getIncapacidadesByEmpleado } from '../../service/Incapacidades';

const ESTADO_MAP = {
  1: 'Enviada',
  2: 'Recibida',
  3: 'Equivocada',
  4: 'Radicando',
  5: 'Aceptado',
  6: 'Finalizado'
};

const EstadoIncapacidades = () => {
  const { user } = useAuth();
  const [incapacidades, setIncapacidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      if (!user || !user.id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getIncapacidadesByEmpleado(Number(user.id));
        setIncapacidades(data || []);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user]);

  return (
    <div className="registrar-container">
      <h2>Mis Incapacidades</h2>

      {!user && <p className="error-message-inline">Inicia sesión para ver tus incapacidades.</p>}

      {loading && <p>Loading...</p>}
      {error && <div className="error-message-inline">{error}</div>}

      {!loading && !error && (
        <div>
          {incapacidades.length === 0 && <p>No hay incapacidades registradas.</p>}
          {incapacidades.length > 0 && (
            <div className="estado-table-wrap">
              <table className="estado-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Fecha inicio</th>
                    <th>Días</th>
                    <th>Diagnóstico</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {incapacidades.map((inc) => (
                    <tr key={inc.id}>
                      <td>{inc.id}</td>
                      <td>{inc.tipo}</td>
                      <td>{new Date(inc.fechaInicio).toLocaleDateString()}</td>
                      <td>{inc.dias}</td>
                      <td>{inc.diagnostico}</td>
                      <td>
                        <span className={`estado-badge estado-badge--${(ESTADO_MAP[inc.estado] || 'otro').toLowerCase().replace(/\s+/g,'-')}`}>
                          {ESTADO_MAP[inc.estado] ?? inc.estado}
                        </span>
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

export default EstadoIncapacidades;

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
    <div style={{ padding: 20 }}>
      <h2>Mis Incapacidades</h2>

      {!user && <p style={{ color: 'orange' }}>Inicia sesión para ver tus incapacidades.</p>}

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div>
          {incapacidades.length === 0 && <p>No hay incapacidades registradas.</p>}
          {incapacidades.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Tipo</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Fecha inicio</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Días</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Diagnóstico</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {incapacidades.map((inc) => (
                  <tr key={inc.id}>
                    <td style={{ padding: '6px 4px', borderBottom: '1px solid #f1f1f1' }}>{inc.id}</td>
                    <td style={{ padding: '6px 4px', borderBottom: '1px solid #f1f1f1' }}>{inc.tipo}</td>
                    <td style={{ padding: '6px 4px', borderBottom: '1px solid #f1f1f1' }}>{new Date(inc.fechaInicio).toLocaleDateString()}</td>
                    <td style={{ padding: '6px 4px', borderBottom: '1px solid #f1f1f1' }}>{inc.dias}</td>
                    <td style={{ padding: '6px 4px', borderBottom: '1px solid #f1f1f1' }}>{inc.diagnostico}</td>
                    <td style={{ padding: '6px 4px', borderBottom: '1px solid #f1f1f1' }}>{ESTADO_MAP[inc.estado] ?? inc.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default EstadoIncapacidades;

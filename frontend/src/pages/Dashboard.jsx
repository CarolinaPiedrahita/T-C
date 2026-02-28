import { useState, useEffect } from 'react';
import { clientsAPI } from '../services/api.js';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    potenciales: 0,
    inactivos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const clients = await clientsAPI.getAll();
      setStats({
        total: clients.length,
        activos: clients.filter(c => c.estado === 'activo').length,
        potenciales: clients.filter(c => c.estado === 'potencial').length,
        inactivos: clients.filter(c => c.estado === 'inactivo').length
      });
    } catch (err) {
      setError('Error al cargar estadísticas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando dashboard...</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <div className="error">{error}</div>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total de Clientes</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #FF8C42 0%, #E67E2F 100%)' }}>
          <h3>Clientes Activos</h3>
          <p>{stats.activos}</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #C9A227 100%)' }}>
          <h3>Potenciales</h3>
          <p>{stats.potenciales}</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #707070 0%, #404040 100%)' }}>
          <h3>Inactivos</h3>
          <p>{stats.inactivos}</p>
        </div>
      </div>
    </div>
  );
}

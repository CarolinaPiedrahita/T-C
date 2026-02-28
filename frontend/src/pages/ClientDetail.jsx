import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientsAPI } from '../services/api.js';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      setLoading(true);
      const data = await clientsAPI.getById(id);
      setClient(data);
    } catch (err) {
      setError('Error al cargar cliente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await clientsAPI.delete(id);
        navigate('/clients');
      } catch (err) {
        setError('Error al eliminar: ' + err.message);
      }
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (!client) return <div className="error">Cliente no encontrado</div>;

  return (
    <div className="card">
      <h2>{client.nombre}</h2>
      {error && <div className="error">{error}</div>}

      <div style={{ marginTop: '20px' }}>
        <div className="client-field">
          <strong>Email:</strong>
          <span>{client.email}</span>
        </div>
        <div className="client-field">
          <strong>Teléfono:</strong>
          <span>{client.telefono || 'No especificado'}</span>
        </div>
        <div className="client-field">
          <strong>Empresa:</strong>
          <span>{client.empresa}</span>
        </div>
        <div className="client-field">
          <strong>Industria:</strong>
          <span>{client.industria}</span>
        </div>
        <div className="client-field">
          <strong>Estado:</strong>
          <span className={`status-badge status-${client.estado}`}>
            {client.estado}
          </span>
        </div>
        <div className="client-field">
          <strong>Fecha de Creación:</strong>
          <span>{new Date(client.fecha_creacion).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="actions">
        <button className="secondary" onClick={() => navigate('/clients')}>
          Volver
        </button>
        <button className="primary" onClick={() => navigate(`/clients/${id}/edit`)}>
          Editar
        </button>
        <button className="secondary" onClick={handleDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
}

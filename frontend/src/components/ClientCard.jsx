import { useNavigate } from 'react-router-dom';
import { clientsAPI } from '../services/api.js';

export default function ClientCard({ client, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await clientsAPI.delete(client.id);
        onDelete(client.id);
      } catch (error) {
        alert('Error al eliminar cliente: ' + error.message);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/clients/${client.id}/edit`);
  };

  const handleView = () => {
    navigate(`/clients/${client.id}`);
  };

  return (
    <div className="card client-card">
      <div className="card-header">
        <h3>{client.nombre}</h3>
        <span className={`status-badge status-${client.estado}`}>
          {client.estado}
        </span>
      </div>
      <div className="card-body">
        <div className="client-field">
          <strong>Email:</strong>
          <span>{client.email}</span>
        </div>
        <div className="client-field">
          <strong>Teléfono:</strong>
          <span>{client.telefono || 'N/A'}</span>
        </div>
        <div className="client-field">
          <strong>Empresa:</strong>
          <span>{client.empresa}</span>
        </div>
        <div className="client-field">
          <strong>Industria:</strong>
          <span>{client.industria}</span>
        </div>
      </div>
      <div className="actions">
        <button className="primary" onClick={handleView}>
          Ver
        </button>
        <button className="primary" onClick={handleEdit}>
          Editar
        </button>
        <button className="secondary" onClick={handleDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
}

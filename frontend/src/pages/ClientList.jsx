import { useState, useEffect } from 'react';
import { clientsAPI } from '../services/api.js';
import ClientCard from '../components/ClientCard.jsx';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, filterState]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientsAPI.getAll();
      setClients(data);
    } catch (err) {
      setError('Error al cargar clientes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let result = clients;

    if (searchTerm) {
      result = result.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.empresa.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterState) {
      result = result.filter(c => c.estado === filterState);
    }

    setFilteredClients(result);
  };

  const handleDelete = (id) => {
    setClients(clients.filter(c => c.id !== id));
  };

  if (loading) return <div className="loading">Cargando clientes...</div>;

  return (
    <div>
      <h2>Clientes</h2>
      {error && <div className="error">{error}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre, email o empresa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-bar">
        <select
          value={filterState}
          onChange={(e) => setFilterState(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="potencial">Potencial</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      {filteredClients.length === 0 ? (
        <div className="loading">No hay clientes</div>
      ) : (
        <div className="clients-grid">
          {filteredClients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

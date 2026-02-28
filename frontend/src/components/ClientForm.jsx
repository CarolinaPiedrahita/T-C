import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientsAPI } from '../services/api.js';

const INDUSTRIES = ['Tecnología', 'Retail', 'Servicios', 'Manufactura', 'Otros'];
const STATES = ['potencial', 'activo', 'inactivo'];

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    industria: '',
    estado: 'potencial'
  });

  useEffect(() => {
    if (isEdit) {
      loadClient();
    }
  }, [id]);

  const loadClient = async () => {
    try {
      setLoading(true);
      const client = await clientsAPI.getById(id);
      setFormData(client);
    } catch (err) {
      setError('Error al cargar cliente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      if (isEdit) {
        await clientsAPI.update(id, formData);
      } else {
        await clientsAPI.create(formData);
      }
      navigate('/clients');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) return <div className="loading">Cargando...</div>;

  return (
    <div className="card">
      <h2>{isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Empresa *</label>
          <input
            type="text"
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Industria *</label>
            <select
              name="industria"
              value={formData.industria}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar industria</option>
              {INDUSTRIES.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Estado *</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              {STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={() => navigate('/clients')}
          >
            Cancelar
          </button>
          <button type="submit" className="primary" disabled={loading}>
            {isEdit ? 'Actualizar' : 'Crear'} Cliente
          </button>
        </div>
      </form>
    </div>
  );
}

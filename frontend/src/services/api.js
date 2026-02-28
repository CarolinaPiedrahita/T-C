const API_BASE_URL = 'http://localhost:5000/api';

export const clientsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/clients`);
    if (!response.ok) throw new Error('Error al obtener clientes');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`);
    if (!response.ok) throw new Error('Cliente no encontrado');
    return response.json();
  },

  create: async (clientData) => {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    });
    if (!response.ok) throw new Error('Error al crear cliente');
    return response.json();
  },

  update: async (id, clientData) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    });
    if (!response.ok) throw new Error('Error al actualizar cliente');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar cliente');
    return response.json();
  }
};

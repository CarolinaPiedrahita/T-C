import pool from '../config/database.js';

export const getAllClients = async () => {
  const result = await pool.query(
    'SELECT * FROM clientes ORDER BY fecha_creacion DESC'
  );
  return result.rows;
};

export const getClientById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM clientes WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const createClient = async (clientData) => {
  const { nombre, email, telefono, empresa, industria, estado } = clientData;
  const result = await pool.query(
    'INSERT INTO clientes (nombre, email, telefono, empresa, industria, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [nombre, email, telefono, empresa, industria, estado]
  );
  return result.rows[0];
};

export const updateClient = async (id, clientData) => {
  const { nombre, email, telefono, empresa, industria, estado } = clientData;
  const result = await pool.query(
    'UPDATE clientes SET nombre = $1, email = $2, telefono = $3, empresa = $4, industria = $5, estado = $6 WHERE id = $7 RETURNING *',
    [nombre, email, telefono, empresa, industria, estado, id]
  );
  return result.rows[0];
};

export const deleteClient = async (id) => {
  const result = await pool.query(
    'DELETE FROM clientes WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

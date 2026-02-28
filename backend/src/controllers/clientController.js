import * as clientModel from '../models/clientModel.js';
import { validateClient } from '../middleware/validation.js';

export const getClients = async (req, res) => {
  try {
    const clients = await clientModel.getAllClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await clientModel.getClientById(id);
    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const validation = validateClient(req.body);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }
    const newClient = await clientModel.createClient(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validateClient(req.body);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }
    const updatedClient = await clientModel.updateClient(id, req.body);
    if (!updatedClient) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClient = await clientModel.deleteClient(id);
    if (!deletedClient) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado', client: deletedClient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

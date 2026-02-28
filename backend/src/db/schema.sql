-- Crear base de datos
CREATE DATABASE crm_db;

-- Conectarse a la base de datos
\c crm_db;

-- Crear tabla clientes
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefono VARCHAR(20),
  empresa VARCHAR(255) NOT NULL,
  industria VARCHAR(100) NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'potencial',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para búsquedas rápidas
CREATE INDEX idx_nombre ON clientes(nombre);
CREATE INDEX idx_email ON clientes(email);
CREATE INDEX idx_estado ON clientes(estado);
CREATE INDEX idx_fecha_creacion ON clientes(fecha_creacion DESC);

-- Trigger para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION actualizar_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_fecha_actualizacion
BEFORE UPDATE ON clientes
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_actualizacion();

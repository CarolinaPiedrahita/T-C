# Quick Start Guide - CRM Sistema de Gestión de Clientes

Guía rápida para iniciar el proyecto en tu máquina local.

## 1. Clonar el Repositorio

```bash
git clone https://github.com/CarolinaPiedrahita/T-C.git
cd T-C
```

## 2. Configurar Base de Datos

### Opción A: Usando PostgreSQL localmente

```bash
# Instalar PostgreSQL si no lo tienes
# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# macOS (con Homebrew):
brew install postgresql

# Windows: Descargar desde https://www.postgresql.org/download/windows/
```

```bash
# Iniciar el servicio PostgreSQL
# Ubuntu/Debian:
sudo service postgresql start

# macOS:
brew services start postgresql

# Acceder a PostgreSQL
psql -U postgres

# En psql, ejecutar:
CREATE USER crm_user WITH PASSWORD 'password123';
ALTER USER crm_user SUPERUSER;
\q
```

## 3. Inicializar la Base de Datos

```bash
cd backend
psql -U crm_user -d postgres -f src/db/schema.sql
```

## 4. Instalar Dependencias

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## 5. Configurar Variables de Entorno

### Backend

```bash
# En backend/.env (copiar de .env.example y ajustar)
cp backend/.env.example backend/.env

# Editar backend/.env con tus credenciales de PostgreSQL
nano backend/.env
```

## 6. Ejecutar la Aplicación

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Deberías ver:
```
Server running on port 5000
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Deberías ver:
```
  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:3000/
```

## 7. Acceder a la Aplicación

Abre tu navegador y ve a:
```
http://localhost:3000
```

## Primeros Pasos

1. **Dashboard**: Verás un resumen de clientes (vacío al principio)
2. **Nuevo Cliente**: Crea tu primer cliente haciendo clic en "Nuevo Cliente"
3. **Listar Clientes**: Ve a "Clientes" para ver todos los clientes
4. **Buscar y Filtrar**: Usa la barra de búsqueda para encontrar clientes
5. **Editar/Eliminar**: Haz clic en "Ver" para detalles o "Editar" para cambios

## API Health Check

Para verificar que el backend está funcionando:

```bash
curl http://localhost:5000/api/health
```

Deberías recibir:
```json
{"status":"OK","timestamp":"2024-02-28T..."}
```

## Solución de Problemas

### Error: "Port already in use"

Si el puerto 5000 o 3000 está en uso:

```bash
# Cambiar en backend/src/server.js
# O en el archivo .env: PORT=5001

# Para frontend, editar frontend/vite.config.js:
# server: { port: 3001 }
```

### Error: "Cannot connect to database"

1. Verifica que PostgreSQL está corriendo: `psql -U postgres`
2. Verifica las credenciales en `backend/.env`
3. Asegúrate de que la base de datos fue creada correctamente

### Error: "npm command not found"

Instala Node.js desde https://nodejs.org/

## Base de Datos de Prueba

Si quieres cargar datos de prueba:

```bash
psql -U crm_user -d crm_db

-- Insertar clientes de prueba
INSERT INTO clientes (nombre, email, telefono, empresa, industria, estado)
VALUES
('Juan Pérez', 'juan@example.com', '3001234567', 'Tech Corp', 'Tecnología', 'activo'),
('María García', 'maria@example.com', '3009876543', 'Build Co', 'Manufactura', 'potencial'),
('Carlos López', 'carlos@example.com', '3005555555', 'Services Inc', 'Servicios', 'inactivo');

\q
```

Luego recarga la aplicación en el navegador.

## Scripts Disponibles

### Backend

```bash
npm run dev      # Desarrollo con nodemon (hot reload)
npm start        # Producción
npm run db:init  # Inicializar base de datos
```

### Frontend

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Previsualizar build
```

## Siguiente Paso

Revisa el archivo `README.md` para documentación completa de la API y arquitectura del proyecto.

---

¿Preguntas? Contacta al equipo de desarrollo.

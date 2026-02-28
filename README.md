# CRM - Sistema de Gestión de Clientes

Un CRM minimalista, intuitivo y efectivo para gestionar clientes y contactos en proyectos de construcción.

## Stack Tecnológico

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Base de Datos**: PostgreSQL
- **Estilos**: CSS puro con variables temáticas

## Características

✅ Gestión completa de clientes (CRUD)
✅ Dashboard con estadísticas
✅ Búsqueda y filtrado de clientes
✅ Diseño minimalista con colores: blanco, naranja, gris, negro y dorado
✅ Interfaz intuitiva y responsiva
✅ API REST completa

## Instalación

### Requisitos Previos

- Node.js >= 18
- PostgreSQL >= 12
- npm o yarn

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

## Configuración

### Variables de Entorno (Backend)

Crear archivo `.env` en `/backend`:

```
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=crm_db
DB_PASSWORD=your_password
DB_PORT=5432
NODE_ENV=development
```

## Ejecución

### Iniciar Base de Datos

```bash
# Crear base de datos (ejecutar una sola vez)
psql -U postgres -f backend/src/db/schema.sql
```

### Modo Desarrollo

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

## API Endpoints

### Clientes

- `GET /api/clients` - Obtener todos los clientes
- `GET /api/clients/:id` - Obtener cliente por ID
- `POST /api/clients` - Crear nuevo cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente
- `GET /api/health` - Health check

## Estructura del Proyecto

```
T-C/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## Desarrollo

### Scripts Disponibles

**Backend:**
- `npm run dev` - Inicia en modo desarrollo con nodemon
- `npm start` - Inicia en producción
- `npm run db:init` - Inicializa la base de datos

**Frontend:**
- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build de producción

## Paleta de Colores

- **Blanco**: #FFFFFF
- **Naranja**: #FF8C42
- **Gris**: #E8E8E8
- **Negro**: #1A1A1A
- **Dorado**: #D4AF37

## Validaciones

### Cliente

- Nombre: Mínimo 2 caracteres
- Email: Formato válido y único
- Teléfono: Formato válido (opcional)
- Empresa: Requerida
- Industria: Requerida
- Estado: potencial, activo o inactivo

## Soporte

Para reportar problemas o sugerencias, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0
**Última actualización**: 2026-02-28

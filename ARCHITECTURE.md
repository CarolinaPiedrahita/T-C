# Architecture - CRM Sistema de Gestión de Clientes

Descripción de la arquitectura técnica del proyecto.

## Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)                   │
│                    localhost:3000                            │
├─────────────────────────────────────────────────────────────┤
│  Components              Pages              Services         │
│  ├─ Header              ├─ Dashboard         └─ api.js      │
│  ├─ Sidebar             ├─ ClientList                       │
│  ├─ Modal               ├─ ClientDetail                     │
│  ├─ ClientCard          └─ ClientForm                       │
│  ├─ ClientForm                                              │
│  └─ (all use CSS theme)                                     │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTP/REST
                    /api/clients/:id
┌─────────────────────────────────────────────────────────────┐
│               Backend (Express + Node.js)                    │
│                   localhost:5000                             │
├─────────────────────────────────────────────────────────────┤
│  Routes         Controllers         Models                  │
│  ├─ GET /      ├─ getClients       ├─ getAllClients       │
│  ├─ POST /     ├─ getClient        ├─ getClientById       │
│  ├─ PUT /:id   ├─ createClient     ├─ createClient        │
│  ├─ DELETE /:id├─ updateClient     ├─ updateClient        │
│  └─ GET /health└─ deleteClient     └─ deleteClient        │
│                                                              │
│  Middleware: validation.js (validateClient)                 │
│  Config: database.js, constants.js                          │
└─────────────────────────────────────────────────────────────┘
                           ↓ PostgreSQL Driver
┌─────────────────────────────────────────────────────────────┐
│             Database (PostgreSQL)                            │
│                 crm_db                                       │
├─────────────────────────────────────────────────────────────┤
│  Table: clientes                                             │
│  ├─ id (SERIAL PRIMARY KEY)                                │
│  ├─ nombre (VARCHAR(255))                                  │
│  ├─ email (VARCHAR(255) UNIQUE)                            │
│  ├─ telefono (VARCHAR(20))                                 │
│  ├─ empresa (VARCHAR(255))                                 │
│  ├─ industria (VARCHAR(100))                               │
│  ├─ estado (VARCHAR(50))                                   │
│  ├─ fecha_creacion (TIMESTAMP)                             │
│  └─ fecha_actualizacion (TIMESTAMP)                        │
│                                                              │
│  Indexes: nombre, email, estado, fecha_creacion             │
│  Trigger: auto-update fecha_actualizacion                   │
└─────────────────────────────────────────────────────────────┘
```

## Estructura de Carpetas

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── Header.jsx          # Encabezado de la aplicación
│   │   ├── Sidebar.jsx         # Menú lateral con rutas
│   │   ├── ClientCard.jsx      # Tarjeta de cliente
│   │   ├── ClientForm.jsx      # Formulario crear/editar
│   │   └── Modal.jsx           # Componente modal genérico
│   │
│   ├── pages/                   # Páginas principales
│   │   ├── Dashboard.jsx       # Página de inicio con estadísticas
│   │   ├── ClientList.jsx      # Lista de clientes con búsqueda
│   │   ├── ClientDetail.jsx    # Detalles de un cliente
│   │   └── ClientForm.jsx      # (Compartido con crear)
│   │
│   ├── services/                # Servicios y utilidades
│   │   └── api.js              # Cliente HTTP para API REST
│   │
│   ├── styles/                  # Estilos CSS
│   │   ├── theme.css           # Variables de tema y colores
│   │   ├── global.css          # Estilos globales
│   │   └── components.css      # Estilos de componentes
│   │
│   ├── App.jsx                 # Componente raíz con rutas
│   └── main.jsx                # Punto de entrada
│
├── public/                       # Assets estáticos
├── index.html                   # HTML principal
├── vite.config.js              # Configuración de Vite
└── package.json                # Dependencias
```

### Backend (`/backend`)

```
backend/
├── src/
│   ├── config/                  # Configuración global
│   │   ├── database.js         # Pool de conexión PostgreSQL
│   │   └── constants.js        # Constantes de la aplicación
│   │
│   ├── controllers/             # Lógica de controladores
│   │   └── clientController.js # Manejo de clientes CRUD
│   │
│   ├── models/                  # Modelos de datos
│   │   └── clientModel.js      # Queries a la BD de clientes
│   │
│   ├── routes/                  # Definición de rutas
│   │   └── clientRoutes.js     # Rutas de clientes
│   │
│   ├── middleware/              # Middlewares
│   │   └── validation.js       # Validaciones de entrada
│   │
│   ├── db/                      # Scripts de base de datos
│   │   └── schema.sql          # Schema inicial de BD
│   │
│   └── server.js               # Punto de entrada del servidor
│
├── .env                         # Variables de entorno (git-ignored)
├── .env.example                # Plantilla de .env
├── .gitignore                  # Archivos ignorados por git
└── package.json                # Dependencias
```

## Flujo de Datos

### Crear Cliente

```
1. Usuario completa formulario en ClientForm
   ↓
2. handleSubmit() llamado en ClientForm.jsx
   ↓
3. clientsAPI.create(formData) en services/api.js
   ↓
4. fetch POST /api/clients con JSON
   ↓
5. Express recibe en POST /clients
   ↓
6. clientController.createClient()
   ↓
7. validateClient() en middleware/validation.js
   ↓
8. clientModel.createClient() executa query SQL
   ↓
9. PostgreSQL inserta nuevo registro
   ↓
10. Respuesta JSON retorna a cliente
   ↓
11. navigate('/clients') redirige a lista
```

### Listar Clientes

```
1. Component ClientList monta
   ↓
2. useEffect() ejecuta loadClients()
   ↓
3. clientsAPI.getAll() en services/api.js
   ↓
4. fetch GET /api/clients
   ↓
5. Express recibe en GET /clients
   ↓
6. clientController.getClients()
   ↓
7. clientModel.getAllClients() executa query
   ↓
8. PostgreSQL retorna array de clientes
   ↓
9. JSON response enviado al cliente
   ↓
10. setClients() actualiza state
    ↓
11. Componente re-renderiza con datos
```

## Tecnologías Utilizadas

### Frontend

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React | ^18.2.0 | Librería UI |
| React Router DOM | ^6.20.0 | Enrutamiento |
| Vite | ^5.0.8 | Build tool |
| CSS Puro | - | Estilos |

### Backend

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Express | ^4.18.2 | Framework web |
| Node.js | >=18 | Runtime |
| pg (node-postgres) | ^8.11.3 | Driver PostgreSQL |
| dotenv | ^16.3.1 | Variables de entorno |
| CORS | ^2.8.5 | Cross-Origin |
| Body Parser | ^1.20.2 | Parseo JSON |

### Base de Datos

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| PostgreSQL | >=12 | Base de datos relacional |

## Patrones de Diseño

### MVC (Model-View-Controller)

El backend sigue el patrón MVC:

- **Model** (`models/clientModel.js`): Interactúa con la BD
- **View** (Frontend React): Componentes de interfaz
- **Controller** (`controllers/clientController.js`): Lógica de negocio

### Component-Based Architecture

El frontend usa componentes reutilizables:

- Components: Elementos básicos reutilizables
- Pages: Vistas completas (combina múltiples componentes)
- Services: Lógica de integración (API)
- Styles: Temas y estilos centralizados

### API REST

La comunicación usa principios REST:

```
GET    /api/clients       - Listar
GET    /api/clients/:id   - Obtener uno
POST   /api/clients       - Crear
PUT    /api/clients/:id   - Actualizar
DELETE /api/clients/:id   - Eliminar
```

## Seguridad

### Frontend

- ✅ Validación de entrada en formularios
- ✅ Sanitización de datos antes de envío
- ✅ HTTPS ready (en producción)

### Backend

- ✅ Validación de datos en servidor
- ✅ Prepared statements (protege contra SQL injection)
- ✅ CORS habilitado
- ✅ Error handling centralizado

### Base de Datos

- ✅ Constraints en nivel de BD
- ✅ Unique constraint en email
- ✅ Índices para búsquedas rápidas

## Escalabilidad

### Posibles mejoras futuras:

1. **Autenticación & Autorización**
   - JWT tokens
   - Roles de usuario
   - Control de acceso

2. **Caché**
   - Redis para datos frecuentes
   - Client-side caching

3. **Pagination**
   - Límite de resultados por página
   - Offset/limit en API

4. **Search Avanzado**
   - Elasticsearch
   - Full-text search

5. **Logging & Monitoring**
   - Winston para logs
   - Sentry para error tracking
   - APM (Application Performance Monitoring)

6. **Tests**
   - Jest para unit tests
   - React Testing Library
   - Supertest para API tests

7. **Docker & CI/CD**
   - Containerización
   - GitHub Actions
   - Automated testing

8. **API Documentation**
   - Swagger/OpenAPI
   - Auto-generated docs

## Performance

### Optimizaciones Implementadas

- ✅ Índices en base de datos para búsquedas rápidas
- ✅ Lazy loading de componentes (React Router)
- ✅ CSS variables para temas rápidos
- ✅ Queries optimizadas en PostgreSQL

### Posibles mejoras

- [ ] Pagination en lista de clientes
- [ ] Debounce en búsqueda
- [ ] Memoización de componentes (React.memo)
- [ ] Code splitting por ruta
- [ ] Compresión de assets
- [ ] CDN para assets estáticos

## Deployment

### Frontend

Opciones de deployment:
- Vercel (recomendado)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Backend

Opciones de deployment:
- Heroku
- DigitalOcean App Platform
- AWS EC2
- AWS Lambda (serverless)
- Railway

### Base de Datos

Opciones de deployment:
- AWS RDS
- DigitalOcean Managed Databases
- Heroku Postgres
- Azure Database for PostgreSQL
- Self-hosted en VPS

## Monitoreo

En producción, se debe implementar:

- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (UptimeRobot)
- Database monitoring (pg_stat_statements)
- Log aggregation (ELK Stack o similar)

---

Versión: 1.0.0
Última actualización: 2024-02-28

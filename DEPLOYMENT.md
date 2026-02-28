# Deployment Guide - CRM Sistema de Gestión de Clientes

Guía para deployar la aplicación a producción.

## Pre-Deployment Checklist

- [ ] Código testeado localmente
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada a producción
- [ ] HTTPS configurado
- [ ] Dominio apuntando a servidor
- [ ] Backups de BD programados
- [ ] Monitoreo configurado
- [ ] Logs centralizados

## Opción 1: Heroku (Recomendado para Empezar)

### Requisitos
- Cuenta en Heroku
- Heroku CLI instalado

### Pasos

```bash
# 1. Login en Heroku
heroku login

# 2. Crear aplicación Backend
heroku create crm-app-backend

# 3. Crear Postgres en Heroku
heroku addons:create heroku-postgresql:hobby-dev

# 4. Configurar variables de entorno
heroku config:set NODE_ENV=production
heroku config:set DB_USER=postgres
heroku config:set DB_HOST=<heroku-db-host>
heroku config:set DB_NAME=<heroku-db-name>
heroku config:set DB_PASSWORD=<heroku-db-password>
heroku config:set DB_PORT=5432

# 5. Hacer push del backend
cd backend
git push heroku main

# 6. Migrar base de datos
heroku run node src/db/schema.sql

# 7. Backend URL
heroku logs --tail
```

### Frontend en Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
cd frontend
vercel

# 4. Configurar variable de entorno
# En Vercel dashboard:
# VITE_API_URL=https://crm-app-backend.herokuapp.com/api
```

---

## Opción 2: DigitalOcean (VPS)

### Requisitos
- Cuenta DigitalOcean
- Droplet Ubuntu 20.04 LTS ($5-6/mes)
- SSH configurado

### Pasos

#### Configuración Inicial del Servidor

```bash
# Conectarse al servidor
ssh root@<tu-droplet-ip>

# Actualizar sistema
apt-get update
apt-get upgrade -y

# Instalar Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Instalar PostgreSQL
apt-get install -y postgresql postgresql-contrib

# Instalar PM2 (process manager)
npm install -g pm2

# Instalar Nginx (reverse proxy)
apt-get install -y nginx

# Instalar Certbot (SSL)
apt-get install -y certbot python3-certbot-nginx
```

#### Deploy Backend

```bash
# En el servidor, clonar repositorio
cd /var/www
git clone https://github.com/CarolinaPiedrahita/T-C.git
cd T-C/backend

# Instalar dependencias
npm install --production

# Crear .env
cat > .env <<EOF
PORT=5000
DB_USER=crm_user
DB_HOST=localhost
DB_NAME=crm_db
DB_PASSWORD=your_secure_password
DB_PORT=5432
NODE_ENV=production
EOF

# Iniciar con PM2
pm2 start src/server.js --name "crm-backend"
pm2 startup
pm2 save

# Verificar que está corriendo
pm2 logs crm-backend
```

#### Configurar PostgreSQL

```bash
# Conectarse a PostgreSQL
sudo -u postgres psql

# Crear usuario
CREATE USER crm_user WITH PASSWORD 'your_secure_password';
ALTER USER crm_user SUPERUSER;
\q

# Ejecutar schema
sudo -u postgres psql -f /var/www/T-C/backend/src/db/schema.sql
```

#### Configurar Nginx

```bash
# Editar configuración
sudo nano /etc/nginx/sites-available/crm

# Paste this config:
upstream crm_backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://crm_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/crm /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Verificar sintaxis
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

#### SSL Certificate (Let's Encrypt)

```bash
sudo certbot --nginx -d tu-dominio.com
```

#### Deploy Frontend

```bash
cd /var/www/T-C/frontend

# Instalar dependencias
npm install

# Build
npm run build

# Servir con Nginx (actualizar configuración)
sudo nano /etc/nginx/sites-available/crm

# Agregar location para frontend:
server {
    listen 443 ssl http2;
    server_name tu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;

    root /var/www/T-C/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://crm_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

## Opción 3: Docker + Docker Compose

### Requisitos
- Docker instalado
- Docker Compose instalado

### Dockerfile Backend

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000
CMD ["node", "src/server.js"]
```

### Dockerfile Frontend

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: crm_user
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: crm_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/src/db/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      PORT: 5000
      DB_USER: crm_user
      DB_HOST: postgres
      DB_NAME: crm_db
      DB_PASSWORD: your_password
      DB_PORT: 5432
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Deploy con Docker Compose

```bash
# Build
docker-compose build

# Run
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Opción 4: AWS (ECS + RDS)

### Paso a Paso

#### 1. Crear RDS Database

```bash
# En AWS Console:
# 1. Go to RDS
# 2. Create Database
# 3. PostgreSQL
# 4. Free tier
# 5. DB instance: crm-db
# 6. Master username: crm_user
# 7. Auto generate password
# 8. Public accessibility: Yes
```

#### 2. Crear ECR Repository

```bash
aws ecr create-repository --repository-name crm-backend --region us-east-1
```

#### 3. Build y Push Docker Image

```bash
# Build
docker build -t crm-backend ./backend

# Tag
docker tag crm-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/crm-backend:latest

# Push
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/crm-backend:latest
```

#### 4. Crear ECS Task Definition

```json
{
  "family": "crm-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "crm-backend",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/crm-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "DB_HOST",
          "value": "<rds-endpoint>"
        }
      ]
    }
  ]
}
```

---

## Monitoreo en Producción

### 1. Setup Sentry para Error Tracking

```bash
# Backend
npm install @sentry/node
```

```javascript
// backend/src/server.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.errorHandler());
```

### 2. Logs con Winston

```bash
npm install winston
```

```javascript
// backend/src/config/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

export default logger;
```

### 3. Health Checks

El endpoint `/api/health` ya está implementado.

Configurar monitoreo:
- UptimeRobot: monitorea /api/health cada 5 minutos
- New Relic: monitorea performance de la aplicación

---

## Seguridad en Producción

### Checklist

- [ ] HTTPS/SSL habilitado
- [ ] Contraseñas de BD fortes
- [ ] Environment variables no en código
- [ ] CORS configurado apropiadamente
- [ ] Rate limiting implementado
- [ ] Input validation en servidor
- [ ] SQL injection protección (prepared statements ✓)
- [ ] XSS protección
- [ ] CSRF tokens si necesario
- [ ] Logs de acceso monitoreados

### Implementar Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
// backend/src/middleware/rateLimit.js
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana
});
```

---

## Backup y Disaster Recovery

### Backup PostgreSQL

```bash
# Backup local
pg_dump crm_db > backup_$(date +%Y%m%d).sql

# Restore
psql crm_db < backup_20240228.sql

# Programar backup (cron)
# Agregar a crontab:
0 2 * * * pg_dump crm_db > /backups/crm_$(date +\%Y\%m\%d).sql
```

### Backup automático en la nube

- AWS S3: Configurar replicación de backups
- DigitalOcean Spaces: Similar a S3
- Duplicati: Herramienta open source

---

## Performance Optimization

### Frontend

```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',
    sourcemap: false,
    chunkSizeWarningLimit: 600
  }
}
```

### Backend

```javascript
// Habilitar compression
import compression from 'compression';
app.use(compression());
```

```bash
npm install compression
```

---

## CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build and Deploy
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        run: |
          npm install -g heroku
          heroku container:login
          heroku container:push web -a crm-app-backend
          heroku container:release web -a crm-app-backend
```

---

## Rollback Strategy

Si algo falla en producción:

```bash
# Heroku
heroku releases
heroku rollback v42

# Git
git revert <commit-hash>
git push origin main

# Docker
docker run -d --name crm-backend crm-backend:previous-tag
```

---

## Cost Estimation

### Opción Heroku
- Backend: $7/mes (Eco)
- Database: $9/mes (Hobby)
- Frontend: Gratuito (Vercel)
- **Total: ~$16/mes**

### Opción DigitalOcean
- Droplet: $6/mes ($5 + impuestos)
- Domains: $3/año
- **Total: ~$6/mes**

### Opción AWS
- RDS: ~$15-30/mes
- ECS: variable
- NAT Gateway: ~$30/mes
- **Total: ~$50-100/mes**

---

## Soporte y Mantenimiento

### Updates Mensuales
- Revisar dependencias con `npm audit`
- Aplicar security patches
- Actualizar librerías menores

### Monitoreo Diario
- Revisar logs de errores
- Verificar uptime
- Analizar performance

### Backups
- Automatizar diariamente
- Testear restoration mensualmente
- Guardar en múltiples ubicaciones

---

Última actualización: 2024-02-28

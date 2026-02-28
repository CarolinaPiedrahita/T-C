# API Documentation - CRM Clients Management

Documentación completa de los endpoints de la API REST.

## Base URL

```
http://localhost:5000/api
```

## Autenticación

Por ahora, la API no requiere autenticación. (Planeado para futuras versiones)

## Endpoints

### Health Check

Verifica que el servidor está funcionando.

**Endpoint:**
```
GET /health
```

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2024-02-28T10:30:00.000Z"
}
```

---

### Clientes

#### 1. Obtener Todos los Clientes

Obtiene una lista de todos los clientes ordenados por fecha de creación (más recientes primero).

**Endpoint:**
```
GET /clients
```

**Parámetros de Query:** Ninguno

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "3001234567",
    "empresa": "Tech Corp",
    "industria": "Tecnología",
    "estado": "activo",
    "fecha_creacion": "2024-02-28T10:00:00.000Z",
    "fecha_actualizacion": "2024-02-28T10:00:00.000Z"
  },
  {
    "id": 2,
    "nombre": "María García",
    "email": "maria@example.com",
    "telefono": "3009876543",
    "empresa": "Build Co",
    "industria": "Manufactura",
    "estado": "potencial",
    "fecha_creacion": "2024-02-28T11:00:00.000Z",
    "fecha_actualizacion": "2024-02-28T11:00:00.000Z"
  }
]
```

**Ejemplo con curl:**
```bash
curl -X GET http://localhost:5000/api/clients
```

---

#### 2. Obtener Cliente por ID

Obtiene los detalles de un cliente específico por su ID.

**Endpoint:**
```
GET /clients/:id
```

**Parámetros:**
- `id` (integer, required) - ID del cliente

**Respuesta Exitosa (200):**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "telefono": "3001234567",
  "empresa": "Tech Corp",
  "industria": "Tecnología",
  "estado": "activo",
  "fecha_creacion": "2024-02-28T10:00:00.000Z",
  "fecha_actualizacion": "2024-02-28T10:00:00.000Z"
}
```

**Respuesta Error (404):**
```json
{
  "error": "Cliente no encontrado"
}
```

**Ejemplo con curl:**
```bash
curl -X GET http://localhost:5000/api/clients/1
```

---

#### 3. Crear Nuevo Cliente

Crea un nuevo cliente con los datos proporcionados.

**Endpoint:**
```
POST /clients
```

**Headers Requeridos:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Carlos López",
  "email": "carlos@example.com",
  "telefono": "3005555555",
  "empresa": "Services Inc",
  "industria": "Servicios",
  "estado": "activo"
}
```

**Campos:**
- `nombre` (string, required) - Mínimo 2 caracteres
- `email` (string, required) - Email válido, único
- `telefono` (string, optional) - Formato válido
- `empresa` (string, required) - No puede estar vacía
- `industria` (string, required) - Una de: Tecnología, Retail, Servicios, Manufactura, Otros
- `estado` (string, required) - Una de: potencial, activo, inactivo

**Respuesta Exitosa (201):**
```json
{
  "id": 3,
  "nombre": "Carlos López",
  "email": "carlos@example.com",
  "telefono": "3005555555",
  "empresa": "Services Inc",
  "industria": "Servicios",
  "estado": "activo",
  "fecha_creacion": "2024-02-28T12:00:00.000Z",
  "fecha_actualizacion": "2024-02-28T12:00:00.000Z"
}
```

**Respuesta Error (400) - Validación Fallida:**
```json
{
  "errors": [
    "Nombre debe tener al menos 2 caracteres",
    "Email no válido"
  ]
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos López",
    "email": "carlos@example.com",
    "telefono": "3005555555",
    "empresa": "Services Inc",
    "industria": "Servicios",
    "estado": "activo"
  }'
```

---

#### 4. Actualizar Cliente

Actualiza los datos de un cliente existente.

**Endpoint:**
```
PUT /clients/:id
```

**Parámetros:**
- `id` (integer, required) - ID del cliente

**Headers Requeridos:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Carlos López Actualizado",
  "email": "carlos.updated@example.com",
  "telefono": "3005555556",
  "empresa": "Services Inc Updated",
  "industria": "Servicios",
  "estado": "inactivo"
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": 3,
  "nombre": "Carlos López Actualizado",
  "email": "carlos.updated@example.com",
  "telefono": "3005555556",
  "empresa": "Services Inc Updated",
  "industria": "Servicios",
  "estado": "inactivo",
  "fecha_creacion": "2024-02-28T12:00:00.000Z",
  "fecha_actualizacion": "2024-02-28T13:00:00.000Z"
}
```

**Respuesta Error (404):**
```json
{
  "error": "Cliente no encontrado"
}
```

**Respuesta Error (400) - Validación Fallida:**
```json
{
  "errors": [
    "Email no válido"
  ]
}
```

**Ejemplo con curl:**
```bash
curl -X PUT http://localhost:5000/api/clients/3 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos López Actualizado",
    "email": "carlos.updated@example.com",
    "telefono": "3005555556",
    "empresa": "Services Inc Updated",
    "industria": "Servicios",
    "estado": "inactivo"
  }'
```

---

#### 5. Eliminar Cliente

Elimina un cliente de la base de datos.

**Endpoint:**
```
DELETE /clients/:id
```

**Parámetros:**
- `id` (integer, required) - ID del cliente a eliminar

**Respuesta Exitosa (200):**
```json
{
  "message": "Cliente eliminado",
  "client": {
    "id": 3,
    "nombre": "Carlos López",
    "email": "carlos@example.com",
    "telefono": "3005555555",
    "empresa": "Services Inc",
    "industria": "Servicios",
    "estado": "activo",
    "fecha_creacion": "2024-02-28T12:00:00.000Z",
    "fecha_actualizacion": "2024-02-28T12:00:00.000Z"
  }
}
```

**Respuesta Error (404):**
```json
{
  "error": "Cliente no encontrado"
}
```

**Ejemplo con curl:**
```bash
curl -X DELETE http://localhost:5000/api/clients/3
```

---

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## Validaciones

### Nombre
- Requerido
- Mínimo 2 caracteres
- Máximo 255 caracteres

### Email
- Requerido
- Formato válido (RFC 5322)
- Único en la base de datos
- Máximo 255 caracteres

### Teléfono
- Opcional
- Mínimo 7 caracteres
- Máximo 20 caracteres
- Caracteres permitidos: números, espacios, guiones, +, paréntesis

### Empresa
- Requerido
- Mínimo 1 carácter
- Máximo 255 caracteres

### Industria
- Requerido
- Valores válidos:
  - Tecnología
  - Retail
  - Servicios
  - Manufactura
  - Otros

### Estado
- Requerido
- Valores válidos:
  - potencial
  - activo
  - inactivo

---

## Manejo de Errores

Todos los errores retornan JSON con estructura:

```json
{
  "error": "Descripción del error"
}
```

o

```json
{
  "errors": [
    "Error 1",
    "Error 2"
  ]
}
```

---

## Rate Limiting

Por ahora no hay límite de tasa. Se puede implementar en futuras versiones.

---

## Ejemplos Completos

### Flujo Completo: Crear, Leer, Actualizar, Eliminar

```bash
# 1. Crear cliente
CLIENT_ID=$(curl -s -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nuevo Cliente",
    "email": "nuevo@example.com",
    "telefono": "3001234567",
    "empresa": "Nueva Empresa",
    "industria": "Tecnología",
    "estado": "potencial"
  }' | jq '.id')

echo "Cliente creado con ID: $CLIENT_ID"

# 2. Obtener cliente
curl -s -X GET http://localhost:5000/api/clients/$CLIENT_ID | jq .

# 3. Actualizar cliente
curl -s -X PUT http://localhost:5000/api/clients/$CLIENT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Cliente Actualizado",
    "email": "actualizado@example.com",
    "telefono": "3005555555",
    "empresa": "Empresa Actualizada",
    "industria": "Retail",
    "estado": "activo"
  }' | jq .

# 4. Listar todos
curl -s -X GET http://localhost:5000/api/clients | jq .

# 5. Eliminar cliente
curl -s -X DELETE http://localhost:5000/api/clients/$CLIENT_ID | jq .
```

---

## Notas Importantes

1. **Timezone**: Todas las fechas están en UTC (ISO 8601)
2. **Uniqueness**: El email debe ser único en toda la base de datos
3. **Cascade**: Eliminar un cliente lo elimina permanentemente (no hay soft delete)
4. **Timestamps**: Las fechas se actualizan automáticamente en la base de datos

---

Última actualización: 2024-02-28

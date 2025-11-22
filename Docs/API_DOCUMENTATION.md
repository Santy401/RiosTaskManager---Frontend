# 📡 API Documentation - RiosBackend

Documentación completa de los endpoints de la API REST de RiosBackend.

---

## 📋 Tabla de Contenidos

- [Información General](#información-general)
- [Autenticación](#autenticación)
- [Endpoints de Autenticación](#endpoints-de-autenticación)
- [Endpoints de Usuarios](#endpoints-de-usuarios)
- [Endpoints de Empresas](#endpoints-de-empresas)
- [Endpoints de Áreas](#endpoints-de-áreas)
- [Endpoints de Tareas](#endpoints-de-tareas)
- [Endpoints de Filtros](#endpoints-de-filtros-personalizados)
- [Códigos de Estado](#códigos-de-estado)
- [Manejo de Errores](#manejo-de-errores)

---

## 🌐 Información General

### Base URL

```
Development: http://localhost:3000
Production:  https://tu-dominio.vercel.app
```

### Formato de Respuesta

Todas las respuestas son en formato JSON.

```json
{
  "data": { ... },
  "error": null
}
```

### Headers Requeridos

```http
Content-Type: application/json
Cookie: auth-token=<JWT_TOKEN>
```

---

## 🔐 Autenticación

La API usa **JWT (JSON Web Tokens)** almacenados en cookies HTTP-only.

### Flujo de Autenticación

1. **Login** → Recibe JWT en cookie
2. **Requests subsecuentes** → Cookie enviada automáticamente
3. **Token expira** → Re-login requerido

### Roles

- `admin` - Acceso completo a todos los endpoints
- `user` - Acceso limitado a sus propias tareas

---

## 🔑 Endpoints de Autenticación

### Login

Autentica un usuario y retorna un JWT.

**Endpoint:** `POST /api/auth/login`

**Autenticación:** No requerida

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login exitoso",
  "user": {
    "id": "clx1234567890",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

**Cookies Set:**
```
auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 400 | Email y contraseña son requeridos |
| 404 | Usuario no encontrado |
| 401 | Contraseña incorrecta |
| 500 | Error interno del servidor |

**Ejemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }' \
  -c cookies.txt
```

---

### Get Current User

Obtiene información del usuario autenticado.

**Endpoint:** `GET /api/auth/me`

**Autenticación:** Requerida

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clx1234567890",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 401 | No autorizado (token inválido o ausente) |

**Ejemplo cURL:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

---

## 👥 Endpoints de Usuarios

### Listar Usuarios

Obtiene todos los usuarios del sistema.

**Endpoint:** `GET /api/admin/users`

**Autenticación:** Admin requerido

**Response:** `200 OK`
```json
[
  {
    "id": "clx1234567890",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "clx0987654321",
    "email": "user@example.com",
    "name": "Regular User",
    "role": "user",
    "createdAt": "2024-01-02T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
]
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 401 | No autorizado |
| 403 | Prohibido (no es admin) |

---

### Crear Usuario

Crea un nuevo usuario en el sistema.

**Endpoint:** `POST /api/admin/users`

**Autenticación:** Admin requerido

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "name": "New User",
  "password": "securepassword123",
  "role": "user"
}
```

**Validación:**
- `email`: String, formato email válido, único
- `name`: String, opcional
- `password`: String, mínimo 8 caracteres
- `role`: Enum, "admin" o "user"

**Response:** `201 Created`
```json
{
  "id": "clx1122334455",
  "email": "newuser@example.com",
  "name": "New User",
  "role": "user",
  "createdAt": "2024-01-03T00:00:00.000Z",
  "updatedAt": "2024-01-03T00:00:00.000Z"
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 400 | Datos inválidos o email ya existe |
| 401 | No autorizado |
| 403 | Prohibido (no es admin) |

---

### Obtener Usuario

Obtiene un usuario específico por ID.

**Endpoint:** `GET /api/admin/users/[id]`

**Autenticación:** Admin requerido

**Parámetros URL:**
- `id`: String (CUID del usuario)

**Response:** `200 OK`
```json
{
  "id": "clx1234567890",
  "email": "admin@example.com",
  "name": "Admin User",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 404 | Usuario no encontrado |
| 401 | No autorizado |
| 403 | Prohibido (no es admin) |

---

### Actualizar Usuario

Actualiza un usuario existente.

**Endpoint:** `PUT /api/admin/users/[id]`

**Autenticación:** Admin requerido

**Parámetros URL:**
- `id`: String (CUID del usuario)

**Request Body:**
```json
{
  "email": "updated@example.com",
  "name": "Updated Name",
  "role": "admin"
}
```

**Nota:** El password se actualiza solo si se proporciona.

**Response:** `200 OK`
```json
{
  "id": "clx1234567890",
  "email": "updated@example.com",
  "name": "Updated Name",
  "role": "admin",
  "updatedAt": "2024-01-04T00:00:00.000Z"
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 404 | Usuario no encontrado |
| 400 | Datos inválidos |
| 401 | No autorizado |
| 403 | Prohibido (no es admin) |

---

### Eliminar Usuario

Elimina un usuario del sistema.

**Endpoint:** `DELETE /api/admin/users/[id]`

**Autenticación:** Admin requerido

**Parámetros URL:**
- `id`: String (CUID del usuario)

**Response:** `200 OK`
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

**Errores:**

| Código | Descripción |
|--------|-------------|
| 404 | Usuario no encontrado |
| 401 | No autorizado |
| 403 | Prohibido (no es admin) |

---

## 🏢 Endpoints de Empresas

### Listar Empresas

**Endpoint:** `GET /api/admin/companies`

**Autenticación:** Admin requerido

**Response:** `200 OK`
```json
[
  {
    "id": "clx1234567890",
    "name": "Empresa ABC",
    "tipo": "SAS",
    "nit": "900123456-7",
    "cedula": null,
    "dian": "12345",
    "firma": "Firma Digital",
    "softwareContable": "Siigo",
    "usuario": "admin",
    "contraseña": "encrypted",
    "servidorCorreo": "smtp.gmail.com",
    "email": "empresa@abc.com",
    "claveCorreo": "encrypted",
    "claveCC": "encrypted",
    "claveSS": "encrypted",
    "claveICA": "encrypted",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Crear Empresa

**Endpoint:** `POST /api/admin/companies`

**Autenticación:** Admin requerido

**Request Body:**
```json
{
  "name": "Nueva Empresa",
  "tipo": "SAS",
  "nit": "900987654-3",
  "dian": "54321",
  "firma": "Firma Digital",
  "usuario": "admin",
  "contraseña": "password123",
  "servidorCorreo": "smtp.gmail.com",
  "email": "nueva@empresa.com"
}
```

**Response:** `201 Created`

---

### Actualizar Empresa

**Endpoint:** `PUT /api/admin/companies/[id]`

**Autenticación:** Admin requerido

**Response:** `200 OK`

---

### Eliminar Empresa

**Endpoint:** `DELETE /api/admin/companies/[id]`

**Autenticación:** Admin requerido

**Response:** `200 OK`

---

## 📊 Endpoints de Áreas

### Listar Áreas

**Endpoint:** `GET /api/admin/areas`

**Autenticación:** Admin requerido

**Response:** `200 OK`
```json
[
  {
    "id": "clx1234567890",
    "name": "Contabilidad",
    "state": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "clx0987654321",
    "name": "Recursos Humanos",
    "state": "active",
    "createdAt": "2024-01-02T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
]
```

---

### Crear Área

**Endpoint:** `POST /api/admin/areas`

**Autenticación:** Admin requerido

**Request Body:**
```json
{
  "name": "Nueva Área",
  "state": "active"
}
```

**Response:** `201 Created`

---

### Actualizar Área

**Endpoint:** `PUT /api/admin/areas/[id]`

**Autenticación:** Admin requerido

**Response:** `200 OK`

---

### Eliminar Área

**Endpoint:** `DELETE /api/admin/areas/[id]`

**Autenticación:** Admin requerido

**Response:** `200 OK`

---

## ✅ Endpoints de Tareas

### Listar Todas las Tareas (Admin)

**Endpoint:** `GET /api/admin/tasks`

**Autenticación:** Admin requerido

**Query Parameters:**
- `status`: String, opcional - Filtrar por estado
- `userId`: String, opcional - Filtrar por usuario
- `companyId`: String, opcional - Filtrar por empresa
- `areaId`: String, opcional - Filtrar por área

**Response:** `200 OK`
```json
[
  {
    "id": "clx1234567890",
    "name": "Revisar balance",
    "description": "Revisar balance del mes de enero",
    "companyId": "clx1111111111",
    "areaId": "clx2222222222",
    "userId": "clx3333333333",
    "dueDate": "2024-02-01T00:00:00.000Z",
    "status": "pending",
    "company": {
      "id": "clx1111111111",
      "name": "Empresa ABC"
    },
    "area": {
      "id": "clx2222222222",
      "name": "Contabilidad"
    },
    "user": {
      "id": "clx3333333333",
      "name": "Juan Pérez",
      "email": "juan@example.com"
    },
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

---

### Mis Tareas (User)

**Endpoint:** `GET /api/tasks/my-tasks`

**Autenticación:** Requerida (User o Admin)

**Response:** `200 OK`
```json
[
  {
    "id": "clx1234567890",
    "name": "Revisar balance",
    "description": "Revisar balance del mes de enero",
    "dueDate": "2024-02-01T00:00:00.000Z",
    "status": "pending",
    "company": {
      "name": "Empresa ABC"
    },
    "area": {
      "name": "Contabilidad"
    }
  }
]
```

---

### Crear Tarea

**Endpoint:** `POST /api/admin/tasks`

**Autenticación:** Admin requerido

**Request Body:**
```json
{
  "name": "Nueva tarea",
  "description": "Descripción de la tarea",
  "companyId": "clx1111111111",
  "areaId": "clx2222222222",
  "userId": "clx3333333333",
  "dueDate": "2024-02-15T00:00:00.000Z",
  "status": "pending"
}
```

**Validación:**
- `name`: String, requerido
- `description`: String, requerido
- `companyId`: String (CUID), requerido
- `areaId`: String (CUID), requerido
- `userId`: String (CUID), requerido
- `dueDate`: DateTime, requerido
- `status`: Enum, "pending" | "in_progress" | "completed"

**Response:** `201 Created`

---

### Actualizar Tarea

**Endpoint:** `PUT /api/admin/tasks/[id]`

**Autenticación:** Admin requerido

**Request Body:**
```json
{
  "name": "Tarea actualizada",
  "status": "in_progress"
}
```

**Response:** `200 OK`

---

### Eliminar Tarea

**Endpoint:** `DELETE /api/admin/tasks/[id]`

**Autenticación:** Admin requerido

**Response:** `200 OK`

---

## 🔍 Endpoints de Filtros Personalizados

### Listar Filtros

**Endpoint:** `GET /api/admin/custom-filters`

**Autenticación:** Admin requerido

**Query Parameters:**
- `entity`: String, opcional - Filtrar por entidad

**Response:** `200 OK`
```json
[
  {
    "id": "clx1234567890",
    "name": "Tareas Pendientes",
    "field": "status",
    "value": "pending",
    "entity": "task",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Crear Filtro

**Endpoint:** `POST /api/admin/custom-filters`

**Autenticación:** Admin requerido

**Request Body:**
```json
{
  "name": "Usuarios Activos",
  "field": "status",
  "value": "active",
  "entity": "user"
}
```

**Response:** `201 Created`

---

### Eliminar Filtro

**Endpoint:** `DELETE /api/admin/custom-filters/[id]`

**Autenticación:** Admin requerido

**Response:** `200 OK`

---

## 📊 Códigos de Estado

| Código | Significado | Descripción |
|--------|-------------|-------------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos inválidos en la solicitud |
| 401 | Unauthorized | No autenticado o token inválido |
| 403 | Forbidden | No tiene permisos para esta acción |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

---

## ❌ Manejo de Errores

### Formato de Error

Todos los errores siguen este formato:

```json
{
  "error": "Mensaje de error descriptivo"
}
```

### Errores de Validación (Zod)

```json
{
  "error": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["email"],
      "message": "Required"
    },
    {
      "code": "too_small",
      "minimum": 8,
      "type": "string",
      "inclusive": true,
      "path": ["password"],
      "message": "String must contain at least 8 character(s)"
    }
  ]
}
```

---

## 🔧 Ejemplos de Uso

### JavaScript/TypeScript (Fetch)

```typescript
// Login
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // Importante para cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};

// Get users
const getUsers = async () => {
  const response = await fetch('/api/admin/users', {
    credentials: 'include', // Envía cookies
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

// Create task
const createTask = async (taskData: CreateTaskInput) => {
  const response = await fetch('/api/admin/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};
```

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  -c cookies.txt

# Get users
curl -X GET http://localhost:3000/api/admin/users \
  -b cookies.txt

# Create task
curl -X POST http://localhost:3000/api/admin/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Nueva tarea",
    "description": "Descripción",
    "companyId": "clx1111111111",
    "areaId": "clx2222222222",
    "userId": "clx3333333333",
    "dueDate": "2024-02-15T00:00:00.000Z",
    "status": "pending"
  }'
```

---

## 📝 Notas Importantes

1. **Cookies HTTP-only**: El token JWT se almacena en una cookie HTTP-only por seguridad. No es accesible desde JavaScript.

2. **CORS**: En desarrollo, CORS está configurado para `localhost:3000`. En producción, ajustar según dominio.

3. **Rate Limiting**: Considerar implementar rate limiting en producción.

4. **Paginación**: Los endpoints de listado actualmente retornan todos los resultados. Considerar implementar paginación para grandes datasets.

5. **Filtrado**: Los endpoints de listado soportan filtrado básico vía query parameters.

---

## 🔮 Roadmap de API

Futuras mejoras planificadas:

- [ ] Paginación en endpoints de listado
- [ ] Búsqueda avanzada con query builder
- [ ] Webhooks para eventos
- [ ] GraphQL endpoint alternativo
- [ ] Versionado de API (v1, v2)
- [ ] Rate limiting
- [ ] API keys para integraciones
- [ ] Documentación OpenAPI/Swagger interactiva

---

**Última actualización:** Noviembre 2025

**Versión de API:** 1.0.0

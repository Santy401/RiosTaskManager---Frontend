# 🏗️ Arquitectura - RiosBackend Task Manager

Este documento describe la arquitectura técnica del proyecto RiosBackend.

---

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Arquitectura en Capas](#arquitectura-en-capas)
- [Estructura de Directorios](#estructura-de-directorios)
- [Flujo de Datos](#flujo-de-datos)
- [Patrones de Diseño](#patrones-de-diseño)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Seguridad](#seguridad)
- [Performance](#performance)
- [Escalabilidad](#escalabilidad)

---

## 🎯 Visión General

RiosBackend es una aplicación web full-stack construida con Next.js 16 usando el App Router. Sigue una arquitectura en capas que separa las responsabilidades y facilita el mantenimiento.

### Stack Principal

```
┌─────────────────────────────────────┐
│         Frontend (React 19)         │
├─────────────────────────────────────┤
│       Next.js 16 (App Router)       │
├─────────────────────────────────────┤
│      API Routes (REST API)          │
├─────────────────────────────────────┤
│      Prisma ORM (6.17)              │
├─────────────────────────────────────┤
│      PostgreSQL Database            │
└─────────────────────────────────────┘
```

### Principios Arquitectónicos

1. **Separación de Responsabilidades** - Cada capa tiene un propósito específico
2. **DRY (Don't Repeat Yourself)** - Código reutilizable en hooks y utilidades
3. **Type Safety** - TypeScript en todo el proyecto
4. **Server-First** - Aprovechar Server Components de React
5. **Progressive Enhancement** - Funciona sin JavaScript cuando es posible

---

## 🏛️ Arquitectura en Capas

### Capa 1: Presentación (UI Layer)

**Ubicación:** `/app/ui`

**Responsabilidad:** Componentes visuales y páginas

```
/app/ui/
├── components/        # Componentes React reutilizables
│   ├── Button.tsx
│   ├── Modal.tsx
│   ├── Table.tsx
│   └── ...
├── pages/            # Páginas de la aplicación
│   ├── Login/
│   └── Dashboard/
└── styles/           # Estilos globales
    └── globals.css
```

**Características:**
- Componentes "tontos" (presentational)
- No contienen lógica de negocio
- Reciben datos vía props
- Usan Radix UI para accesibilidad

**Ejemplo:**
```typescript
// ui/components/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
```

---

### Capa 2: Presentación Lógica (Presentation Layer)

**Ubicación:** `/app/presentation`

**Responsabilidad:** Hooks personalizados y lógica de UI

```
/app/presentation/
└── hooks/
    ├── User/
    │   ├── useUserQueries.ts    # Queries de usuarios
    │   └── useUserActions.ts     # Acciones de usuarios
    ├── Task/
    │   ├── useTaskQueries.ts
    │   └── useTaskActions.ts
    ├── Company/
    └── Area/
```

**Características:**
- Encapsula lógica de estado
- Maneja llamadas a API
- Gestiona loading/error states
- Reutilizable entre componentes

**Ejemplo:**
```typescript
// presentation/hooks/User/useUserQueries.ts
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { users, loading, error };
}
```

---

### Capa 3: Dominio (Domain Layer)

**Ubicación:** `/app/domain`

**Responsabilidad:** Entidades y reglas de negocio

```
/app/domain/
└── entities/
    ├── User.ts
    ├── Task.ts
    ├── Company.ts
    └── Area.ts
```

**Características:**
- Define tipos e interfaces
- Reglas de validación de negocio
- Independiente de frameworks
- Pure TypeScript

**Ejemplo:**
```typescript
// domain/entities/User.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name?: string;
  password: string;
  role: 'admin' | 'user';
}

// Reglas de negocio
export function canDeleteUser(user: User, currentUser: User): boolean {
  // Solo admins pueden eliminar usuarios
  if (currentUser.role !== 'admin') return false;
  // No puede eliminarse a sí mismo
  if (user.id === currentUser.id) return false;
  return true;
}
```

---

### Capa 4: API (API Layer)

**Ubicación:** `/app/api`

**Responsabilidad:** Endpoints REST

```
/app/api/
├── auth/
│   ├── login/route.ts
│   └── me/route.ts
├── admin/
│   ├── users/
│   │   ├── route.ts          # GET, POST /api/admin/users
│   │   └── [id]/route.ts     # GET, PUT, DELETE /api/admin/users/:id
│   ├── companies/
│   ├── areas/
│   └── tasks/
└── tasks/
    └── my-tasks/route.ts
```

**Características:**
- RESTful API
- Validación de entrada (Zod)
- Autenticación JWT
- Manejo de errores consistente

**Ejemplo:**
```typescript
// api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createUserSchema } from '@/lib/validations';

// GET /api/admin/users
export async function GET(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// POST /api/admin/users
export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createUserSchema.parse(body);
    
    const user = await createUser(data);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

---

### Capa 5: Lógica de Negocio (Business Logic Layer)

**Ubicación:** `/lib`

**Responsabilidad:** Lógica de negocio y utilidades

```
/lib/
├── auth.ts           # Autenticación y autorización
├── prisma.ts         # Cliente Prisma singleton
├── users.ts          # Lógica de usuarios
├── tasks.ts          # Lógica de tareas
├── companies.ts      # Lógica de empresas
└── areas.ts          # Lógica de áreas
```

**Características:**
- Funciones puras cuando es posible
- Lógica reutilizable
- Independiente de Next.js
- Fácil de testear

**Ejemplo:**
```typescript
// lib/users.ts
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export async function createUser(data: CreateUserInput): Promise<User> {
  // Validar email único
  const existing = await prisma.user.findUnique({
    where: { email: data.email }
  });
  
  if (existing) {
    throw new Error('Email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Crear usuario
  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({ where: { id } });
}
```

---

### Capa 6: Acceso a Datos (Data Access Layer)

**Ubicación:** `/prisma`

**Responsabilidad:** Esquema de base de datos y migraciones

```
/prisma/
├── schema.prisma     # Esquema de BD
├── migrations/       # Migraciones
└── seed.ts          # Datos de prueba
```

**Características:**
- Prisma ORM
- Type-safe queries
- Migraciones automáticas
- Relaciones definidas

**Ejemplo:**
```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?
  role      String?
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id          String   @id @default(cuid())
  name        String
  description String
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  status      String
  dueDate     DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🔄 Flujo de Datos

### Lectura de Datos (GET)

```
┌──────────┐
│  Usuario │
└────┬─────┘
     │ 1. Interacción
     ▼
┌──────────────┐
│  Componente  │
└────┬─────────┘
     │ 2. Usa hook
     ▼
┌──────────────┐
│  Custom Hook │
└────┬─────────┘
     │ 3. Fetch API
     ▼
┌──────────────┐
│  API Route   │
└────┬─────────┘
     │ 4. Verifica auth
     ▼
┌──────────────┐
│  Lib Function│
└────┬─────────┘
     │ 5. Query DB
     ▼
┌──────────────┐
│    Prisma    │
└────┬─────────┘
     │ 6. SQL Query
     ▼
┌──────────────┐
│  PostgreSQL  │
└──────────────┘
```

### Escritura de Datos (POST/PUT/DELETE)

```
┌──────────┐
│  Usuario │
└────┬─────┘
     │ 1. Submit form
     ▼
┌──────────────┐
│  Componente  │
└────┬─────────┘
     │ 2. Llama action hook
     ▼
┌──────────────┐
│  Action Hook │
└────┬─────────┘
     │ 3. POST/PUT/DELETE
     ▼
┌──────────────┐
│  API Route   │
└────┬─────────┘
     │ 4. Valida con Zod
     ▼
┌──────────────┐
│  Lib Function│
└────┬─────────┘
     │ 5. Mutate DB
     ▼
┌──────────────┐
│    Prisma    │
└────┬─────────┘
     │ 6. SQL Transaction
     ▼
┌──────────────┐
│  PostgreSQL  │
└────┬─────────┘
     │ 7. Response
     ▼
┌──────────────┐
│  Componente  │ → Update UI
└──────────────┘
```

---

## 🎨 Patrones de Diseño

### 1. Repository Pattern (Implícito con Prisma)

```typescript
// lib/users.ts actúa como repository
export const userRepository = {
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  create: (data: CreateUserInput) => createUser(data),
  update: (id: string, data: UpdateUserInput) => updateUser(id, data),
  delete: (id: string) => deleteUser(id),
};
```

### 2. Custom Hooks Pattern

```typescript
// Encapsula lógica de estado y efectos
export function useUsers() {
  const [state, setState] = useState({
    users: [],
    loading: true,
    error: null,
  });

  const refresh = useCallback(() => {
    // Lógica de refresh
  }, []);

  return { ...state, refresh };
}
```

### 3. Singleton Pattern (Prisma Client)

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### 4. Factory Pattern (Validación)

```typescript
// lib/validations/factory.ts
export function createEntitySchema<T>(fields: ZodRawShape) {
  return z.object({
    ...fields,
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  });
}

export const userSchema = createEntitySchema({
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(['admin', 'user']),
});
```

### 5. Middleware Pattern (Autenticación)

```typescript
// lib/middleware/auth.ts
export function withAuth(handler: RouteHandler) {
  return async (req: NextRequest) => {
    const auth = await verifyToken(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }
    
    // Agregar user al request
    req.user = auth.user;
    return handler(req);
  };
}

// Uso
export const GET = withAuth(async (req) => {
  const user = req.user; // Disponible aquí
  // ...
});
```

---

## 🔧 Decisiones Técnicas

### ¿Por qué Next.js App Router?

✅ **Ventajas:**
- Server Components por defecto (mejor performance)
- Layouts anidados
- Loading y error states integrados
- Streaming SSR
- API Routes co-ubicados

### ¿Por qué Prisma?

✅ **Ventajas:**
- Type-safe queries
- Migraciones automáticas
- Excelente DX
- Relaciones fáciles
- Prisma Studio para debugging

### ¿Por qué Radix UI?

✅ **Ventajas:**
- Accesibilidad out-of-the-box
- Unstyled (flexible)
- Composable
- WAI-ARIA compliant

### ¿Por qué Zustand sobre Redux?

✅ **Ventajas:**
- Más simple y ligero
- Menos boilerplate
- Hooks-first
- No requiere providers

---

## 🔒 Seguridad

### Autenticación

```typescript
// JWT con HTTP-only cookies
response.cookies.set('auth-token', token, {
  httpOnly: true,              // No accesible desde JavaScript
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en prod
  sameSite: 'lax',            // Protección CSRF
  maxAge: 60 * 60 * 24 * 7,   // 7 días
  path: '/',
});
```

### Autorización

```typescript
// Verificar rol en cada endpoint
export async function DELETE(req: NextRequest) {
  const auth = await verifyToken(req);
  
  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Proceder...
}
```

### Validación de Entrada

```typescript
// Zod para validar todos los inputs
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const data = schema.parse(input); // Throws si inválido
```

### Password Hashing

```typescript
// bcrypt con salt rounds adecuado
const hashedPassword = await bcrypt.hash(password, 10);
```

---

## ⚡ Performance

### Server Components

```typescript
// Por defecto, todos los componentes son Server Components
export default async function UsersPage() {
  const users = await prisma.user.findMany(); // Fetch en servidor
  
  return <UserList users={users} />;
}
```

### Streaming

```typescript
// Streaming con Suspense
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowComponent />
    </Suspense>
  );
}
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image 
  src="/logo.png" 
  width={200} 
  height={100}
  alt="Logo"
  priority // Para above-the-fold images
/>
```

---

## 📈 Escalabilidad

### Horizontal Scaling

- Stateless API (JWT en cookies)
- Database connection pooling
- CDN para assets estáticos

### Vertical Scaling

- Optimización de queries (Prisma)
- Caching (React Cache, Next.js)
- Code splitting automático

### Future Improvements

- [ ] Redis para caching
- [ ] Queue system (Bull/BullMQ)
- [ ] Microservices para features específicas
- [ ] GraphQL para queries complejas
- [ ] WebSockets para real-time

---

## 📊 Diagrama de Arquitectura Completo

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │    Hooks     │     │
│  │ (UI Layer)   │→ │ (UI Layer)   │→ │(Presentation)│     │
│  └──────────────┘  └──────────────┘  └──────┬───────┘     │
└────────────────────────────────────────────────┼───────────┘
                                                 │
                                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  /api/auth   │  │ /api/admin   │  │  /api/tasks  │     │
│  │              │  │              │  │              │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   auth.ts    │  │  users.ts    │  │  tasks.ts    │     │
│  │              │  │              │  │              │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA ACCESS                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Prisma ORM                              │  │
│  └──────────────────────┬───────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Conclusión

Esta arquitectura proporciona:

✅ **Mantenibilidad** - Código organizado y separado
✅ **Escalabilidad** - Fácil agregar nuevas features
✅ **Testabilidad** - Capas independientes fáciles de testear
✅ **Performance** - Server Components y optimizaciones
✅ **Seguridad** - Múltiples capas de protección
✅ **Developer Experience** - TypeScript y herramientas modernas

---

**Última actualización:** Noviembre 2025

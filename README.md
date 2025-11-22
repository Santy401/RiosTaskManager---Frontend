# 🚀 RiosBackend Task Manager

Sistema de gestión de tareas empresariales construido con Next.js 16, React 19, TypeScript y Prisma.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.17-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-316192?style=for-the-badge&logo=postgresql)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Scripts Disponibles](#-scripts-disponibles)
- [Deployment](#-deployment)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

### Funcionalidades Principales

- 🔐 **Autenticación JWT** - Sistema seguro de login con tokens HTTP-only
- 👥 **Gestión de Usuarios** - CRUD completo con roles (Admin/User)
- 🏢 **Gestión de Empresas** - Administración de información empresarial
- 📊 **Gestión de Áreas** - Organización por departamentos
- ✅ **Gestión de Tareas** - Sistema completo de task management
- 🎯 **Filtros Personalizados** - Filtrado avanzado de datos
- 📱 **Responsive Design** - Interfaz adaptable a todos los dispositivos
- 🌙 **Dark Mode** - Tema oscuro por defecto
- ♿ **Accesibilidad** - Componentes accesibles con Radix UI

### Características Técnicas

- ⚡ **Turbopack** - Build ultra rápido
- 🎨 **Tailwind CSS 4** - Estilos modernos y eficientes
- 🔄 **Server Components** - Renderizado optimizado
- 📦 **Standalone Output** - Deployment optimizado
- 🎭 **Framer Motion** - Animaciones fluidas
- 📊 **Analytics** - Vercel Analytics integrado

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 16.0.1 (App Router)
- **UI Library:** React 19.2.0
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.x
- **Components:** Radix UI (85+ componentes)
- **Forms:** React Hook Form + Zod
- **State:** Zustand
- **Animations:** Framer Motion

### Backend
- **Runtime:** Node.js
- **Database:** PostgreSQL
- **ORM:** Prisma 6.17.0
- **Authentication:** JWT (Jose)
- **Password Hashing:** bcryptjs

### DevOps
- **Deployment:** Vercel
- **Package Manager:** pnpm / npm
- **Linting:** ESLint
- **Build Tool:** Turbopack

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.x o superior
- **pnpm** 8.x o superior (recomendado) o **npm** 9.x
- **PostgreSQL** 14.x o superior
- **Git**

```bash
# Verificar versiones instaladas
node --version
pnpm --version
psql --version
```

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/RiosBackend.git
cd RiosBackend
```

### 2. Instalar Dependencias

```bash
# Con pnpm (recomendado)
pnpm install

# O con npm
npm install
```

### 3. Configurar Base de Datos

```bash
# Crear base de datos PostgreSQL
createdb riosbackend

# O usando psql
psql -U postgres
CREATE DATABASE riosbackend;
\q
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/riosbackend"
DIRECT_URL="postgresql://user:password@localhost:5432/riosbackend"

# JWT Secret (CRÍTICO: Genera uno seguro)
JWT_SECRET="tu-secreto-super-seguro-aqui"

# App
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### 🔐 Generar JWT Secret Seguro

```bash
# En Linux/Mac
openssl rand -base64 32

# En Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 2. Configurar Prisma

```bash
# Generar cliente de Prisma
pnpm prisma generate

# Ejecutar migraciones
pnpm prisma migrate dev

# Poblar base de datos con datos de prueba
pnpm db:seed
```

---

## 💻 Uso

### Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# El servidor estará disponible en:
# http://localhost:3000
```

### Producción

```bash
# Build de producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

### Credenciales de Prueba

Después de ejecutar `pnpm db:seed`:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Usuario:**
- Email: `user@example.com`
- Password: `user123`

---

## 📁 Estructura del Proyecto

```
RiosBackend/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # Autenticación
│   │   ├── admin/           # Endpoints admin
│   │   └── tasks/           # Endpoints tareas
│   ├── domain/              # Entidades de negocio
│   │   └── entities/        # Modelos de dominio
│   ├── presentation/        # Capa de presentación
│   │   └── hooks/           # Custom hooks (42)
│   └── ui/                  # Componentes UI
│       ├── components/      # Componentes React (85)
│       ├── pages/           # Páginas
│       └── styles/          # Estilos globales
├── lib/                     # Utilidades compartidas
│   ├── auth.ts             # Autenticación
│   ├── prisma.ts           # Cliente Prisma
│   ├── task.ts             # Lógica de tareas
│   ├── company.ts          # Lógica de empresas
│   ├── area.ts             # Lógica de áreas
│   └── users.ts            # Lógica de usuarios
├── prisma/                  # Configuración Prisma
│   ├── schema.prisma       # Schema de BD
│   ├── migrations/         # Migraciones
│   └── seed.ts             # Datos de prueba
├── public/                  # Archivos estáticos
├── .env.example            # Variables de entorno ejemplo
├── next.config.ts          # Configuración Next.js
├── tailwind.config.ts      # Configuración Tailwind
├── tsconfig.json           # Configuración TypeScript
└── package.json            # Dependencias
```

### Arquitectura en Capas

```
┌─────────────────────────────────────┐
│         UI Layer (app/ui)           │  ← Componentes React
├─────────────────────────────────────┤
│   Presentation (app/presentation)   │  ← Hooks y lógica UI
├─────────────────────────────────────┤
│      Domain (app/domain)            │  ← Entidades de negocio
├─────────────────────────────────────┤
│      API Routes (app/api)           │  ← Endpoints REST
├─────────────────────────────────────┤
│      Business Logic (lib)           │  ← Lógica de negocio
├─────────────────────────────────────┤
│      Data Access (Prisma)           │  ← ORM
└─────────────────────────────────────┘
│      Database (PostgreSQL)          │  ← Persistencia
└─────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login de usuario | No |
| GET | `/api/auth/me` | Obtener usuario actual | Sí |

### Usuarios (Admin)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/users` | Listar usuarios | Admin |
| POST | `/api/admin/users` | Crear usuario | Admin |
| PUT | `/api/admin/users/[id]` | Actualizar usuario | Admin |
| DELETE | `/api/admin/users/[id]` | Eliminar usuario | Admin |

### Empresas (Admin)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/companies` | Listar empresas | Admin |
| POST | `/api/admin/companies` | Crear empresa | Admin |
| PUT | `/api/admin/companies/[id]` | Actualizar empresa | Admin |
| DELETE | `/api/admin/companies/[id]` | Eliminar empresa | Admin |

### Áreas (Admin)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/areas` | Listar áreas | Admin |
| POST | `/api/admin/areas` | Crear área | Admin |
| PUT | `/api/admin/areas/[id]` | Actualizar área | Admin |
| DELETE | `/api/admin/areas/[id]` | Eliminar área | Admin |

### Tareas

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/tasks` | Listar todas las tareas | Admin |
| POST | `/api/admin/tasks` | Crear tarea | Admin |
| PUT | `/api/admin/tasks/[id]` | Actualizar tarea | Admin |
| DELETE | `/api/admin/tasks/[id]` | Eliminar tarea | Admin |
| GET | `/api/tasks/my-tasks` | Mis tareas | User |

### Filtros Personalizados

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/custom-filters` | Listar filtros | Admin |
| POST | `/api/admin/custom-filters` | Crear filtro | Admin |
| DELETE | `/api/admin/custom-filters/[id]` | Eliminar filtro | Admin |

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Servidor de desarrollo con Turbopack
pnpm build            # Build de producción
pnpm start            # Servidor de producción

# Base de Datos
pnpm db:seed          # Poblar BD con datos de prueba
prisma studio         # Interfaz visual de BD
prisma migrate dev    # Crear migración
prisma migrate deploy # Aplicar migraciones en prod

# Calidad de Código
pnpm lint             # Ejecutar ESLint
pnpm lint:fix         # Corregir errores de ESLint
pnpm lint:strict      # Lint estricto (0 warnings)
pnpm build:strict     # Build con lint estricto

# Utilidades
pnpm postinstall      # Generar cliente Prisma (automático)
```

---

## 🌐 Deployment

### Vercel (Recomendado)

1. **Conectar Repositorio**
   - Ve a [Vercel](https://vercel.com)
   - Importa tu repositorio de GitHub

2. **Configurar Variables de Entorno**
   ```
   DATABASE_URL=postgresql://...
   DIRECT_URL=postgresql://...
   JWT_SECRET=tu-secreto-seguro
   ```

3. **Deploy**
   - Vercel detectará automáticamente Next.js
   - El build se ejecutará automáticamente

### Variables de Entorno en Vercel

```bash
# Usando Vercel CLI
vercel env add DATABASE_URL
vercel env add JWT_SECRET
```

### Build Command

El proyecto usa un comando especial para Vercel:

```json
{
  "scripts": {
    "vercel-build": "prisma generate && next build"
  }
}
```

---

## 🗄️ Modelos de Base de Datos

### User
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?
  role      String?  // "admin" | "user"
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Company
```prisma
model Company {
  id        String   @id @default(cuid())
  name      String
  tipo      String
  nit       String
  // ... más campos
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Area
```prisma
model Area {
  id        String   @id @default(cuid())
  name      String
  state     String
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Task
```prisma
model Task {
  id          String   @id @default(cuid())
  name        String
  description String
  companyId   String
  areaId      String
  userId      String
  dueDate     DateTime
  status      String   // "pending" | "in_progress" | "completed"
  company     Company  @relation(fields: [companyId], references: [id])
  area        Area     @relation(fields: [areaId], references: [id])
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1. **Fork el proyecto**
2. **Crea una rama** (`git checkout -b feature/AmazingFeature`)
3. **Commit tus cambios** (`git commit -m 'Add: nueva característica'`)
4. **Push a la rama** (`git push origin feature/AmazingFeature`)
5. **Abre un Pull Request**

### Guía de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva característica
fix: corrección de bug
docs: cambios en documentación
style: formateo, punto y coma faltante, etc
refactor: refactorización de código
test: agregar tests
chore: actualizar dependencias
```

---

## 🐛 Reportar Bugs

Si encuentras un bug, por favor abre un [issue](https://github.com/tu-usuario/RiosBackend/issues) con:

- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots (si aplica)
- Versión de Node.js y navegador

---

## 📝 Roadmap

- [ ] Tests unitarios y de integración
- [ ] Documentación API con Swagger
- [ ] Notificaciones en tiempo real
- [ ] Sistema de comentarios en tareas
- [ ] Adjuntar archivos a tareas
- [ ] Dashboard con gráficas
- [ ] Exportar reportes (PDF, Excel)
- [ ] Integración con calendarios
- [ ] App móvil (React Native)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👥 Autores

- **Tu Nombre** - *Desarrollo Inicial* - [GitHub](https://github.com/tu-usuario)

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Vercel](https://vercel.com/) - Hosting y deployment
- [Prisma](https://www.prisma.io/) - ORM moderno
- [Radix UI](https://www.radix-ui.com/) - Componentes accesibles
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS

---

## 📞 Soporte

Si necesitas ayuda:

- 📧 Email: soporte@riosbackend.com
- 💬 Discord: [Únete a nuestro servidor](https://discord.gg/...)
- 📖 Documentación: [docs.riosbackend.com](https://docs.riosbackend.com)

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella! ⭐**

Hecho con ❤️ por el equipo de RiosBackend

</div>

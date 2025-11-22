# 🚨 Mejoras Críticas Pendientes - Checklist

Este documento contiene las mejoras **CRÍTICAS** que deben implementarse antes de deployment en producción.

---

## ⚠️ SEGURIDAD CRÍTICA (URGENTE)

### 1. Validación de Contraseñas en Login
**Archivo:** `app/api/auth/login/route.ts:27`

**Estado:** ❌ PENDIENTE

**Problema Actual:**
```typescript
const isPasswordValid = await bcrypt.compare(password, user.password || '');
```

**Solución Requerida:**
```typescript
if (!user.password) {
  return NextResponse.json({ error: 'Usuario inválido' }, { status: 400 });
}
const isPasswordValid = await bcrypt.compare(password, user.password);
```

**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 5 minutos

---

### 2. Encriptar Contraseñas de Company
**Archivo:** `prisma/schema.prisma` y archivos relacionados

**Estado:** ❌ PENDIENTE

**Problema Actual:**
```prisma
model Company {
  contraseña String  // ❌ Texto plano
  claveCorreo String? // ❌ Texto plano
  claveCC   String?  // ❌ Texto plano
  claveSS   String?  // ❌ Texto plano
  claveICA  String?  // ❌ Texto plano
}
```

**Solución Requerida:**
1. Crear función de encriptación/desencriptación
2. Migrar datos existentes
3. Actualizar endpoints de Company

**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 2-3 horas

---

### 3. Implementar Prisma Singleton
**Archivos:** Múltiples archivos de API

**Estado:** ❌ PENDIENTE

**Problema Actual:**
```typescript
// En cada archivo
const prisma = new PrismaClient();
```

**Solución Requerida:**
```typescript
// lib/prisma.ts (ya existe, pero no se usa)
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// En todos los archivos de API
import { prisma } from '@/lib/prisma';
```

**Archivos a actualizar:**
- `app/api/auth/login/route.ts`
- `app/api/admin/users/route.ts`
- `app/api/admin/users/[id]/route.ts`
- `app/api/admin/companies/route.ts`
- `app/api/admin/companies/[id]/route.ts`
- `app/api/admin/areas/route.ts`
- `app/api/admin/areas/[id]/route.ts`
- `app/api/admin/tasks/route.ts`
- `app/api/admin/tasks/[id]/route.ts`
- Y otros...

**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 30 minutos

---

### 4. Validar JWT_SECRET en Startup
**Archivo:** Crear `lib/env.ts`

**Estado:** ❌ PENDIENTE

**Solución Requerida:**
```typescript
// lib/env.ts
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado. Genera uno con: openssl rand -base64 32');
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está configurado');
}

export const env = {
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
```

**Importar en:** `app/layout.tsx` o `app/api/*/route.ts`

**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 15 minutos

---

### 5. Corregir Configuración CORS
**Archivo:** `app/api/_cors.ts`

**Estado:** ❌ PENDIENTE

**Problema Actual:**
```typescript
response.headers.set("Access-Control-Allow-Origin", 
  "https://riosbackendtask.vercel.app, https://riosbackendtask.vercel.app/ui/pages/Login/, http://localhost:3000/ui/pages/Login/");
```

**Solución Requerida:**
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGIN || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 20 minutos

---

## 🧹 CALIDAD DE CÓDIGO (ALTA PRIORIDAD)

### 6. Implementar Logger Estructurado
**Archivo:** Crear `lib/logger.ts`

**Estado:** ❌ PENDIENTE

**Solución:**
```typescript
// lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (process.env.NODE_ENV === 'production') {
      return level === 'error' || level === 'warn';
    }
    return true;
  }

  debug(message: string, ...args: any[]) {
    if (this.shouldLog('debug')) {
      console.log(`🔍 [DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.shouldLog('info')) {
      console.log(`ℹ️  [INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.shouldLog('warn')) {
      console.warn(`⚠️  [WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: Error | unknown) {
    if (this.shouldLog('error')) {
      console.error(`❌ [ERROR] ${message}`, error);
    }
  }
}

export const logger = new Logger();
```

**Reemplazar en todos los archivos:**
```typescript
// ❌ Antes
console.log('User logged in:', user.email);

// ✅ Después
logger.info('User logged in', { email: user.email });
```

**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 1-2 horas (reemplazar en ~40 archivos)

---

### 7. Implementar Validación con Zod
**Archivo:** Crear `lib/validations/`

**Estado:** ❌ PENDIENTE

**Solución:**
```typescript
// lib/validations/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Contraseña debe tener mínimo 8 caracteres'),
});

// lib/validations/user.ts
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  password: z.string().min(8),
  role: z.enum(['admin', 'user']),
});

export const updateUserSchema = createUserSchema.partial();

// lib/validations/task.ts
export const createTaskSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  companyId: z.string().cuid(),
  areaId: z.string().cuid(),
  userId: z.string().cuid(),
  dueDate: z.string().datetime(),
  status: z.enum(['pending', 'in_progress', 'completed']),
});
```

**Usar en endpoints:**
```typescript
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body); // Valida y tipea
    // ...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
  }
}
```

**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 2-3 horas

---

### 8. Habilitar ESLint Gradualmente
**Archivo:** `eslint.config.mjs`

**Estado:** ❌ PENDIENTE

**Solución:**
```javascript
// Habilitar reglas una por una
{
  rules: {
    "@typescript-eslint/no-explicit-any": "warn", // Empezar con warn
    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": "warn",
    // Ir cambiando a "error" gradualmente
  }
}
```

**Prioridad:** 🟢 MEDIA  
**Tiempo estimado:** 1 hora + correcciones

---

## 🧪 TESTING (ALTA PRIORIDAD)

### 9. Configurar Vitest
**Archivos:** Crear configuración de testing

**Estado:** ❌ PENDIENTE

**Pasos:**
1. Instalar dependencias
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

2. Crear `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

3. Crear `vitest.setup.ts`
```typescript
import '@testing-library/jest-dom';
```

4. Agregar scripts a `package.json`
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 1 hora

---

### 10. Crear Tests Básicos
**Archivos:** Crear `__tests__/` directories

**Estado:** ❌ PENDIENTE

**Ejemplos:**
```typescript
// __tests__/lib/auth.test.ts
import { describe, it, expect } from 'vitest';
import { verifyToken } from '@/lib/auth';

describe('Auth', () => {
  it('should reject invalid token', async () => {
    const mockReq = {
      cookies: {
        get: () => ({ value: 'invalid-token' })
      }
    };
    
    const result = await verifyToken(mockReq as any);
    expect(result.error).toBeDefined();
  });
});
```

**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 3-4 horas

---

## 📊 Resumen de Prioridades

### 🔴 CRÍTICO (Hacer HOY)
- [ ] Validación de contraseñas en login
- [ ] Validar JWT_SECRET en startup

### 🟡 ALTA (Esta Semana)
- [ ] Encriptar contraseñas de Company
- [ ] Implementar Prisma singleton
- [ ] Corregir CORS
- [ ] Implementar logger
- [ ] Validación con Zod
- [ ] Configurar testing

### 🟢 MEDIA (Este Mes)
- [ ] Habilitar ESLint
- [ ] Crear tests básicos
- [ ] Configurar Prettier + Husky

---

## 📝 Comandos Rápidos

```bash
# Generar JWT secret
openssl rand -base64 32

# Verificar variables de entorno
cat .env

# Ejecutar linter
pnpm lint

# Build para verificar
pnpm build

# Ejecutar tests (cuando estén configurados)
pnpm test
```

---

## ✅ Checklist de Deployment

Antes de hacer deployment a producción:

- [ ] Todas las mejoras CRÍTICAS implementadas
- [ ] JWT_SECRET configurado en Vercel
- [ ] DATABASE_URL configurado en Vercel
- [ ] CORS configurado correctamente
- [ ] Contraseñas encriptadas
- [ ] Logger implementado
- [ ] Build exitoso sin errores
- [ ] Tests básicos pasando
- [ ] Variables de entorno documentadas
- [ ] README actualizado

---

**Creado:** Noviembre 21, 2025  
**Última actualización:** Noviembre 21, 2025

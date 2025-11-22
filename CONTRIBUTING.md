# 🤝 Guía de Contribución - RiosBackend

¡Gracias por tu interés en contribuir a RiosBackend! Este documento te guiará a través del proceso.

---

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Guía de Commits](#guía-de-commits)
- [Pull Requests](#pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

---

## 📜 Código de Conducta

### Nuestro Compromiso

Nos comprometemos a hacer de la participación en este proyecto una experiencia libre de acoso para todos, independientemente de:

- Edad
- Tamaño corporal
- Discapacidad
- Etnia
- Identidad y expresión de género
- Nivel de experiencia
- Nacionalidad
- Apariencia personal
- Raza
- Religión
- Identidad y orientación sexual

### Comportamiento Esperado

✅ Usar lenguaje acogedor e inclusivo
✅ Respetar diferentes puntos de vista
✅ Aceptar críticas constructivas
✅ Enfocarse en lo mejor para la comunidad
✅ Mostrar empatía hacia otros miembros

### Comportamiento Inaceptable

❌ Uso de lenguaje o imágenes sexualizadas
❌ Comentarios insultantes o despectivos (trolling)
❌ Acoso público o privado
❌ Publicar información privada de otros
❌ Conducta no profesional

---

## 🚀 ¿Cómo Puedo Contribuir?

### 1. Reportar Bugs 🐛

Si encuentras un bug:

1. **Verifica** que no exista un issue similar
2. **Abre un nuevo issue** usando la plantilla de bug
3. **Incluye**:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots (si aplica)
   - Versión de Node.js, navegador, OS

### 2. Sugerir Mejoras 💡

Para sugerir nuevas características:

1. **Abre un issue** con la etiqueta `enhancement`
2. **Describe**:
   - El problema que resuelve
   - La solución propuesta
   - Alternativas consideradas
   - Impacto en usuarios existentes

### 3. Contribuir Código 💻

1. **Fork** el repositorio
2. **Crea una rama** desde `main`
3. **Implementa** tus cambios
4. **Escribe tests** (si aplica)
5. **Abre un Pull Request**

### 4. Mejorar Documentación 📚

La documentación siempre puede mejorar:

- Corregir typos
- Aclarar instrucciones confusas
- Agregar ejemplos
- Traducir a otros idiomas

---

## 🛠️ Configuración del Entorno

### Requisitos

- Node.js 18.x o superior
- pnpm 8.x o superior
- PostgreSQL 14.x o superior
- Git

### Setup Inicial

```bash
# 1. Fork y clonar
git clone https://github.com/TU_USUARIO/RiosBackend.git
cd RiosBackend

# 2. Agregar upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/RiosBackend.git

# 3. Instalar dependencias
pnpm install

# 4. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores

# 5. Configurar base de datos
createdb riosbackend_dev
pnpm prisma migrate dev
pnpm db:seed

# 6. Iniciar servidor de desarrollo
pnpm dev
```

### Verificar Instalación

```bash
# Lint
pnpm lint

# Build
pnpm build

# Tests (cuando estén configurados)
pnpm test
```

---

## 🔄 Proceso de Desarrollo

### 1. Sincronizar con Upstream

Antes de empezar a trabajar:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Crear Rama de Feature

```bash
# Nomenclatura: tipo/descripcion-corta
git checkout -b feature/add-notifications
git checkout -b fix/login-validation
git checkout -b docs/update-readme
```

Tipos de ramas:
- `feature/` - Nueva funcionalidad
- `fix/` - Corrección de bug
- `docs/` - Documentación
- `refactor/` - Refactorización
- `test/` - Tests
- `chore/` - Mantenimiento

### 3. Desarrollar

```bash
# Hacer cambios
# ...

# Verificar cambios
git status
git diff

# Agregar cambios
git add .

# Commit (ver guía de commits)
git commit -m "feat: add email notifications"
```

### 4. Mantener Rama Actualizada

```bash
# Periódicamente
git fetch upstream
git rebase upstream/main
```

### 5. Push y Pull Request

```bash
# Push a tu fork
git push origin feature/add-notifications

# Abrir PR en GitHub
```

---

## 📝 Estándares de Código

### TypeScript

```typescript
// ✅ BUENO: Tipos explícitos
interface User {
  id: string;
  email: string;
  name?: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ MALO: Uso de any
function getUser(id: any): any {
  // ...
}
```

### React Components

```typescript
// ✅ BUENO: Componente tipado
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ MALO: Sin tipos
export function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Hooks

```typescript
// ✅ BUENO: Hook personalizado tipado
export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error };
}
```

### API Routes

```typescript
// ✅ BUENO: Validación con Zod
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createUserSchema.parse(body);
    
    // Procesar...
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### Naming Conventions

```typescript
// Variables y funciones: camelCase
const userName = 'John';
function getUserById(id: string) {}

// Componentes y clases: PascalCase
class UserService {}
function UserProfile() {}

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// Archivos:
// - Componentes: PascalCase.tsx
// - Utilidades: camelCase.ts
// - Hooks: useCamelCase.ts
```

### Organización de Imports

```typescript
// 1. Imports de Node/externos
import { useState, useEffect } from 'react';
import { NextRequest, NextResponse } from 'next/server';

// 2. Imports internos absolutos
import { Button } from '@/ui/components/Button';
import { useUser } from '@/presentation/hooks/useUser';

// 3. Imports relativos
import { validateEmail } from './utils';

// 4. Tipos
import type { User } from '@/domain/entities/User';
```

### Comentarios

```typescript
// ✅ BUENO: Comentarios útiles
/**
 * Valida y crea un nuevo usuario en el sistema.
 * 
 * @param data - Datos del usuario a crear
 * @returns Usuario creado con ID generado
 * @throws {ValidationError} Si los datos son inválidos
 */
export async function createUser(data: CreateUserInput): Promise<User> {
  // Validar email único antes de crear
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new ValidationError('Email already exists');
  }
  
  return prisma.user.create({ data });
}

// ❌ MALO: Comentarios obvios
// Crea un usuario
function createUser(data) {
  // Retorna el usuario
  return data;
}
```

---

## 📋 Guía de Commits

### Conventional Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>[scope opcional]: <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formateo, punto y coma, etc (no afecta código)
- `refactor`: Refactorización (no es feat ni fix)
- `perf`: Mejora de performance
- `test`: Agregar o corregir tests
- `chore`: Mantenimiento (deps, config, etc)
- `ci`: Cambios en CI/CD
- `build`: Cambios en build system

### Ejemplos

```bash
# Feature
git commit -m "feat: add email notifications for tasks"
git commit -m "feat(auth): implement 2FA authentication"

# Fix
git commit -m "fix: resolve login redirect issue"
git commit -m "fix(api): handle null user in task creation"

# Docs
git commit -m "docs: update installation instructions"
git commit -m "docs(readme): add API endpoints section"

# Refactor
git commit -m "refactor: extract user validation logic"
git commit -m "refactor(hooks): simplify useUser implementation"

# Breaking Change
git commit -m "feat!: change API response format

BREAKING CHANGE: API now returns { data, meta } instead of direct data"
```

### Reglas

✅ **DO:**
- Usar imperativo ("add" no "added" ni "adds")
- Primera letra minúscula
- Sin punto final
- Descripción clara y concisa
- Incluir scope si es específico a un módulo

❌ **DON'T:**
- Commits vagos ("fix stuff", "update")
- Múltiples cambios no relacionados en un commit
- Commits muy grandes (>300 líneas)

---

## 🔍 Pull Requests

### Antes de Abrir un PR

✅ Checklist:

- [ ] Código sigue los estándares del proyecto
- [ ] Tests pasan (cuando estén configurados)
- [ ] Lint pasa (`pnpm lint`)
- [ ] Build exitoso (`pnpm build`)
- [ ] Documentación actualizada (si aplica)
- [ ] Commits siguen Conventional Commits
- [ ] Rama actualizada con `main`

### Plantilla de PR

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix (cambio que corrige un issue)
- [ ] Nueva funcionalidad (cambio que agrega funcionalidad)
- [ ] Breaking change (fix o feature que causa que funcionalidad existente no funcione)
- [ ] Documentación

## ¿Cómo se ha probado?
Describe las pruebas realizadas

## Screenshots (si aplica)
Agrega screenshots si hay cambios visuales

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado self-review de mi código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He agregado tests que prueban mi fix/feature
- [ ] Tests nuevos y existentes pasan localmente
```

### Proceso de Review

1. **Autor** abre PR
2. **Reviewers** son asignados automáticamente
3. **Review** se realiza (puede haber comentarios)
4. **Autor** responde a comentarios y hace cambios
5. **Aprobación** de al menos 1 reviewer
6. **Merge** por maintainer

### Responder a Comentarios

```bash
# Hacer cambios solicitados
git add .
git commit -m "refactor: apply review suggestions"
git push origin feature/my-feature
```

---

## 🐛 Reportar Bugs

### Plantilla de Bug Report

```markdown
**Descripción del Bug**
Descripción clara y concisa del bug

**Pasos para Reproducir**
1. Ve a '...'
2. Click en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado**
Qué debería pasar

**Comportamiento Actual**
Qué pasa actualmente

**Screenshots**
Si aplica, agrega screenshots

**Entorno**
- OS: [e.g. macOS 13.0]
- Navegador: [e.g. Chrome 120]
- Node.js: [e.g. 18.17.0]
- Versión del proyecto: [e.g. 0.1.0]

**Contexto Adicional**
Cualquier otra información relevante
```

---

## 💡 Sugerir Mejoras

### Plantilla de Feature Request

```markdown
**¿Tu feature request está relacionado a un problema?**
Descripción clara del problema. Ej: "Siempre me frustra cuando..."

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que pase

**Describe alternativas que has considerado**
Otras soluciones o features que has considerado

**Contexto Adicional**
Screenshots, mockups, ejemplos de otros proyectos, etc
```

---

## 🎯 Áreas que Necesitan Ayuda

Siempre buscamos ayuda en:

- 🧪 **Testing** - Escribir tests unitarios y de integración
- 📚 **Documentación** - Mejorar docs, agregar ejemplos
- 🐛 **Bug Fixes** - Corregir issues abiertos
- ♿ **Accesibilidad** - Mejorar a11y
- 🌍 **Internacionalización** - Traducir a otros idiomas
- 🎨 **UI/UX** - Mejorar diseño y experiencia de usuario

Revisa los issues con las etiquetas:
- `good first issue` - Ideal para principiantes
- `help wanted` - Necesitamos ayuda
- `documentation` - Mejoras en docs

---

## 📞 Contacto

¿Preguntas? Contáctanos:

- 💬 Discord: [Únete a nuestro servidor](#)
- 📧 Email: dev@riosbackend.com
- 🐦 Twitter: [@RiosBackend](#)

---

## 🙏 Agradecimientos

¡Gracias por contribuir a RiosBackend! Cada contribución, por pequeña que sea, hace una gran diferencia.

---

<div align="center">

**⭐ Happy Coding! ⭐**

</div>

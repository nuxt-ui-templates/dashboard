# 📊 Nuxt Dashboard Admin Template

[![Nuxt](https://img.shields.io/badge/Nuxt-4.4-00DC82?logo=nuxt&labelColor=020420)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org)
[![Nuxt UI](https://img.shields.io/badge/Powered%20by-Nuxt%20UI-00DC82?logo=nuxt)](https://ui.nuxt.com)
[![ESLint](https://img.shields.io/badge/Code%20Quality-ESLint-4B3DDF)](https://eslint.org)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

Un template moderno y completamente funcional de panel de administración construido con **Nuxt 4**, **Vue 3** y **Nuxt UI**. Incluye múltiples páginas, sidebar colapsable, modo oscuro/claro, paleta de comandos, validación de tipos, linting automático y más.

---

## 🎯 Objetivo del Proyecto

Proporcionar una **solución lista para producción** de dashboard administrativo que permita:

- ✅ Gestionar clientes y miembros del equipo con modales interactivos
- ✅ Visualizar métricas de ventas con gráficos interactivos (Unovis)
- ✅ Administrar notificaciones, correos y mensajes
- ✅ Configurar preferencias de seguridad y notificaciones
- ✅ Cambiar entre modo claro y oscuro automáticamente
- ✅ Acceso responsivo desde cualquier dispositivo
- ✅ Código tipado completamente con TypeScript
- ✅ CI/CD integrado con GitHub Actions
- ✅ Fácil de extender con nuevas páginas y funcionalidades
- ✅ Mantenimiento automático de dependencias con Renovate

---

## 🚀 Características Principales

- **🎨 Interfaz moderna**: Construida con Nuxt UI, Tailwind CSS v4 y componentes Vue 3
- **🌗 Modo oscuro/claro**: Cambio automático según preferencias del sistema
- **📱 Responsive**: Funciona perfectamente en desktop, tablet y móvil
- **⌨️ Atajos de teclado**: Navegación rápida con comandos
- **📊 Gráficos interactivos**: Visualización de datos con Unovis y Vue wrapper
- **🔗 API integrada**: Endpoints listos para datos reales (customers, members, mails, notifications)
- **📦 TypeScript**: Code intellisense completo y tipado fuerte
- **🧪 Linting y validación**: ESLint integrado con validación de tipos
- **🤖 CI/CD automático**: GitHub Actions para lint, typecheck y deploy
- **🔄 Mantenimiento automático**: Renovate integrado para actualizaciones

---

## 📋 Requisitos Previos

- **Node.js** 18+ o superior (se recomienda 22+)
- **pnpm** 10.33.2 (o npm/yarn compatible)
- **Git** para control de versiones
- Conocimientos básicos de Vue 3 y Nuxt

---

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/dashboard.git
cd dashboard
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno (opcional)

```bash
cp .env.example .env.local
```

Edita `.env.local`:
```env
# Public URL, used for OG Image when running nuxt generate
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Iniciar servidor de desarrollo

```bash
pnpm dev
```

El dashboard estará disponible en: **http://localhost:3000**

---

## 📖 Uso Básico

### Estructura del Proyecto

```
dashboard/
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions CI/CD
├── app/
│   ├── components/                     # Componentes Vue reutilizables
│   │   ├── NotificationsSlideover.vue  # Panel lateral de notificaciones
│   │   ├── TeamsMenu.vue               # Menú de equipos
│   │   ├── UserMenu.vue                # Menú de usuario
│   │   ├── customers/
│   │   │   ├── AddModal.vue            # Modal para agregar cliente
│   │   │   └── DeleteModal.vue         # Modal para eliminar cliente
│   │   ├── home/
│   │   │   ├── HomeChart.client.vue    # Gráfico (cliente)
│   │   │   ├── HomeChart.server.vue    # Gráfico (servidor)
│   │   │   ├── HomeDateRangePicker.vue # Selector de rango de fechas
│   │   │   ├── HomePeriodSelect.vue    # Selector de período
│   │   │   ├── HomeSales.vue           # Estadísticas de ventas
│   │   │   └── HomeStats.vue           # Estadísticas generales
│   │   ├── inbox/
│   │   │   ├── InboxList.vue           # Lista de correos
│   │   │   └── InboxMail.vue           # Detalle de correo
│   │   └── settings/
│   │       └── MembersList.vue         # Lista de miembros
│   ├── composables/
│   │   └── useDashboard.ts             # Lógica compartida del dashboard
│   ├── layouts/
│   │   └── default.vue                 # Layout principal con sidebar
│   ├── pages/                          # Rutas automáticas
│   │   ├── customers.vue               # Página de clientes
│   │   ├── inbox.vue                   # Página de inbox
│   │   ├── index.vue                   # Página de inicio
│   │   ├── settings.vue                # Página de configuración
│   │   └── settings/
│   │       ├── index.vue               # Resumen de configuración
│   │       ├── members.vue             # Gestión de miembros
│   │       ├── notifications.vue       # Configuración de notificaciones
│   │       └── security.vue            # Configuración de seguridad
│   ├── types/
│   │   └── index.d.ts                  # Definiciones TypeScript globales
│   ├── utils/
│   │   └── index.ts                    # Funciones utilitarias
│   ├── assets/css/
│   │   └── main.css                    # Estilos globales (Tailwind)
│   ├── app.vue                         # Componente raíz
│   ├── error.vue                       # Página de error
│   └── app.config.ts                   # Configuración de app
├── server/
│   └── api/                            # Endpoints de API serverless
│       ├── customers.ts                # Gestión de clientes
│       ├── members.ts                  # Gestión de miembros
│       ├── mails.ts                    # Gestión de correos
│       └── notifications.ts            # Gestión de notificaciones
├── public/                             # Assets estáticos (favicon, logo, etc)
│   └── [archivos estáticos del sitio]
├── .editorconfig                       # Configuración de editor
├── .env.example                        # Variables de entorno de ejemplo
├── eslint.config.mjs                   # Configuración de ESLint
├── nuxt.config.ts                      # Configuración de Nuxt
├── package.json                        # Dependencias del proyecto
├── pnpm-lock.yaml                      # Lock file de pnpm (NO editar)
├── pnpm-workspace.yaml                 # Configuración de workspace
├── renovate.json                       # Configuración de renovate
├── tsconfig.json                       # Configuración de TypeScript
├── README.md                           # Documentación original
└── README_mejorado.md                  # Esta documentación
```

### Carpeta `/public`

Contiene todos los **assets estáticos** que se sirven directamente:

```
public/
├── favicon.ico                 # Icono del sitio
├── logo.png                    # Logo de la marca
├── logo-dark.png              # Logo versión oscura
├── images/
│   ├── hero.jpg               # Imágenes de héroe
│   └── screenshots/           # Screenshots del dashboard
├── fonts/
│   └── custom-fonts.woff2     # Fuentes personalizadas
└── docs/
    └── guide.pdf              # Documentación PDF
```

**Nota:** Los archivos en `public/` se sirven con las rutas:
- `public/favicon.ico` → `/favicon.ico`
- `public/images/logo.png` → `/images/logo.png`

### Páginas Disponibles

| Página | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| **Inicio** | `/` | Dashboard principal con estadísticas y gráficos | Menú lateral |
| **Clientes** | `/customers` | Gestión de lista de clientes con modal de agregar/eliminar | Menú lateral |
| **Inbox** | `/inbox` | Visualización de correos recibidos | Menú lateral |
| **Configuración** | `/settings` | Página de configuración con subrutas | Menú usuario |
| **Miembros** | `/settings/members` | Gestión de miembros del equipo | Configuración |
| **Notificaciones** | `/settings/notifications` | Preferencias de notificaciones | Configuración |
| **Seguridad** | `/settings/security` | Configuración de seguridad | Configuración |

---

## 💻 Ejemplos de Uso

### Ejemplo 1: Iniciar el Dashboard

```bash
pnpm dev
```

Se abrirá automáticamente en `http://localhost:3000` con:
- Dashboard de inicio con estadísticas en tiempo real
- Gráficos interactivos de ventas
- Selector de rango de fechas
- Menú lateral colapsable

### Ejemplo 2: Agregar un Nuevo Cliente

1. Haz clic en **Clientes** en el menú lateral
2. Presiona el botón **"+ Agregar"** o usa `Cmd+K` → "Add Customer"
3. Completa el formulario en el modal:
   - Nombre
   - Email
   - Teléfono
   - Estado
4. Haz clic en **"Guardar"**
5. El cliente aparecerá automáticamente en la lista

### Ejemplo 3: Cambiar Modo Oscuro/Claro

```javascript
// En cualquier componente Vue
const colorMode = useColorMode()

// Alternar tema
colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
```

O simplemente haz clic en el icono de sol/luna en la esquina superior derecha.

### Ejemplo 4: Acceder a la Configuración

1. Haz clic en tu **avatar** de usuario (esquina superior derecha)
2. Selecciona **"Settings"** del menú desplegable
3. Explora las secciones:
   - **Miembros**: Gestiona tu equipo
   - **Notificaciones**: Personaliza alertas y notificaciones
   - **Seguridad**: Configura contraseña y 2FA

### Ejemplo 5: Usar la Paleta de Comandos

Presiona `Cmd+K` (Mac) o `Ctrl+K` (Windows/Linux) para abrir la paleta de comandos:
- Busca "Add Customer"
- Busca "Settings"
- Busca "Dashboard"
- Navega entre páginas rápidamente

---

## 🔧 Comandos Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor en localhost:3000 con hot reload

# Construcción
pnpm build            # Compila para producción (.output)
pnpm preview          # Vista previa local de la build de producción

# Calidad de código
pnpm lint             # Ejecuta ESLint con autofix
pnpm typecheck        # Valida tipos TypeScript sin compilar

# Utilidades
pnpm postinstall      # Prepara Nuxt (se ejecuta automáticamente)
```

---

## 🎨 Personalización

### Cambiar Colores y Tema

Edita el archivo `app/assets/css/main.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Estilos personalizados globales */
:root {
  --primary-color: #00DC82;
  --text-dark: #1a1a1a;
}
```

### Agregar una Nueva Página

1. Crea un archivo en `app/pages/mi-pagina.vue`:

```vue
<template>
  <div>
    <h1>Mi Nueva Página</h1>
    <p>La ruta será automáticamente /mi-pagina</p>
  </div>
</template>
```

2. La ruta `/mi-pagina` estará automáticamente disponible

### Agregar un Nuevo Endpoint API

1. Crea un archivo en `server/api/mi-endpoint.ts`:

```typescript
export default defineEventHandler(async (event) => {
  return {
    message: 'Hello from API',
    timestamp: new Date()
  }
})
```

2. Accede desde componentes:

```typescript
const { data } = await useFetch('/api/mi-endpoint')
```

### Agregar un Nuevo Componente

1. Crea en `app/components/MiComponente.vue`
2. Se importará automáticamente en toda la app

```vue
<template>
  <div class="mi-componente">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String
})
</script>
```

---

## 📊 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **Nuxt** | 4.4+ | Framework meta Vue con SSR |
| **Vue** | 3.5+ | Framework UI progresivo |
| **Nuxt UI** | 4.7+ | Componentes de UI prebuilt profesionales |
| **Tailwind CSS** | 4.2+ | Estilos utilities y responsive |
| **TypeScript** | 6.0+ | Tipado estático y seguridad |
| **Unovis** | 1.6+ | Visualización de datos avanzada |
| **VueUse** | 14.3+ | Composables reutilizables |
| **Date-fns** | 4.1+ | Utilidades de fechas y horarios |
| **Zod** | 4.4+ | Validación de esquemas TypeScript |
| **ESLint** | 10.3+ | Linting y análisis de código |
| **Vite** | (integrado) | Build tool ultrarápido |

---

## 🚢 Despliegue

### Desplegar en Vercel (Recomendado)

```bash
# 1. Compilar
pnpm build

# 2. Deploy con Vercel CLI
vercel --prod
```

O usa el botón de deploy:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-name=dashboard&repository-url=https%3A%2F%2Fgithub.com%2Ftu-usuario%2Fdashboard)

### Desplegar en Netlify

```bash
# 1. Compilar
pnpm build

# 2. Deploy
netlify deploy --prod --dir=.output/public
```

### Desplegar en tu propio servidor

```bash
# 1. Compilar
pnpm build

# 2. Transferir .output al servidor
scp -r .output user@server:/path/to/app

# 3. En el servidor
cd /path/to/app
npm install
node .output/server/index.mjs
```

---

## 🔄 CI/CD con GitHub Actions

El proyecto incluye CI automático que:

- ✅ Ejecuta linting en cada push (ESLint)
- ✅ Valida tipos TypeScript
- ✅ Ejecuta tests (si los tienes)
- ✅ Deploy automático a producción (opcional)

Ver archivo `.github/workflows/ci.yml`

---

## 🤖 Mantenimiento Automático con Renovate

El proyecto usa **Renovate** para actualizar dependencias automáticamente:

- 📦 Propone PRs con actualizaciones
- 🔄 Mantiene el lock file actualizado
- 🧪 Ejecuta CI automáticamente
- 📋 Agrupa actualizaciones relacionadas

Instala la app: https://github.com/apps/renovate/installations/select_target

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios mayores:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

**Antes de hacer commit:**
```bash
pnpm lint      # Ejecuta linting
pnpm typecheck # Valida tipos
```

---

## 📝 Licencia

Este proyecto está licenciado bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 🔗 Enlaces Útiles

- [Documentación Nuxt 4](https://nuxt.com)
- [Documentación Nuxt UI](https://ui.nuxt.com)
- [Documentación Vue 3](https://vuejs.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Unovis Visualization](https://unovis.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Configuration](https://eslint.org)
- [Demo en vivo](https://dashboard-template.nuxt.dev/)

---

## 🆘 Troubleshooting

### ¿El servidor no inicia?

```bash
# Limpia caché y reinstala
rm -rf node_modules .nuxt
pnpm install
pnpm dev
```

### ¿Errores de tipos TypeScript?

```bash
# Valida tu código
pnpm typecheck

# Genera tipos de Nuxt
pnpm nuxt prepare
```

### ¿Problemas con ESLint?

```bash
# Ejecuta autofix
pnpm lint --fix
```

### ¿Cambios no se aplican?

- Asegúrate de guardar el archivo
- Verifica la consola del navegador (F12)
- Recarga la página (Cmd/Ctrl + Shift + R)

---

## 📧 Soporte

¿Preguntas o problemas? 

- 📍 Abre un **Issue** en GitHub
- 💬 Contáctanos vía email
- 🐛 Reporta bugs con descripción detallada y pasos para reproducir

---

## 🎉 Créditos

Basado en el template oficial de [Nuxt UI](https://ui.nuxt.com)

Personalizaciones y mejoras por Guillermo

---

**Última actualización:** 7 de mayo de 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Producción
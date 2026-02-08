# 🚀 Guía Completa de Deployment en Railway

Esta guía te llevará paso a paso para desplegar tu Sistema de Gestión Documental en Railway con arquitectura separada (Backend + Frontend).

## 📋 Tabla de Contenidos

1. [Preparación](#preparación)
2. [Deploy del Backend](#deploy-del-backend)
3. [Deploy del Frontend](#deploy-del-frontend)
4. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
5. [Verificación](#verificación)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Preparación

### Requisitos Previos

- ✅ Cuenta en [Railway.app](https://railway.app)
- ✅ Cuenta en [GitHub](https://github.com)
- ✅ Git instalado localmente
- ✅ Node.js instalado (v18+)

### Estructura del Proyecto

Tu proyecto ahora está dividido en dos partes independientes:

```
proyecto/
├── backend/           # API REST (Node.js + Express)
│   ├── package.json
│   ├── server.js
│   ├── railway.json
│   └── ...
└── frontend/          # Aplicación React
    ├── package.json
    ├── railway.json
    └── ...
```

---

## 🔧 Deploy del Backend

### Paso 1: Crear Repositorio del Backend

```bash
# Navegar a la carpeta backend
cd backend

# Inicializar Git
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial backend commit"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/sgd-backend.git
git branch -M main
git push -u origin main
```

### Paso 2: Crear Proyecto en Railway

1. Ve a [Railway.app](https://railway.app)
2. Haz clic en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway a acceder a tu GitHub
5. Selecciona el repositorio **sgd-backend**
6. Railway comenzará el deploy automáticamente

### Paso 3: Agregar Base de Datos PostgreSQL

1. En tu proyecto de Railway, haz clic en **"+ New"**
2. Selecciona **"Database"**
3. Elige **"Add PostgreSQL"**
4. Railway creará la base de datos y configurará `DATABASE_URL` automáticamente

### Paso 4: Configurar Variables de Entorno del Backend

1. Haz clic en tu servicio **backend**
2. Ve a la pestaña **"Variables"**
3. Agrega las siguientes variables:

```env
NODE_ENV=production
JWT_SECRET=tu-secret-key-super-seguro-cambiar-esto
PORT=5001
```

**IMPORTANTE**: 
- Cambia `JWT_SECRET` por una clave segura aleatoria
- `DATABASE_URL` ya está configurada automáticamente por Railway
- No necesitas configurar `DB_HOST`, `DB_PORT`, etc. si usas `DATABASE_URL`

### Paso 5: Ejecutar Migraciones de Base de Datos

Opción A - Usando Railway CLI:
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Ejecutar SQL
railway run psql < ../database/schema.sql
```

Opción B - Desde el Dashboard de Railway:
1. Ve a tu base de datos PostgreSQL
2. Haz clic en **"Data"**
3. Copia y pega el contenido de `database/schema.sql`
4. Ejecuta el SQL

### Paso 6: Obtener URL del Backend

1. En Railway, ve a tu servicio backend
2. Ve a **"Settings"** → **"Networking"**
3. Haz clic en **"Generate Domain"**
4. Copia la URL generada (ej: `https://sgd-backend-production.up.railway.app`)

---

## 🎨 Deploy del Frontend

### Paso 1: Crear Repositorio del Frontend

```bash
# Navegar a la carpeta frontend
cd ../frontend

# Inicializar Git
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial frontend commit"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/sgd-frontend.git
git branch -M main
git push -u origin main
```

### Paso 2: Crear Servicio en Railway

1. En el mismo proyecto de Railway (o crea uno nuevo)
2. Haz clic en **"+ New"**
3. Selecciona **"GitHub Repo"**
4. Selecciona el repositorio **sgd-frontend**
5. Railway comenzará el deploy automáticamente

### Paso 3: Configurar Variables de Entorno del Frontend

1. Haz clic en tu servicio **frontend**
2. Ve a la pestaña **"Variables"**
3. Agrega las siguientes variables:

```env
REACT_APP_API_URL=https://tu-backend-url.railway.app
GENERATE_SOURCEMAP=false
```

**IMPORTANTE**: Reemplaza `https://tu-backend-url.railway.app` con la URL real de tu backend del Paso 6 anterior.

### Paso 4: Generar Dominio del Frontend

1. Ve a **"Settings"** → **"Networking"**
2. Haz clic en **"Generate Domain"**
3. Copia la URL generada (ej: `https://sgd-frontend-production.up.railway.app`)

### Paso 5: Actualizar CORS en el Backend

1. Ve al servicio **backend** en Railway
2. Ve a **"Variables"**
3. Agrega o actualiza:

```env
CORS_ORIGIN=https://tu-frontend-url.railway.app
FRONTEND_URL=https://tu-frontend-url.railway.app
```

4. Railway redesplegará automáticamente el backend

---

## 🗄️ Configuración de la Base de Datos

### Crear Usuarios Iniciales

Opción A - Usando Railway CLI:
```bash
railway link
railway run node ../reset-admin-rapido.js
```

Opción B - SQL Directo:
```sql
-- Ejecutar en Railway → PostgreSQL → Data
INSERT INTO usuarios (nombre, username, password, rol) 
VALUES 
  ('Administrador', 'admin', '$2a$10$hash...', 'admin'),
  ('Editor', 'editor', '$2a$10$hash...', 'editor'),
  ('Asesor', 'asesor', '$2a$10$hash...', 'asesor');
```

Opción C - Desde la aplicación:
1. Accede a tu frontend
2. Usa el endpoint de registro (si está habilitado)

---

## ✅ Verificación

### Verificar Backend

1. Abre tu navegador
2. Ve a: `https://tu-backend-url.railway.app/api/health`
3. Deberías ver:
```json
{
  "status": "OK",
  "message": "Servidor funcionando correctamente",
  "timestamp": "2024-..."
}
```

### Verificar Frontend

1. Abre: `https://tu-frontend-url.railway.app`
2. Deberías ver la página de login
3. Intenta iniciar sesión con: `admin` / `admin123`

### Verificar Conectividad

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña **Network**
3. Intenta hacer login
4. Verifica que las peticiones vayan a tu backend en Railway

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Solución**:
1. Verifica que la base de datos PostgreSQL esté activa en Railway
2. Verifica que `DATABASE_URL` esté configurada
3. Revisa los logs: Railway → Backend → Logs

### Error: "CORS policy blocked"

**Solución**:
1. Verifica que `CORS_ORIGIN` en el backend incluya la URL del frontend
2. Asegúrate de usar HTTPS (no HTTP) en producción
3. Redeploy el backend después de cambiar variables

### Error: "API URL not defined"

**Solución**:
1. Verifica que `REACT_APP_API_URL` esté configurada en el frontend
2. Asegúrate de que la variable empiece con `REACT_APP_`
3. Redeploy el frontend después de cambiar variables

### Build del Frontend Falla

**Solución**:
1. Revisa los logs de build en Railway
2. Verifica que todas las dependencias estén en `package.json`
3. Asegúrate de que no haya errores de TypeScript/ESLint

### Base de Datos Vacía

**Solución**:
1. Ejecuta las migraciones: `railway run psql < database/schema.sql`
2. Crea usuarios iniciales con el script de reset
3. Verifica las tablas en Railway → PostgreSQL → Data

---

## 📊 Arquitectura Final

```
┌─────────────────────────────────────────────────────────┐
│                    RAILWAY PROJECT                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │   PostgreSQL     │◄─────┤    Backend       │        │
│  │   Database       │      │  (Node.js/Express)│        │
│  │                  │      │  Port: 5001      │        │
│  └──────────────────┘      └────────┬─────────┘        │
│                                     │                   │
│                                     │ API               │
│                                     │                   │
│                            ┌────────▼─────────┐         │
│                            │    Frontend      │         │
│                            │     (React)      │         │
│                            │                  │         │
│                            └──────────────────┘         │
│                                                          │
└─────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
                         👤 Usuarios
```

---

## 🎉 ¡Listo!

Tu aplicación ahora está desplegada en Railway con:

- ✅ Backend API en su propio servicio
- ✅ Frontend React en su propio servicio
- ✅ Base de datos PostgreSQL
- ✅ HTTPS automático
- ✅ Deploys automáticos desde GitHub
- ✅ Variables de entorno configuradas
- ✅ CORS configurado correctamente

### URLs Finales

- **Frontend**: https://tu-frontend.railway.app
- **Backend API**: https://tu-backend.railway.app/api
- **Health Check**: https://tu-backend.railway.app/api/health

### Credenciales de Acceso

- **Usuario**: admin
- **Contraseña**: admin123

---

## 📚 Recursos Adicionales

- [Documentación de Railway](https://docs.railway.app)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [PostgreSQL en Railway](https://docs.railway.app/databases/postgresql)
- [Variables de Entorno](https://docs.railway.app/develop/variables)

---

## 🔄 Actualizaciones Futuras

Para actualizar tu aplicación:

1. Haz cambios en tu código local
2. Commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Descripción de cambios"
   git push
   ```
3. Railway detectará los cambios y redesplegará automáticamente

---

## 💰 Costos

Railway ofrece:
- **Plan Hobby**: $5/mes con $5 de crédito incluido
- **Plan Developer**: $20/mes
- Uso gratuito limitado para proyectos pequeños

Monitorea tu uso en: Railway → Project → Usage

---

¿Necesitas ayuda? Revisa los logs en Railway o contacta al soporte.

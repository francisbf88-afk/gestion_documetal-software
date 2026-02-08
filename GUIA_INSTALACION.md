# 📖 Guía de Instalación - Sistema de Gestión Documental

## 🎯 Opciones de Instalación

1. **Instalación Local** - Para desarrollo
2. **Deployment en Railway** - Para producción

---

## 💻 Instalación Local

### Requisitos Previos

- ✅ Node.js v18 o superior
- ✅ PostgreSQL 12 o superior
- ✅ Git (opcional)

### Paso 1: Instalar PostgreSQL

**Windows:**
1. Descargar desde: https://www.postgresql.org/download/windows/
2. Ejecutar el instalador
3. Recordar la contraseña del usuario `postgres`

**Verificar instalación:**
```bash
psql --version
```

### Paso 2: Configurar el Proyecto

```bash
# Ejecutar script de configuración
setup-local.bat
```

Este script:
- ✅ Verifica PostgreSQL
- ✅ Crea archivos .env
- ✅ Instala dependencias del backend
- ✅ Instala dependencias del frontend

### Paso 3: Configurar la Base de Datos

```bash
# Ejecutar script de base de datos
setup-database.bat
```

Este script:
- ✅ Crea la base de datos `sgd`
- ✅ Ejecuta las migraciones
- ✅ Crea las tablas necesarias

### Paso 4: Crear Usuarios Iniciales

```bash
# Crear usuarios de prueba
node crear-usuarios.js
```

Usuarios creados:
- **Admin**: admin / admin123
- **Editor**: editor / editor123
- **Asesor**: asesor / asesor123

### Paso 5: Iniciar el Sistema

```bash
# Iniciar backend y frontend
iniciar-local.bat
```

### Paso 6: Verificar Instalación

```bash
# Verificar que todo funcione
node verificar-sistema.js
```

### URLs de Acceso Local

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/api/health

---

## ☁️ Deployment en Railway

### Requisitos Previos

- ✅ Cuenta en Railway.app
- ✅ Cuenta en GitHub
- ✅ Repositorios creados en GitHub

### Paso 1: Preparar Backend

```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git remote add origin https://github.com/TU-USUARIO/sgd-backend.git
git push -u origin main
```

### Paso 2: Desplegar Backend en Railway

1. Ir a [Railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Seleccionar repositorio `sgd-backend`
4. Esperar el deploy inicial

### Paso 3: Agregar PostgreSQL

1. En el proyecto de Railway, clic en **"+ New"**
2. Seleccionar **"Database"** → **"PostgreSQL"**
3. Railway configurará automáticamente `DATABASE_URL`

### Paso 4: Configurar Variables del Backend

En Railway → Backend → Variables:

```env
NODE_ENV=production
JWT_SECRET=genera-un-secret-aleatorio-muy-seguro-aqui
PORT=5001
```

**Generar JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Paso 5: Generar Dominio del Backend

1. Backend → **Settings** → **Networking**
2. Clic en **"Generate Domain"**
3. Copiar la URL (ej: `https://sgd-backend-production.up.railway.app`)

### Paso 6: Ejecutar Migraciones

**Opción A - Desde Railway Dashboard:**
1. PostgreSQL → **Data**
2. Copiar contenido de `database/schema.sql`
3. Pegar y ejecutar
4. Repetir con `database/notifications-schema.sql`

**Opción B - Usando Railway CLI:**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar al proyecto
railway link

# Ejecutar migraciones
railway run psql < database/schema.sql
railway run psql < database/notifications-schema.sql
```

### Paso 7: Crear Usuarios en Railway

**Opción A - Modificar y ejecutar script:**
```bash
# Editar backend/.env con DATABASE_URL de Railway
# Luego ejecutar:
node crear-usuarios.js
```

**Opción B - SQL Directo:**
En Railway → PostgreSQL → Data, ejecutar:
```sql
-- Ver crear-usuario-admin.sql
```

### Paso 8: Preparar Frontend

```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin https://github.com/TU-USUARIO/sgd-frontend.git
git push -u origin main
```

### Paso 9: Desplegar Frontend en Railway

1. En el mismo proyecto, clic en **"+ New"**
2. **"GitHub Repo"** → Seleccionar `sgd-frontend`
3. Esperar el deploy

### Paso 10: Configurar Variables del Frontend

En Railway → Frontend → Variables:

```env
REACT_APP_API_URL=https://tu-backend-url.railway.app
GENERATE_SOURCEMAP=false
```

**IMPORTANTE**: Usar la URL del backend del Paso 5

### Paso 11: Generar Dominio del Frontend

1. Frontend → **Settings** → **Networking**
2. Clic en **"Generate Domain"**
3. Copiar la URL (ej: `https://sgd-frontend-production.up.railway.app`)

### Paso 12: Actualizar CORS en Backend

En Railway → Backend → Variables, agregar:

```env
CORS_ORIGIN=https://tu-frontend-url.railway.app
FRONTEND_URL=https://tu-frontend-url.railway.app
```

Railway redesplegará automáticamente.

### Paso 13: Verificar Deployment

1. Abrir la URL del frontend
2. Intentar login con: `admin` / `admin123`
3. Verificar que todo funcione

---

## 🔧 Configuración de Variables de Entorno

### Backend Local (.env)

```env
PORT=5001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sgd
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2024

# CORS
CORS_ORIGIN=http://localhost:3001
FRONTEND_URL=http://localhost:3001
```

### Backend Railway

```env
NODE_ENV=production
JWT_SECRET=secret-aleatorio-muy-seguro
CORS_ORIGIN=https://tu-frontend.railway.app
FRONTEND_URL=https://tu-frontend.railway.app
# DATABASE_URL se configura automáticamente
```

### Frontend Local (.env)

```env
PORT=3001
REACT_APP_API_URL=http://localhost:5001
HOST=0.0.0.0
GENERATE_SOURCEMAP=false
```

### Frontend Railway

```env
REACT_APP_API_URL=https://tu-backend.railway.app
GENERATE_SOURCEMAP=false
```

---

## 🐛 Solución de Problemas

### Error: PostgreSQL no encontrado

**Solución:**
1. Instalar PostgreSQL
2. Agregar PostgreSQL al PATH del sistema
3. Reiniciar la terminal

### Error: Base de datos no existe

**Solución:**
```bash
psql -U postgres
CREATE DATABASE sgd;
\q
```

### Error: No se puede conectar al backend

**Solución:**
1. Verificar que el backend esté ejecutándose
2. Verificar el puerto en `.env`
3. Verificar firewall

### Error: CORS en Railway

**Solución:**
1. Verificar `CORS_ORIGIN` en backend
2. Asegurar que incluya la URL completa del frontend
3. Redeploy del backend

### Error: Login falla

**Solución:**
1. Verificar que los usuarios existan: `node verificar-sistema.js`
2. Crear usuarios: `node crear-usuarios.js`
3. Verificar contraseñas

---

## 📝 Scripts Disponibles

### Configuración
- `setup-local.bat` - Configuración inicial local
- `setup-database.bat` - Configurar base de datos
- `crear-usuarios.js` - Crear usuarios iniciales

### Ejecución
- `iniciar-local.bat` - Iniciar backend y frontend
- `verificar-sistema.js` - Verificar instalación

### Desarrollo
```bash
# Backend
cd backend
npm run dev    # Con nodemon
npm start      # Sin nodemon

# Frontend
cd frontend
npm start      # Desarrollo
npm run build  # Producción
```

---

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **usuarios** - Usuarios del sistema
- **documentos** - Documentos almacenados
- **categorias** - Categorías de documentos
- **notificaciones** - Sistema de notificaciones
- **permisos_documentos** - Permisos por documento

### Roles de Usuario

- **admin** - Acceso completo
- **editor** - Crear y editar documentos
- **asesor** - Solo lectura

---

## ✅ Checklist de Instalación

### Local
- [ ] PostgreSQL instalado
- [ ] Ejecutar `setup-local.bat`
- [ ] Ejecutar `setup-database.bat`
- [ ] Ejecutar `node crear-usuarios.js`
- [ ] Ejecutar `iniciar-local.bat`
- [ ] Verificar en http://localhost:3001

### Railway
- [ ] Repositorio backend en GitHub
- [ ] Repositorio frontend en GitHub
- [ ] Backend desplegado en Railway
- [ ] PostgreSQL agregado
- [ ] Variables del backend configuradas
- [ ] Migraciones ejecutadas
- [ ] Usuarios creados
- [ ] Frontend desplegado
- [ ] Variables del frontend configuradas
- [ ] CORS actualizado
- [ ] Login funciona

---

## 🎉 ¡Instalación Completada!

Tu sistema está listo para usar. Accede con:

**Credenciales:**
- Admin: `admin` / `admin123`
- Editor: `editor` / `editor123`
- Asesor: `asesor` / `asesor123`

**URLs:**
- Local: http://localhost:3001
- Railway: https://tu-frontend.railway.app

---

## 📞 Soporte

Si encuentras problemas:
1. Ejecutar `node verificar-sistema.js`
2. Revisar logs del backend y frontend
3. Consultar la sección de Solución de Problemas

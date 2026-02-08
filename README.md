# 📁 Sistema de Gestión Documental

<<<<<<< Updated upstream
Sistema completo de gestión documental con autenticación JWT, roles de usuario y PostgreSQL.

## ✨ Características

- 🔐 Autenticación con roles (Admin, Editor, Asesor)
- 📄 Gestión completa de documentos
- 📝 Editor integrado (Monaco Editor)
- 🔔 Sistema de notificaciones
- 👥 Gestión de usuarios
- 🏷️ Categorías de documentos
- 📊 Dashboard con estadísticas
- 🎨 UI moderna con Material-UI

## 🚀 Cómo Desplegar

**Ver guía completa:** [COMO_DESPLEGAR.md](COMO_DESPLEGAR.md)

### Local (Rápido)

```bash
# 1. Crear base de datos
psql -U postgres -c "CREATE DATABASE sgd;"

# 2. Ejecutar migraciones
psql -U postgres -d sgd -f database/schema.sql
psql -U postgres -d sgd -f database/notifications-schema.sql

# 3. Configurar y iniciar backend
cd backend
npm install
# Crear .env con configuración (ver COMO_DESPLEGAR.md)
npm start

# 4. Configurar y iniciar frontend
cd frontend
npm install
# Crear .env con configuración (ver COMO_DESPLEGAR.md)
npm start

# 5. Abrir http://localhost:3001
# Login: admin / admin123
```

### Railway (Producción)

1. Crear repositorios en GitHub (backend y frontend)
2. Desplegar backend en Railway
3. Agregar PostgreSQL
4. Desplegar frontend en Railway
5. Configurar variables de entorno

**Ver pasos detallados:** [COMO_DESPLEGAR.md](COMO_DESPLEGAR.md)

## 📦 Requisitos

- Node.js v18+
- PostgreSQL 12+
- npm
=======
Sistema completo de gestión documental con autenticación, roles de usuario, gestión de documentos y notificaciones en tiempo real.

## ✨ Características

- 🔐 **Autenticación JWT** con roles (Admin, Editor, Asesor)
- 📄 **Gestión de Documentos** (CRUD completo)
- 📝 **Editor Integrado** con Monaco Editor
- 🔔 **Sistema de Notificaciones** en tiempo real
- 👥 **Gestión de Usuarios** (solo Admin)
- 🏷️ **Categorías de Documentos**
- 🔍 **Búsqueda y Filtrado**
- 📊 **Dashboard con Estadísticas**
- 🎨 **UI Moderna** con Material-UI
- 📱 **Responsive Design**

## 🚀 Inicio Rápido

### Instalación Local (5 minutos)

```bash
# 1. Configurar proyecto
setup-local.bat

# 2. Configurar base de datos
setup-database.bat

# 3. Crear usuarios
node crear-usuarios.js

# 4. Iniciar sistema
iniciar-local.bat
```

**Acceder a:** http://localhost:3001  
**Login:** admin / admin123

### Deployment en Railway (30 minutos)

Ver guía completa en: [GUIA_INSTALACION.md](GUIA_INSTALACION.md)

```bash
# Backend
cd backend
git init && git add . && git commit -m "Initial commit"
git push origin main

# Frontend
cd frontend
git init && git add . && git commit -m "Initial commit"
git push origin main
```

Luego desplegar en Railway siguiendo la guía.

## 📦 Requisitos

### Local
- Node.js v18+
- PostgreSQL 12+
- npm o yarn

### Railway
- Cuenta en Railway.app
- Cuenta en GitHub
- Repositorios Git
>>>>>>> Stashed changes

## 🔧 Tecnologías

### Backend
<<<<<<< Updated upstream
- Node.js + Express
- PostgreSQL
- JWT + Bcrypt
- Multer

### Frontend
- React 19
- Material-UI 7
- React Router 7
- Axios
- Monaco Editor

## 📚 Estructura

```
proyecto/
├── backend/          # API REST
│   ├── config/      # Configuración
│   ├── middleware/  # Middlewares
│   ├── routes/      # Rutas API
│   └── server.js    # Servidor
│
├── frontend/        # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── hooks/
│   └── public/
│
└── database/        # Schemas SQL
    ├── schema.sql
    └── notifications-schema.sql
```

## 👥 Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| editor | editor123 | Editor |
| asesor | asesor123 | Asesor |

## 🌐 URLs

### Local
- Frontend: http://localhost:3001
- Backend: http://localhost:5001/api

### Railway
- Frontend: https://tu-frontend.railway.app
- Backend: https://tu-backend.railway.app/api

## 📝 Documentación

- **[COMO_DESPLEGAR.md](COMO_DESPLEGAR.md)** - Guía completa de deployment
- **[backend/README.md](backend/README.md)** - Documentación del backend
- **[frontend/README.md](frontend/README.md)** - Documentación del frontend

## 🐛 Solución de Problemas

Ver sección de troubleshooting en [COMO_DESPLEGAR.md](COMO_DESPLEGAR.md)

## 📄 Licencia

Proyecto privado y confidencial.

---

**¡Listo para desplegar!** 🚀

Ver: [COMO_DESPLEGAR.md](COMO_DESPLEGAR.md)
=======
- **Node.js** - Runtime
- **Express** - Framework web
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Multer** - Subida de archivos

### Frontend
- **React 19** - Librería UI
- **Material-UI 7** - Componentes
- **React Router 7** - Enrutamiento
- **Axios** - Cliente HTTP
- **Monaco Editor** - Editor de código
- **Context API** - Estado global

### DevOps
- **Railway** - Hosting y deployment
- **GitHub** - Control de versiones
- **PostgreSQL** - Base de datos gestionada

## 📚 Documentación

- 📖 [Guía de Instalación](GUIA_INSTALACION.md) - Instalación completa
- 📊 [Estructura del Proyecto](ESTRUCTURA_FINAL.md) - Arquitectura
- 🚀 [Deployment Rápido](DEPLOYMENT_RAPIDO.md) - Guía express
- 📝 [Backend README](backend/README.md) - Documentación API
- 🎨 [Frontend README](frontend/README.md) - Documentación UI

## 🗂️ Estructura del Proyecto

```
proyecto/
├── backend/              # API REST
│   ├── config/          # Configuración
│   ├── middleware/      # Middlewares
│   ├── routes/          # Rutas API
│   ├── uploads/         # Archivos subidos
│   └── server.js        # Servidor principal
│
├── frontend/            # Aplicación React
│   ├── public/          # Archivos estáticos
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── contexts/    # Context API
│   │   ├── hooks/       # Custom hooks
│   │   └── theme/       # Tema Material-UI
│   └── package.json
│
├── database/            # Schemas SQL
│   ├── schema.sql       # Schema principal
│   └── *.sql            # Otros schemas
│
└── scripts/             # Scripts de utilidad
```

## 🔐 Variables de Entorno

### Backend Local
```env
PORT=5001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sgd
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
CORS_ORIGIN=http://localhost:3001
```

### Frontend Local
```env
PORT=3001
REACT_APP_API_URL=http://localhost:5001
HOST=0.0.0.0
```

### Railway
Ver [GUIA_INSTALACION.md](GUIA_INSTALACION.md) para configuración de producción.

## 👥 Usuarios de Prueba

| Usuario | Contraseña | Rol | Permisos |
|---------|------------|-----|----------|
| admin | admin123 | Administrador | Acceso completo |
| editor | editor123 | Editor | Crear/editar documentos |
| asesor | asesor123 | Asesor | Solo lectura |

## 📝 Scripts Disponibles

### Configuración
```bash
setup-local.bat          # Configuración inicial
setup-database.bat       # Configurar PostgreSQL
crear-usuarios.js        # Crear usuarios iniciales
```

### Ejecución
```bash
iniciar-local.bat        # Iniciar backend + frontend
verificar-sistema.js     # Verificar instalación
```

### Desarrollo
```bash
# Backend
cd backend
npm run dev              # Desarrollo con nodemon
npm start                # Producción

# Frontend
cd frontend
npm start                # Desarrollo
npm run build            # Build producción
npm run serve            # Servir build
```

## 🌐 URLs de Acceso

### Local
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/api/health

### Railway
- **Frontend**: https://tu-frontend.railway.app
- **Backend API**: https://tu-backend.railway.app/api

## 📡 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/change-password` - Cambiar contraseña

### Documentos
- `GET /api/documents` - Listar documentos
- `POST /api/documents` - Crear documento
- `GET /api/documents/:id` - Obtener documento
- `PUT /api/documents/:id` - Actualizar documento
- `DELETE /api/documents/:id` - Eliminar documento

### Usuarios (Admin)
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Notificaciones
- `GET /api/notifications` - Listar notificaciones
- `POST /api/notifications` - Crear notificación
- `PUT /api/notifications/:id/read` - Marcar como leída

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL
```bash
# Verificar que PostgreSQL esté ejecutándose
psql --version

# Crear base de datos si no existe
psql -U postgres
CREATE DATABASE sgd;
\q
```

### Error de CORS
```bash
# Verificar CORS_ORIGIN en backend/.env
CORS_ORIGIN=http://localhost:3001
```

### Login falla
```bash
# Crear usuarios
node crear-usuarios.js

# Verificar sistema
node verificar-sistema.js
```

## 🔍 Verificación del Sistema

```bash
# Ejecutar verificación completa
node verificar-sistema.js
```

Este script verifica:
- ✅ Conexión a PostgreSQL
- ✅ Tablas creadas
- ✅ Usuarios existentes
- ✅ Backend funcionando
- ✅ Frontend funcionando
- ✅ Login operativo

## 📊 Base de Datos

### Tablas Principales
- `usuarios` - Usuarios del sistema
- `documentos` - Documentos almacenados
- `categorias` - Categorías de documentos
- `notificaciones` - Sistema de notificaciones
- `permisos_documentos` - Permisos por documento

### Migraciones
```bash
# Ejecutar migraciones
psql -U postgres -d sgd -f database/schema.sql
psql -U postgres -d sgd -f database/notifications-schema.sql
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👨‍💻 Autor

Sistema de Gestión Documental - 2026

## 🎉 ¡Listo para Usar!

Tu sistema está completamente preparado para:
- ✅ Desarrollo local
- ✅ Deployment en Railway
- ✅ Producción

**¡Comienza ahora!**
```bash
setup-local.bat
```
>>>>>>> Stashed changes

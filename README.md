# 📁 Sistema de Gestión Documental

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

## 🔧 Tecnologías

### Backend
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

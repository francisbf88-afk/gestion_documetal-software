# Backend - Sistema de Gestión Documental

API REST para el Sistema de Gestión Documental construida con Node.js, Express y PostgreSQL.

## 🚀 Deployment en Railway

### Paso 1: Preparar el Repositorio

1. Crear un repositorio Git separado para el backend:
```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
```

2. Subir a GitHub:
```bash
git remote add origin https://github.com/tu-usuario/sgd-backend.git
git push -u origin main
```

### Paso 2: Configurar Railway

1. Ve a [Railway.app](https://railway.app)
2. Crea un nuevo proyecto
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu repositorio del backend

### Paso 3: Agregar Base de Datos PostgreSQL

1. En tu proyecto de Railway, haz clic en "+ New"
2. Selecciona "Database" → "PostgreSQL"
3. Railway creará automáticamente las variables de entorno

### Paso 4: Configurar Variables de Entorno

En Railway, ve a tu servicio backend → Variables y agrega:

```env
PORT=5001
NODE_ENV=production
JWT_SECRET=tu-secret-key-super-seguro-aqui
CORS_ORIGIN=https://tu-frontend.railway.app
FRONTEND_URL=https://tu-frontend.railway.app
```

Las variables de base de datos se configuran automáticamente:
- `DATABASE_URL` (Railway lo proporciona automáticamente)

O manualmente:
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

### Paso 5: Deploy

Railway desplegará automáticamente tu backend. Obtendrás una URL como:
```
https://sgd-backend-production.up.railway.app
```

## 📦 Instalación Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar en desarrollo
npm run dev

# Iniciar en producción
npm start
```

## 🔧 Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| PORT | Puerto del servidor | 5001 |
| NODE_ENV | Ambiente de ejecución | production |
| DB_HOST | Host de PostgreSQL | localhost |
| DB_PORT | Puerto de PostgreSQL | 5432 |
| DB_NAME | Nombre de la base de datos | sgd |
| DB_USER | Usuario de PostgreSQL | postgres |
| DB_PASSWORD | Contraseña de PostgreSQL | password |
| JWT_SECRET | Secreto para JWT | secret-key |
| CORS_ORIGIN | Origen permitido para CORS | https://frontend.com |

## 📡 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario (admin)
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/change-password` - Cambiar contraseña

### Documentos
- `GET /api/documents` - Listar documentos
- `POST /api/documents` - Crear documento
- `GET /api/documents/:id` - Obtener documento
- `PUT /api/documents/:id` - Actualizar documento
- `DELETE /api/documents/:id` - Eliminar documento

### Usuarios
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

### Health Check
- `GET /api/health` - Estado del servidor

## 🗄️ Base de Datos

### Migración Inicial

Después del primer deploy, ejecuta las migraciones:

```bash
# Conectar a Railway CLI
railway login
railway link

# Ejecutar migraciones
railway run npm run migrate
```

O ejecuta el SQL directamente en Railway:
1. Ve a tu base de datos PostgreSQL en Railway
2. Abre la pestaña "Data"
3. Ejecuta el contenido de `../database/schema.sql`

## 🔒 Seguridad

- Todas las rutas (excepto login) requieren autenticación JWT
- Las contraseñas se hashean con bcrypt
- CORS configurado para permitir solo el frontend
- Variables de entorno para datos sensibles

## 📝 Logs

Los logs se muestran en la consola de Railway. Para verlos:
```bash
railway logs
```

## 🐛 Troubleshooting

### Error de conexión a la base de datos
- Verifica que las variables de entorno estén configuradas
- Asegúrate de que la base de datos PostgreSQL esté activa

### Error de CORS
- Verifica que `CORS_ORIGIN` incluya la URL de tu frontend
- Asegúrate de usar HTTPS en producción

### Puerto en uso
- Railway asigna el puerto automáticamente
- No necesitas configurar PORT manualmente en Railway

## 📚 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Multer** - Subida de archivos
- **CORS** - Cross-Origin Resource Sharing

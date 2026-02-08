# ⚡ Comandos Rápidos para Railway

## 🚀 Setup Inicial

### 1. Preparar Backend para GitHub

```bash
cd backend
git init
git add .
git commit -m "Initial backend commit for Railway"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/sgd-backend.git
git push -u origin main
```

### 2. Preparar Frontend para GitHub

```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit for Railway"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/sgd-frontend.git
git push -u origin main
```

## 🔧 Railway CLI

### Instalación

```bash
npm install -g @railway/cli
```

### Login

```bash
railway login
```

### Conectar Proyecto

```bash
# En la carpeta del backend
cd backend
railway link

# En la carpeta del frontend
cd frontend
railway link
```

### Ver Logs

```bash
# Backend
railway logs

# Frontend
railway logs
```

### Ejecutar Comandos

```bash
# Ejecutar migraciones
railway run node migrate.js

# Acceder a PostgreSQL
railway run psql

# Ejecutar cualquier comando
railway run npm run migrate
```

### Variables de Entorno

```bash
# Ver variables
railway variables

# Agregar variable
railway variables set KEY=value

# Eliminar variable
railway variables delete KEY
```

## 🗄️ Base de Datos

### Conectar a PostgreSQL

```bash
# Desde Railway CLI
railway run psql

# O obtener URL de conexión
railway variables | grep DATABASE_URL
```

### Ejecutar Migraciones

```bash
# Opción 1: Desde Railway CLI
railway run psql < ../database/schema.sql

# Opción 2: Desde el dashboard
# Railway → PostgreSQL → Data → Pegar SQL
```

### Crear Usuarios Iniciales

```bash
railway run node ../reset-admin-rapido.js
```

## 📦 Deployment

### Deploy Manual

```bash
# Backend
cd backend
git add .
git commit -m "Update backend"
git push

# Frontend
cd frontend
git add .
git commit -m "Update frontend"
git push
```

### Forzar Redeploy

```bash
# Desde Railway CLI
railway up

# O desde el dashboard
# Railway → Service → Deploy → Redeploy
```

## 🔍 Verificación

### Health Check del Backend

```bash
curl https://tu-backend.railway.app/api/health
```

### Probar Login

```bash
curl -X POST https://tu-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Ver Estado de Servicios

```bash
railway status
```

## 🐛 Troubleshooting

### Ver Logs en Tiempo Real

```bash
railway logs --follow
```

### Reiniciar Servicio

```bash
railway restart
```

### Ver Variables de Entorno

```bash
railway variables
```

### Conectar a la Base de Datos

```bash
railway connect postgres
```

## 📝 Variables de Entorno Comunes

### Backend

```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=tu-secret-super-seguro
railway variables set CORS_ORIGIN=https://tu-frontend.railway.app
railway variables set FRONTEND_URL=https://tu-frontend.railway.app
```

### Frontend

```bash
railway variables set REACT_APP_API_URL=https://tu-backend.railway.app
railway variables set GENERATE_SOURCEMAP=false
```

## 🔄 Actualización de Código

### Workflow Típico

```bash
# 1. Hacer cambios en el código
# 2. Commit
git add .
git commit -m "Descripción de cambios"

# 3. Push (Railway despliega automáticamente)
git push

# 4. Ver logs del deploy
railway logs --follow
```

## 🌐 URLs Útiles

### Obtener URLs de los Servicios

```bash
# Backend
railway domain

# O desde el dashboard
# Railway → Backend → Settings → Networking
```

### Generar Nuevo Dominio

```bash
railway domain
```

## 💾 Backups

### Backup de Base de Datos

```bash
# Exportar base de datos
railway run pg_dump > backup.sql

# Importar base de datos
railway run psql < backup.sql
```

## 📊 Monitoreo

### Ver Uso de Recursos

```bash
railway status
```

### Ver Métricas

```bash
# Desde el dashboard
# Railway → Service → Metrics
```

## 🔐 Seguridad

### Rotar JWT Secret

```bash
# Generar nuevo secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Actualizar en Railway
railway variables set JWT_SECRET=nuevo-secret
```

### Actualizar Contraseña de Admin

```bash
railway run node reset-admin-rapido.js
```

## 🚨 Comandos de Emergencia

### Rollback a Deploy Anterior

```bash
# Desde el dashboard
# Railway → Service → Deployments → [Deploy anterior] → Redeploy
```

### Detener Servicio

```bash
railway down
```

### Reiniciar Servicio

```bash
railway restart
```

### Ver Logs de Error

```bash
railway logs --filter error
```

## 📱 Comandos Útiles del Dashboard

### Acceso Rápido

- **Dashboard**: https://railway.app/dashboard
- **Proyecto**: https://railway.app/project/[PROJECT_ID]
- **Logs**: https://railway.app/project/[PROJECT_ID]/service/[SERVICE_ID]/logs
- **Variables**: https://railway.app/project/[PROJECT_ID]/service/[SERVICE_ID]/variables

## 🎯 Checklist de Deployment

```bash
# 1. Verificar proyecto local
node verificar-deployment.js

# 2. Preparar deployment
preparar-deployment.bat

# 3. Crear repos en GitHub
# (ver comandos arriba)

# 4. Crear proyecto en Railway
# (desde el dashboard)

# 5. Configurar variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=...
railway variables set REACT_APP_API_URL=...

# 6. Ejecutar migraciones
railway run psql < database/schema.sql

# 7. Crear usuarios
railway run node reset-admin-rapido.js

# 8. Verificar
curl https://tu-backend.railway.app/api/health
```

## 📚 Recursos

- **Railway Docs**: https://docs.railway.app
- **Railway CLI**: https://docs.railway.app/develop/cli
- **Railway Status**: https://status.railway.app
- **Railway Discord**: https://discord.gg/railway

---

**Tip**: Guarda este archivo como referencia rápida durante el deployment.

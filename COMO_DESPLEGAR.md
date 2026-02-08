# 🚀 Cómo Desplegar tu Aplicación

## 📋 Opciones de Deployment

1. **Local** - Para desarrollo y pruebas
2. **Railway** - Para producción en la nube

---

## 💻 OPCIÓN 1: Deployment Local

### Requisitos
- Node.js v18+
- PostgreSQL 12+

### Paso 1: Instalar PostgreSQL
1. Descargar desde: https://www.postgresql.org/download/
2. Instalar con configuración por defecto
3. Recordar la contraseña de `postgres`

### Paso 2: Crear Base de Datos
```bash
# Abrir terminal de PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE sgd;

# Salir
\q
```

### Paso 3: Configurar Backend
```bash
cd backend

# Crear archivo .env
echo PORT=5001 > .env
echo NODE_ENV=development >> .env
echo DB_HOST=localhost >> .env
echo DB_PORT=5432 >> .env
echo DB_NAME=sgd >> .env
echo DB_USER=postgres >> .env
echo DB_PASSWORD=TU_PASSWORD_POSTGRES >> .env
echo JWT_SECRET=tu_secret_muy_seguro_aqui >> .env

# Instalar dependencias
npm install
```

### Paso 4: Ejecutar Migraciones
```bash
# Desde la raíz del proyecto
psql -U postgres -d sgd -f database/schema.sql
psql -U postgres -d sgd -f database/notifications-schema.sql
```

### Paso 5: Crear Usuarios
```bash
# Desde la raíz del proyecto
node crear-usuarios.js
```

### Paso 6: Configurar Frontend
```bash
cd frontend

# Crear archivo .env
echo PORT=3001 > .env
echo REACT_APP_API_URL=http://localhost:5001 >> .env

# Instalar dependencias
npm install
```

### Paso 7: Iniciar Aplicación
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm start
```

### Paso 8: Acceder
- Abrir: http://localhost:3001
- Login: `admin` / `admin123`

---

## ☁️ OPCIÓN 2: Deployment en Railway

### Requisitos
- Cuenta en Railway.app
- Cuenta en GitHub
- Git instalado

### BACKEND

#### Paso 1: Crear Repositorio Backend
```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
```

#### Paso 2: Subir a GitHub
```bash
# Crear repo en GitHub llamado: sgd-backend
git remote add origin https://github.com/TU-USUARIO/sgd-backend.git
git branch -M main
git push -u origin main
```

#### Paso 3: Desplegar en Railway
1. Ir a https://railway.app
2. Clic en **"New Project"**
3. Seleccionar **"Deploy from GitHub repo"**
4. Elegir repositorio `sgd-backend`
5. Esperar que termine el deploy

#### Paso 4: Agregar PostgreSQL
1. En tu proyecto, clic en **"+ New"**
2. Seleccionar **"Database"**
3. Elegir **"PostgreSQL"**
4. Railway creará la base de datos automáticamente

#### Paso 5: Configurar Variables Backend
1. Clic en el servicio **backend**
2. Ir a **"Variables"**
3. Agregar:
```
NODE_ENV=production
JWT_SECRET=genera_un_secret_aleatorio_muy_seguro_aqui
```

**Generar JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Paso 6: Obtener URL del Backend
1. Ir a **Settings** → **Networking**
2. Clic en **"Generate Domain"**
3. Copiar la URL (ej: `https://sgd-backend-production.up.railway.app`)

#### Paso 7: Ejecutar Migraciones
1. En Railway, clic en **PostgreSQL**
2. Ir a **"Data"**
3. Copiar contenido de `database/schema.sql`
4. Pegar y ejecutar
5. Repetir con `database/notifications-schema.sql`

#### Paso 8: Crear Usuarios
En Railway → PostgreSQL → Data, ejecutar:
```sql
-- Crear usuario admin (contraseña: admin123)
INSERT INTO usuarios (nombre, username, email, password, rol)
VALUES (
    'Administrador',
    'admin',
    'admin@sistema.com',
    '$2a$10$YourHashedPasswordHere',
    'admin'
);
```

**Nota:** Necesitas hashear la contraseña con bcrypt. Usa `node crear-usuarios.js` localmente y copia el hash.

### FRONTEND

#### Paso 9: Crear Repositorio Frontend
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit"
```

#### Paso 10: Subir a GitHub
```bash
# Crear repo en GitHub llamado: sgd-frontend
git remote add origin https://github.com/TU-USUARIO/sgd-frontend.git
git branch -M main
git push -u origin main
```

#### Paso 11: Desplegar en Railway
1. En el mismo proyecto, clic en **"+ New"**
2. Seleccionar **"GitHub Repo"**
3. Elegir repositorio `sgd-frontend`
4. Esperar que termine el deploy

#### Paso 12: Configurar Variables Frontend
1. Clic en el servicio **frontend**
2. Ir a **"Variables"**
3. Agregar:
```
REACT_APP_API_URL=https://tu-backend-url.railway.app
GENERATE_SOURCEMAP=false
```

**IMPORTANTE:** Usar la URL del backend del Paso 6

#### Paso 13: Obtener URL del Frontend
1. Ir a **Settings** → **Networking**
2. Clic en **"Generate Domain"**
3. Copiar la URL (ej: `https://sgd-frontend-production.up.railway.app`)

#### Paso 14: Actualizar CORS en Backend
1. Ir al servicio **backend** → **Variables**
2. Agregar:
```
CORS_ORIGIN=https://tu-frontend-url.railway.app
FRONTEND_URL=https://tu-frontend-url.railway.app
```

Railway redesplegará automáticamente.

#### Paso 15: Verificar
1. Abrir la URL del frontend
2. Login con: `admin` / `admin123`
3. ¡Listo!

---

## 🔐 Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| editor | editor123 | Editor |
| asesor | asesor123 | Asesor |

---

## 🐛 Solución de Problemas

### Local

**Error: PostgreSQL no conecta**
- Verificar que PostgreSQL esté ejecutándose
- Verificar contraseña en `backend/.env`

**Error: Puerto en uso**
- Cambiar puerto en `.env`
- O cerrar proceso que usa el puerto

**Error: Login falla**
- Ejecutar: `node crear-usuarios.js`
- Verificar que la base de datos tenga usuarios

### Railway

**Error: CORS**
- Verificar `CORS_ORIGIN` en backend
- Debe incluir URL completa del frontend

**Error: Base de datos vacía**
- Ejecutar migraciones en PostgreSQL → Data
- Crear usuarios manualmente

**Error: Build falla**
- Revisar logs en Railway
- Verificar que `package.json` esté correcto

---

## 📝 Resumen Rápido

### Local (5 minutos)
```bash
# 1. Crear BD
psql -U postgres -c "CREATE DATABASE sgd;"

# 2. Migraciones
psql -U postgres -d sgd -f database/schema.sql

# 3. Backend
cd backend && npm install && npm start

# 4. Frontend
cd frontend && npm install && npm start

# 5. Abrir http://localhost:3001
```

### Railway (30 minutos)
1. Backend → GitHub → Railway
2. Agregar PostgreSQL
3. Configurar variables backend
4. Ejecutar migraciones
5. Frontend → GitHub → Railway
6. Configurar variables frontend
7. Actualizar CORS
8. ¡Listo!

---

## ✅ Checklist

### Local
- [ ] PostgreSQL instalado
- [ ] Base de datos creada
- [ ] Migraciones ejecutadas
- [ ] Backend configurado
- [ ] Frontend configurado
- [ ] Usuarios creados
- [ ] Aplicación funcionando

### Railway
- [ ] Repos en GitHub
- [ ] Backend desplegado
- [ ] PostgreSQL agregado
- [ ] Variables backend
- [ ] Migraciones ejecutadas
- [ ] Frontend desplegado
- [ ] Variables frontend
- [ ] CORS actualizado
- [ ] Login funciona

---

**¡Listo! Tu aplicación está desplegada** 🎉

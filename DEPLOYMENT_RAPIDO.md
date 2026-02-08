# 🚀 Deployment Rápido en Railway

## ⚡ Guía Express (30 minutos)

### 1️⃣ Backend (10 min)

```bash
# Crear repo en GitHub
cd backend
git init
git add .
git commit -m "Backend inicial"
git remote add origin https://github.com/TU-USUARIO/sgd-backend.git
git push -u origin main
```

**En Railway:**
1. New Project → Deploy from GitHub → `sgd-backend`
2. + New → Database → PostgreSQL
3. Backend → Variables:
   ```
   NODE_ENV=production
   JWT_SECRET=genera-un-secret-aleatorio-aqui
   ```
4. Backend → Settings → Generate Domain
5. Copiar URL del backend

### 2️⃣ Frontend (10 min)

```bash
# Crear repo en GitHub
cd frontend
git init
git add .
git commit -m "Frontend inicial"
git remote add origin https://github.com/TU-USUARIO/sgd-frontend.git
git push -u origin main
```

**En Railway:**
1. + New → GitHub Repo → `sgd-frontend`
2. Frontend → Variables:
   ```
   REACT_APP_API_URL=https://tu-backend-url.railway.app
   ```
3. Frontend → Settings → Generate Domain
4. Copiar URL del frontend

### 3️⃣ Configuración Final (10 min)

**Actualizar CORS en Backend:**
1. Backend → Variables → Agregar:
   ```
   CORS_ORIGIN=https://tu-frontend-url.railway.app
   ```

**Ejecutar Migraciones:**
1. Railway → PostgreSQL → Data
2. Copiar contenido de `database/schema.sql`
3. Pegar y ejecutar

**Crear Usuario Admin:**
```sql
INSERT INTO usuarios (nombre, username, password, rol) 
VALUES ('Administrador', 'admin', '$2a$10$YourHashedPasswordHere', 'admin');
```

### 4️⃣ Verificar

1. Abrir: `https://tu-frontend-url.railway.app`
2. Login: `admin` / `admin123`
3. ✅ ¡Listo!

---

## 📝 Variables de Entorno

### Backend
```env
NODE_ENV=production
JWT_SECRET=tu-secret-super-seguro-cambiar-esto
CORS_ORIGIN=https://tu-frontend.railway.app
# DATABASE_URL se configura automáticamente
```

### Frontend
```env
REACT_APP_API_URL=https://tu-backend.railway.app
GENERATE_SOURCEMAP=false
```

---

## 🔧 Comandos Útiles

### Generar JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Ver Logs
```bash
railway logs
```

### Conectar a PostgreSQL
```bash
railway connect postgres
```

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| Error de CORS | Verificar `CORS_ORIGIN` en backend |
| Login falla | Verificar usuarios en PostgreSQL |
| Build falla | Revisar logs en Railway |
| 404 en API | Verificar `REACT_APP_API_URL` |

---

## ✅ Checklist

- [ ] Backend en GitHub
- [ ] Frontend en GitHub
- [ ] Backend en Railway
- [ ] PostgreSQL agregado
- [ ] Frontend en Railway
- [ ] Variables configuradas
- [ ] CORS actualizado
- [ ] Migraciones ejecutadas
- [ ] Usuario admin creado
- [ ] Login funciona

---

**¡Listo en 30 minutos! 🎉**

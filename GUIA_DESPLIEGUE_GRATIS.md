# 🚀 Guía Completa de Despliegue Gratuito

## 📌 Opciones Gratuitas Disponibles

Tu aplicación puede desplegarse GRATIS en:

1. **Render.com** ⭐ (Recomendado - Más fácil)
2. **Railway.app** (Alternativa)
3. **Vercel + Supabase** (Para frontend estático)

---

## 🎯 OPCIÓN 1: RENDER.COM (RECOMENDADO)

### ✅ Ventajas
- PostgreSQL gratuito incluido
- Despliegue automático desde GitHub
- SSL/HTTPS gratis
- 750 horas gratis al mes
- Configuración con un solo archivo

### 📋 Requisitos
- Cuenta de GitHub (gratis)
- Cuenta de Render (gratis)

### 🚀 Pasos de Despliegue

#### PASO 1: Ejecutar Script Automático

**En Windows:**
```cmd
desplegar-render.bat
```

**En Linux/Mac:**
```bash
chmod +x desplegar-render.sh
./desplegar-render.sh
```

Este script creará automáticamente:
- ✅ `render.yaml` - Configuración de servicios
- ✅ `migrate-database.js` - Script de migración
- ✅ `package.json` - Dependencias del proyecto

#### PASO 2: Crear Repositorio en GitHub

1. Ve a: https://github.com/new
2. Nombre del repositorio: `sgd-sistema-documental`
3. Tipo: Público o Privado (tu elección)
4. **NO** marques "Initialize with README"
5. Click en "Create repository"

#### PASO 3: Subir Código a GitHub

Copia y pega estos comandos (reemplaza `TU-USUARIO` con tu usuario de GitHub):

```bash
git remote add origin https://github.com/TU-USUARIO/sgd-sistema-documental.git
git branch -M main
git push -u origin main
```

Si te pide credenciales, usa un Personal Access Token:
- Ve a: https://github.com/settings/tokens
- Generate new token (classic)
- Marca: `repo`
- Copia el token y úsalo como contraseña

#### PASO 4: Desplegar en Render

1. Ve a: https://render.com
2. Click en "Get Started" o "Sign Up"
3. Conecta con tu cuenta de GitHub
4. Una vez dentro, click en "New +" (arriba derecha)
5. Selecciona "Blueprint"
6. Busca y selecciona tu repositorio `sgd-sistema-documental`
7. Render detectará automáticamente el archivo `render.yaml`
8. Click en "Apply"

Render comenzará a:
- ✅ Crear base de datos PostgreSQL
- ✅ Desplegar backend (Node.js)
- ✅ Desplegar frontend (React)

**Tiempo estimado:** 5-10 minutos

#### PASO 5: Ejecutar Migraciones de Base de Datos

Una vez que el backend esté desplegado:

1. En el dashboard de Render, click en el servicio `sgd-backend`
2. En el menú lateral, click en "Shell"
3. Espera a que se abra la terminal
4. Ejecuta:
   ```bash
   npm run migrate
   ```
5. Deberías ver:
   ```
   🔄 Ejecutando migraciones...
   📝 Ejecutando schema.sql...
   ✓ Schema creado
   📝 Ejecutando notifications-schema.sql...
   ✓ Notificaciones configuradas
   ✓ Usuario admin creado
   ✅ Migraciones completadas
   ```

#### PASO 6: Obtener URLs de los Servicios

1. En el dashboard de Render, verás 3 servicios:
   - `sgd-backend` (API)
   - `sgd-frontend` (Aplicación web)
   - `sgd-database` (PostgreSQL)

2. Click en `sgd-backend`:
   - Copia la URL (ejemplo: `https://sgd-backend-xxxx.onrender.com`)

3. Click en `sgd-frontend`:
   - Copia la URL (ejemplo: `https://sgd-frontend-xxxx.onrender.com`)

#### PASO 7: Actualizar URL del Backend en Frontend

1. En Render, ve al servicio `sgd-frontend`
2. Click en "Environment" en el menú lateral
3. Busca la variable `REACT_APP_API_URL`
4. Actualiza su valor con la URL del backend (del paso 6)
   ```
   https://sgd-backend-xxxx.onrender.com
   ```
5. Click en "Save Changes"
6. Render redesplegará automáticamente el frontend

#### PASO 8: Actualizar CORS en Backend

1. Ve al servicio `sgd-backend`
2. Click en "Environment"
3. Agrega una nueva variable:
   - Key: `CORS_ORIGIN`
   - Value: URL del frontend (ejemplo: `https://sgd-frontend-xxxx.onrender.com`)
4. Click en "Save Changes"

#### PASO 9: ¡Acceder a tu Aplicación!

1. Abre la URL del frontend en tu navegador
2. Deberías ver la pantalla de login
3. Credenciales por defecto:
   - **Usuario:** `admin`
   - **Contraseña:** `admin123`

🎉 **¡Tu aplicación está en línea y accesible desde cualquier lugar!**

---

## 🎯 OPCIÓN 2: RAILWAY.APP

### ✅ Ventajas
- $5 USD de crédito gratis al mes
- Despliegue muy rápido
- PostgreSQL incluido
- Configuración simple

### 🚀 Despliegue Rápido

#### PASO 1: Crear Cuenta en Railway

1. Ve a: https://railway.app
2. Click en "Start a New Project"
3. Conecta con GitHub

#### PASO 2: Crear Proyecto

1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Autoriza Railway a acceder a tus repositorios
4. Selecciona tu repositorio

#### PASO 3: Agregar PostgreSQL

1. En tu proyecto, click en "+ New"
2. Selecciona "Database"
3. Elige "Add PostgreSQL"
4. Railway creará la base de datos automáticamente

#### PASO 4: Configurar Variables de Entorno

**Backend:**
1. Click en el servicio backend
2. Ve a "Variables"
3. Railway ya habrá agregado `DATABASE_URL` automáticamente
4. Agrega manualmente:
   ```
   NODE_ENV=production
   JWT_SECRET=genera_un_secret_aleatorio_muy_largo_aqui
   PORT=3000
   ```

**Frontend:**
1. Click en el servicio frontend
2. Ve a "Variables"
3. Agrega:
   ```
   REACT_APP_API_URL=https://tu-backend.railway.app
   ```

#### PASO 5: Generar Dominios

1. Click en el servicio backend → "Settings" → "Networking"
2. Click en "Generate Domain"
3. Copia la URL generada
4. Repite para el frontend

#### PASO 6: Ejecutar Migraciones

Opción A - Desde Railway CLI:
```bash
railway run npm run migrate
```

Opción B - Manualmente en la base de datos:
1. Click en PostgreSQL → "Data"
2. Copia el contenido de `database/schema.sql`
3. Pégalo y ejecuta
4. Repite con `database/notifications-schema.sql`

---

## 🔧 Solución de Problemas Comunes

### ❌ Error: "Application failed to respond"

**Causa:** El backend no está escuchando en el puerto correcto

**Solución:**
1. Verifica que `backend/server.js` use `process.env.PORT`
2. En Render, el puerto debe ser `10000`
3. En Railway, usa el puerto que Railway asigne

### ❌ Error: CORS

**Causa:** El frontend no puede comunicarse con el backend

**Solución:**
1. Verifica que `CORS_ORIGIN` en el backend tenga la URL correcta del frontend
2. Asegúrate de incluir `https://` en la URL
3. No incluyas `/` al final de la URL

### ❌ Error: "Cannot connect to database"

**Causa:** Las credenciales de la base de datos son incorrectas

**Solución en Render:**
1. Ve a la base de datos → "Info"
2. Copia la "Internal Database URL"
3. Actualiza `DATABASE_URL` en el backend

**Solución en Railway:**
1. Railway configura esto automáticamente
2. Verifica que el servicio backend esté en el mismo proyecto que la base de datos

### ❌ Error: "Login failed"

**Causa:** Las migraciones no se ejecutaron o el usuario admin no existe

**Solución:**
1. Ejecuta nuevamente: `npm run migrate`
2. O crea el usuario manualmente en la base de datos:
   ```sql
   INSERT INTO usuarios (nombre, username, email, password, rol)
   VALUES ('Administrador', 'admin', 'admin@sistema.com', 
           '$2a$10$YourHashedPasswordHere', 'admin');
   ```

### ❌ Frontend muestra página en blanco

**Causa:** La URL del backend es incorrecta

**Solución:**
1. Abre las herramientas de desarrollador (F12)
2. Ve a la consola
3. Busca errores de red
4. Verifica que `REACT_APP_API_URL` sea correcta
5. Asegúrate de que el backend esté funcionando

---

## 📊 Comparación de Plataformas

| Característica | Render | Railway | Vercel |
|----------------|--------|---------|--------|
| PostgreSQL Gratis | ✅ Sí | ✅ Sí ($5/mes) | ❌ No |
| Horas Gratis | 750/mes | Crédito $5 | Ilimitado |
| SSL/HTTPS | ✅ Gratis | ✅ Gratis | ✅ Gratis |
| Dominio Custom | ✅ Sí | ✅ Sí | ✅ Sí |
| Auto Deploy | ✅ Sí | ✅ Sí | ✅ Sí |
| Facilidad | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🎓 Recursos Adicionales

### Documentación Oficial
- Render: https://render.com/docs
- Railway: https://docs.railway.app
- PostgreSQL: https://www.postgresql.org/docs

### Tutoriales en Video
- Render Deploy: https://www.youtube.com/results?search_query=render+deploy+nodejs
- Railway Deploy: https://www.youtube.com/results?search_query=railway+deploy+nodejs

### Comunidad
- Render Community: https://community.render.com
- Railway Discord: https://discord.gg/railway

---

## ✅ Checklist de Despliegue

### Antes de Desplegar
- [ ] Código subido a GitHub
- [ ] Archivo `render.yaml` creado
- [ ] Script de migración creado
- [ ] Variables de entorno configuradas localmente

### Durante el Despliegue
- [ ] Servicios creados en Render/Railway
- [ ] Base de datos PostgreSQL creada
- [ ] Backend desplegado correctamente
- [ ] Frontend desplegado correctamente
- [ ] URLs generadas para ambos servicios

### Después del Despliegue
- [ ] Migraciones ejecutadas
- [ ] Usuario admin creado
- [ ] CORS configurado correctamente
- [ ] Frontend conectado al backend
- [ ] Login funciona correctamente
- [ ] Subida de documentos funciona
- [ ] Notificaciones funcionan

---

## 🔐 Seguridad Post-Despliegue

### Cambiar Contraseñas por Defecto
1. Inicia sesión como admin
2. Ve a "Gestión de Usuarios"
3. Cambia la contraseña del usuario admin
4. Crea nuevos usuarios con contraseñas seguras

### Configurar Variables de Entorno Seguras
1. Genera un JWT_SECRET fuerte:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
2. Actualiza en Render/Railway

### Habilitar Autenticación de Dos Factores
- En GitHub: https://github.com/settings/security
- En Render: Settings → Security
- En Railway: Settings → Security

---

## 💰 Costos y Límites

### Render (Plan Gratuito)
- ✅ 750 horas/mes por servicio
- ✅ PostgreSQL: 1GB de almacenamiento
- ✅ 100GB de ancho de banda
- ⚠️ Los servicios se duermen después de 15 min de inactividad
- ⚠️ Primer request después de dormir toma ~30 segundos

### Railway (Plan Gratuito)
- ✅ $5 USD de crédito mensual
- ✅ PostgreSQL incluido
- ✅ Sin límite de horas
- ⚠️ Después de $5, necesitas agregar tarjeta

### Recomendación
Para uso personal o pruebas: **Render** es perfecto
Para producción pequeña: **Railway** con plan de pago ($5/mes)

---

## 🆘 Soporte

Si tienes problemas:

1. **Revisa los logs:**
   - Render: Click en el servicio → "Logs"
   - Railway: Click en el servicio → "Deployments" → Ver logs

2. **Verifica el estado:**
   - Render: https://status.render.com
   - Railway: https://status.railway.app

3. **Consulta la documentación:**
   - Este archivo
   - Documentación oficial de la plataforma

4. **Busca en la comunidad:**
   - Stack Overflow
   - GitHub Issues
   - Discord/Foros oficiales

---

## 🎉 ¡Felicidades!

Tu Sistema de Gestión Documental ahora está:
- ✅ Desplegado en la nube
- ✅ Accesible desde cualquier lugar
- ✅ Con base de datos PostgreSQL
- ✅ Con SSL/HTTPS seguro
- ✅ Completamente GRATIS

**URL de tu aplicación:** `https://tu-frontend.onrender.com`

¡Disfruta tu aplicación en producción! 🚀

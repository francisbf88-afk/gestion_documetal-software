# 🚀 Despliegue en Render SIN Git Local

## ✅ Archivos de Configuración Creados

Ya se han creado los archivos necesarios:
- ✅ `render.yaml` - Configuración de Render
- ✅ `migrate-database.js` - Script de migración
- ✅ `package.json` - Actualizado con script de migración

---

## 📋 OPCIÓN 1: Despliegue Directo desde GitHub Web (SIN GIT LOCAL)

### Paso 1: Crear Repositorio en GitHub

1. Ve a: https://github.com/new
2. Nombre del repositorio: `sgd-sistema-documental`
3. Tipo: **Público** (importante para el plan gratuito de Render)
4. **NO** marques "Initialize with README"
5. Click en "Create repository"

### Paso 2: Subir Archivos Manualmente

**Opción A - Arrastrar y Soltar:**

1. En la página del repositorio recién creado
2. Click en "uploading an existing file"
3. Arrastra TODA la carpeta del proyecto
4. O selecciona todos los archivos y carpetas
5. Escribe un mensaje: "Initial commit"
6. Click en "Commit changes"

**Opción B - GitHub Desktop (Recomendado):**

1. Descarga GitHub Desktop: https://desktop.github.com/
2. Instala y abre GitHub Desktop
3. Click en "File" → "Add Local Repository"
4. Selecciona la carpeta de tu proyecto
5. Click en "Create Repository"
6. Click en "Publish repository"
7. Selecciona tu cuenta y el nombre del repositorio
8. Click en "Publish Repository"

### Paso 3: Desplegar en Render

1. Ve a: https://render.com
2. Regístrate o inicia sesión (usa tu cuenta de GitHub)
3. Click en "New +" (arriba derecha)
4. Selecciona "Blueprint"
5. Click en "Connect GitHub"
6. Autoriza Render a acceder a tus repositorios
7. Busca y selecciona `sgd-sistema-documental`
8. Render detectará automáticamente el archivo `render.yaml`
9. Click en "Apply"

**Render comenzará a:**
- Crear base de datos PostgreSQL
- Desplegar backend (Node.js)
- Desplegar frontend (React)

**Tiempo estimado:** 5-10 minutos

### Paso 4: Esperar el Despliegue

En el dashboard de Render verás 3 servicios:
- `sgd-backend` (API)
- `sgd-frontend` (Aplicación web)
- `sgd-database` (PostgreSQL)

Espera a que todos muestren estado "Live" (verde).

### Paso 5: Ejecutar Migraciones

1. Click en el servicio `sgd-backend`
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
   ✓ Schema creado exitosamente
   📝 Ejecutando notifications-schema.sql...
   ✓ Notificaciones configuradas
   ✓ Usuario admin creado
   ✅ Migraciones completadas exitosamente
   ```

### Paso 6: Obtener URLs

1. Click en `sgd-backend`
2. Copia la URL (ejemplo: `https://sgd-backend-xxxx.onrender.com`)
3. Guárdala, la necesitarás en el siguiente paso

4. Click en `sgd-frontend`
5. Copia la URL (ejemplo: `https://sgd-frontend-xxxx.onrender.com`)
6. Esta es la URL de tu aplicación

### Paso 7: Actualizar URL del Backend en Frontend

1. En Render, ve al servicio `sgd-frontend`
2. Click en "Environment" en el menú lateral
3. Busca la variable `REACT_APP_API_URL`
4. Click en el ícono de editar (lápiz)
5. Actualiza el valor con la URL del backend del Paso 6
   ```
   https://sgd-backend-xxxx.onrender.com
   ```
6. Click en "Save Changes"
7. Render redesplegará automáticamente el frontend (2-3 minutos)

### Paso 8: Actualizar CORS en Backend

1. Ve al servicio `sgd-backend`
2. Click en "Environment"
3. Click en "Add Environment Variable"
4. Agrega:
   - **Key:** `CORS_ORIGIN`
   - **Value:** URL del frontend (ejemplo: `https://sgd-frontend-xxxx.onrender.com`)
5. Click en "Save Changes"
6. Render redesplegará automáticamente el backend (2-3 minutos)

### Paso 9: ¡Acceder a tu Aplicación!

1. Abre la URL del frontend en tu navegador
2. Deberías ver la pantalla de login
3. Credenciales:
   - **Usuario:** `admin`
   - **Contraseña:** `admin123`

🎉 **¡Tu aplicación está en línea!**

---

## 📋 OPCIÓN 2: Instalar Git y Usar Scripts Automáticos

Si prefieres usar los scripts automáticos:

### Paso 1: Instalar Git

1. Descarga Git desde: https://git-scm.com/download/win
2. Ejecuta el instalador
3. Usa las opciones por defecto
4. Reinicia la terminal

### Paso 2: Configurar Git

```cmd
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Paso 3: Ejecutar Script

```cmd
INICIO_DESPLIEGUE.bat
```

Selecciona opción 2 para desplegar en Render.

---

## 🔧 Verificación Post-Despliegue

### Backend Funcionando

Abre en el navegador:
```
https://tu-backend.onrender.com/api/health
```

Deberías ver:
```json
{
  "status": "OK",
  "message": "Servidor funcionando correctamente",
  "timestamp": "2024-..."
}
```

### Frontend Funcionando

1. Abre la URL del frontend
2. Presiona F12 para abrir las herramientas de desarrollador
3. Ve a la pestaña "Console"
4. NO deberías ver errores de CORS
5. NO deberías ver errores de conexión

### Base de Datos Funcionando

1. Intenta hacer login con `admin` / `admin123`
2. Si funciona, la base de datos está correctamente configurada

---

## 🆘 Solución de Problemas

### Error: "Application failed to respond"

**Causa:** El backend no está escuchando correctamente

**Solución:**
1. Ve a `sgd-backend` → "Logs"
2. Busca errores
3. Verifica que `PORT=10000` esté configurado

### Error: CORS

**Causa:** El frontend no puede comunicarse con el backend

**Solución:**
1. Verifica que `CORS_ORIGIN` en el backend tenga la URL correcta del frontend
2. Asegúrate de incluir `https://` en la URL
3. No incluyas `/` al final de la URL

### Error: "Cannot connect to database"

**Causa:** La base de datos no está conectada

**Solución:**
1. Ve a `sgd-database` → "Info"
2. Verifica que esté en estado "Available"
3. Ve a `sgd-backend` → "Environment"
4. Verifica que `DATABASE_URL` esté configurada

### Error: Login falla

**Causa:** Las migraciones no se ejecutaron

**Solución:**
1. Ve a `sgd-backend` → "Shell"
2. Ejecuta: `npm run migrate`
3. Espera a que termine
4. Intenta hacer login nuevamente

### Frontend muestra página en blanco

**Causa:** La URL del backend es incorrecta

**Solución:**
1. Presiona F12 en el navegador
2. Ve a la pestaña "Console"
3. Busca errores de red
4. Verifica que `REACT_APP_API_URL` sea correcta en el frontend
5. Actualiza la variable y espera el redespliegue

---

## 📊 Información de tu Despliegue

### URLs (Completa después del despliegue)

**Frontend:** `https://________________________________.onrender.com`

**Backend:** `https://________________________________.onrender.com`

### Credenciales

**Usuario:** `admin`

**Contraseña:** `admin123`

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer login

### Variables de Entorno Configuradas

**Backend:**
- ✅ `NODE_ENV=production`
- ✅ `PORT=10000`
- ✅ `DATABASE_URL` (automático)
- ✅ `JWT_SECRET` (generado automáticamente)
- ✅ `CORS_ORIGIN` (URL del frontend)

**Frontend:**
- ✅ `REACT_APP_API_URL` (URL del backend)

---

## ✅ Checklist de Despliegue

- [ ] Archivos de configuración creados
- [ ] Repositorio creado en GitHub
- [ ] Código subido a GitHub
- [ ] Proyecto creado en Render
- [ ] Servicios desplegados (backend, frontend, database)
- [ ] Migraciones ejecutadas
- [ ] URLs obtenidas
- [ ] `REACT_APP_API_URL` actualizada en frontend
- [ ] `CORS_ORIGIN` actualizada en backend
- [ ] Login funciona correctamente
- [ ] Contraseña del admin cambiada

---

## 🎉 ¡Éxito!

Tu aplicación está ahora:
- ✅ Desplegada en la nube
- ✅ Accesible desde cualquier lugar
- ✅ Con base de datos PostgreSQL
- ✅ Con SSL/HTTPS seguro
- ✅ Completamente GRATIS

**Próximos pasos:**
1. Cambia la contraseña del admin
2. Crea usuarios adicionales
3. Configura categorías
4. Sube documentos de prueba
5. Comparte la URL con tu equipo

---

## 📞 Soporte

- **Documentación Render:** https://render.com/docs
- **Comunidad Render:** https://community.render.com
- **Guía completa:** Ver `GUIA_DESPLIEGUE_GRATIS.md`

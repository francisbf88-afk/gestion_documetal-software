# ✅ Checklist de Despliegue

## 📋 Antes de Empezar

- [ ] Git instalado y configurado
- [ ] Node.js instalado (v18 o superior)
- [ ] Cuenta de GitHub creada
- [ ] Cuenta de Render o Railway creada
- [ ] Código del proyecto listo

---

## 🔧 Preparación Local

- [ ] Ejecutar `verificar-antes-desplegar.bat`
- [ ] Verificar que no hay errores
- [ ] Revisar archivos `.env` locales
- [ ] Probar aplicación localmente (opcional)

---

## 📦 Configuración de Archivos

- [ ] Ejecutar script de despliegue (`INICIO_DESPLIEGUE.bat`)
- [ ] Verificar que se creó `render.yaml` o `railway.json`
- [ ] Verificar que se creó `migrate-database.js`
- [ ] Verificar que se actualizó `package.json`

---

## 🐙 GitHub

- [ ] Crear repositorio en GitHub
- [ ] Copiar URL del repositorio
- [ ] Ejecutar `git remote add origin [URL]`
- [ ] Ejecutar `git branch -M main`
- [ ] Ejecutar `git push -u origin main`
- [ ] Verificar que el código se subió correctamente

---

## ☁️ Plataforma de Despliegue (Render/Railway)

### Crear Proyecto

- [ ] Iniciar sesión en la plataforma
- [ ] Crear nuevo proyecto
- [ ] Conectar con repositorio de GitHub
- [ ] Autorizar acceso a repositorio

### Configurar Backend

- [ ] Servicio backend creado
- [ ] Variables de entorno configuradas:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT` (10000 para Render, auto para Railway)
  - [ ] `JWT_SECRET` (generado con `generar-jwt-secret.js`)
  - [ ] `DATABASE_URL` (automático)
- [ ] Dominio generado
- [ ] URL del backend copiada

### Configurar Base de Datos

- [ ] PostgreSQL agregado al proyecto
- [ ] Base de datos iniciada
- [ ] Credenciales disponibles
- [ ] `DATABASE_URL` conectada al backend

### Configurar Frontend

- [ ] Servicio frontend creado
- [ ] Variables de entorno configuradas:
  - [ ] `REACT_APP_API_URL` (URL del backend)
  - [ ] `GENERATE_SOURCEMAP=false`
- [ ] Dominio generado
- [ ] URL del frontend copiada

---

## 🗄️ Base de Datos

- [ ] Abrir Shell del backend
- [ ] Ejecutar `npm run migrate`
- [ ] Verificar mensaje de éxito
- [ ] Confirmar que se crearon las tablas
- [ ] Confirmar que se creó el usuario admin

---

## 🔗 Configuración de URLs

- [ ] Actualizar `REACT_APP_API_URL` en frontend
- [ ] Actualizar `CORS_ORIGIN` en backend
- [ ] Guardar cambios
- [ ] Esperar redespliegue automático

---

## 🧪 Pruebas

### Backend

- [ ] Abrir URL del backend en navegador
- [ ] Verificar `/api/health` responde OK
- [ ] Verificar que no hay errores en logs
- [ ] Verificar conexión a base de datos

### Frontend

- [ ] Abrir URL del frontend en navegador
- [ ] Verificar que carga la página de login
- [ ] Verificar que no hay errores en consola (F12)
- [ ] Verificar que no hay errores de CORS

### Funcionalidad

- [ ] Iniciar sesión con `admin` / `admin123`
- [ ] Verificar que el dashboard carga
- [ ] Probar navegación entre secciones
- [ ] Probar subir un documento
- [ ] Probar descargar un documento
- [ ] Probar crear un usuario
- [ ] Probar notificaciones

---

## 🔐 Seguridad Post-Despliegue

- [ ] Cambiar contraseña del usuario admin
- [ ] Crear usuarios adicionales
- [ ] Eliminar usuarios de prueba (si existen)
- [ ] Verificar que JWT_SECRET es único y seguro
- [ ] Verificar que no hay archivos `.env` en GitHub
- [ ] Configurar autenticación de dos factores en GitHub

---

## 📊 Monitoreo

- [ ] Verificar logs del backend
- [ ] Verificar logs del frontend
- [ ] Verificar métricas de la base de datos
- [ ] Configurar alertas (opcional)
- [ ] Documentar URLs de producción

---

## 📝 Documentación

- [ ] Documentar URLs de producción
- [ ] Documentar credenciales (en lugar seguro)
- [ ] Documentar proceso de actualización
- [ ] Compartir URLs con el equipo
- [ ] Crear guía de usuario (opcional)

---

## 🎉 Finalización

- [ ] Aplicación accesible desde internet
- [ ] Login funciona correctamente
- [ ] Todas las funcionalidades probadas
- [ ] Sin errores en logs
- [ ] Equipo notificado
- [ ] Documentación completa

---

## 📞 Información de Contacto

### URLs de Producción

**Frontend:** `https://_____________________.onrender.com`

**Backend:** `https://_____________________.onrender.com`

**Base de Datos:** `Configurada en la plataforma`

### Credenciales Iniciales

**Usuario:** `admin`

**Contraseña:** `admin123` (⚠️ CAMBIAR INMEDIATAMENTE)

### Plataforma

**Proveedor:** [ ] Render  [ ] Railway

**Cuenta:** `_____________________`

**Proyecto:** `_____________________`

---

## 🔄 Actualizaciones Futuras

Para actualizar la aplicación:

1. Hacer cambios en el código local
2. Commit: `git add . && git commit -m "Descripción"`
3. Push: `git push`
4. La plataforma redesplegará automáticamente

---

## 🆘 Contactos de Soporte

**Render Support:** https://render.com/docs

**Railway Support:** https://docs.railway.app

**Documentación del Proyecto:** Ver archivos `.md` en el repositorio

---

## 📅 Registro de Despliegue

**Fecha de despliegue:** `___/___/______`

**Desplegado por:** `_____________________`

**Versión:** `1.0.0`

**Notas adicionales:**

```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```

---

## ✅ Confirmación Final

- [ ] He completado todos los pasos anteriores
- [ ] La aplicación funciona correctamente
- [ ] He cambiado las contraseñas por defecto
- [ ] He documentado toda la información importante
- [ ] El equipo tiene acceso a la aplicación

**Firma:** `_____________________`

**Fecha:** `___/___/______`

---

🎉 **¡Felicidades! Tu aplicación está desplegada y lista para usar.**

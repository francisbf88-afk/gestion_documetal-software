# 📦 Archivos de Despliegue Creados

## ✅ Scripts Principales

### Windows
- **`INICIO_DESPLIEGUE.bat`** - Menú interactivo principal
- **`desplegar-render.bat`** - Script automático para Render.com
- **`desplegar-railway.bat`** - Script automático para Railway.app
- **`verificar-antes-desplegar.bat`** - Verificación del sistema

### Linux/Mac
- **`desplegar-render.sh`** - Script automático para Render.com

---

## 📚 Documentación

- **`GUIA_DESPLIEGUE_GRATIS.md`** - Guía completa y detallada
- **`DESPLIEGUE_RAPIDO.md`** - Guía rápida de 5 minutos
- **`ARCHIVOS_DESPLIEGUE.md`** - Este archivo

---

## ⚙️ Archivos de Configuración

- **`render.yaml`** - Configuración para Render.com (se crea automáticamente)
- **`backend/railway.json`** - Configuración para Railway (se crea automáticamente)
- **`frontend/railway.json`** - Configuración para Railway (se crea automáticamente)
- **`.env.production.example`** - Ejemplo de variables de entorno

---

## 🔧 Utilidades

- **`migrate-database.js`** - Script de migración de base de datos
- **`generar-jwt-secret.js`** - Generador de JWT secrets seguros
- **`package.json`** - Configuración raíz del proyecto

---

## 🚀 Cómo Usar

### Opción 1: Menú Interactivo (Recomendado)

**Windows:**
```cmd
INICIO_DESPLIEGUE.bat
```

Verás un menú con opciones:
1. Verificar sistema
2. Desplegar en Render
3. Desplegar en Railway
4. Ver guía completa
5. Salir

### Opción 2: Script Directo

**Para Render (Recomendado):**
```cmd
# Windows
desplegar-render.bat

# Linux/Mac
chmod +x desplegar-render.sh
./desplegar-render.sh
```

**Para Railway:**
```cmd
# Windows
desplegar-railway.bat
```

### Opción 3: Manual

Sigue la guía paso a paso en `GUIA_DESPLIEGUE_GRATIS.md`

---

## 📋 Flujo de Despliegue

```
1. Ejecutar script
   ↓
2. Se crean archivos de configuración
   ↓
3. Se inicializa Git
   ↓
4. Subir a GitHub
   ↓
5. Conectar con Render/Railway
   ↓
6. Despliegue automático
   ↓
7. Ejecutar migraciones
   ↓
8. Configurar URLs
   ↓
9. ¡Aplicación en línea!
```

---

## 🎯 Archivos Generados Automáticamente

Cuando ejecutas los scripts, se crean:

### Para Render:
- `render.yaml` - Configuración de servicios
- `migrate-database.js` - Script de migración
- `package.json` - Dependencias raíz

### Para Railway:
- `backend/railway.json` - Config del backend
- `frontend/railway.json` - Config del frontend
- `migrate-database.js` - Script de migración
- `package.json` - Dependencias raíz

---

## 🔐 Seguridad

### Generar JWT Secret

```bash
node generar-jwt-secret.js
```

Este comando genera secrets seguros de diferentes longitudes.

### Variables de Entorno

Consulta `.env.production.example` para ver todas las variables necesarias.

**IMPORTANTE:** Nunca subas archivos `.env` a GitHub.

---

## 📊 Comparación de Plataformas

| Característica | Render | Railway |
|----------------|--------|---------|
| **Script** | `desplegar-render.bat` | `desplegar-railway.bat` |
| **Dificultad** | ⭐ Fácil | ⭐⭐ Media |
| **Tiempo** | 10 min | 15 min |
| **PostgreSQL** | ✅ Gratis | ✅ Gratis ($5 crédito) |
| **Horas gratis** | 750/mes | Ilimitado |
| **Recomendado para** | Principiantes | Usuarios avanzados |

---

## 🆘 Solución de Problemas

### Script no ejecuta

**Windows:**
```cmd
# Asegúrate de tener permisos
# Click derecho → Ejecutar como administrador
```

**Linux/Mac:**
```bash
# Dale permisos de ejecución
chmod +x desplegar-render.sh
```

### Git no encontrado

Instala Git desde: https://git-scm.com/downloads

### Node.js no encontrado

Instala Node.js desde: https://nodejs.org/

### Errores durante el despliegue

1. Revisa los logs en la plataforma
2. Verifica las variables de entorno
3. Consulta `GUIA_DESPLIEGUE_GRATIS.md`

---

## ✅ Checklist de Archivos

Antes de desplegar, verifica que existan:

- [ ] `backend/package.json`
- [ ] `frontend/package.json`
- [ ] `backend/server.js`
- [ ] `database/schema.sql`
- [ ] `database/notifications-schema.sql`
- [ ] Scripts de despliegue (`.bat` o `.sh`)

Para verificar automáticamente:
```cmd
verificar-antes-desplegar.bat
```

---

## 📞 Recursos Adicionales

### Documentación
- Render: https://render.com/docs
- Railway: https://docs.railway.app
- PostgreSQL: https://www.postgresql.org/docs

### Tutoriales
- Render Deploy: https://render.com/docs/deploy-node-express-app
- Railway Deploy: https://docs.railway.app/deploy/deployments

### Comunidad
- Render Community: https://community.render.com
- Railway Discord: https://discord.gg/railway

---

## 🎉 Resultado Final

Después de ejecutar los scripts, tendrás:

✅ Aplicación desplegada en la nube
✅ Base de datos PostgreSQL configurada
✅ SSL/HTTPS automático
✅ Acceso desde cualquier lugar
✅ Dominio público
✅ 100% GRATIS

**URLs de ejemplo:**
- Frontend: `https://sgd-frontend-abc123.onrender.com`
- Backend: `https://sgd-backend-xyz789.onrender.com`

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

---

## 💡 Próximos Pasos

1. ✅ Cambia la contraseña del admin
2. ✅ Crea usuarios adicionales
3. ✅ Configura categorías de documentos
4. ✅ Sube documentos de prueba
5. ✅ Comparte la URL con tu equipo
6. ✅ Configura un dominio personalizado (opcional)

---

## 📝 Notas Importantes

1. **Tiempo de inactividad:** En el plan gratuito de Render, los servicios se duermen después de 15 minutos de inactividad. El primer request después de dormir puede tomar ~30 segundos.

2. **Límites:** 
   - Render: 750 horas/mes por servicio
   - Railway: $5 USD de crédito mensual

3. **Backups:** Configura backups regulares de tu base de datos en producción.

4. **Monitoreo:** Revisa los logs regularmente para detectar errores.

5. **Actualizaciones:** Cuando hagas cambios en el código, solo haz `git push` y la plataforma redesplegará automáticamente.

---

**Creado:** 2024
**Versión:** 1.0.0
**Licencia:** MIT

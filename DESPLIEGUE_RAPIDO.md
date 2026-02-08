# 🚀 Despliegue Rápido - 5 Minutos

## ⚡ Inicio Rápido

### Windows
```cmd
INICIO_DESPLIEGUE.bat
```

### Linux/Mac
```bash
chmod +x desplegar-render.sh
./desplegar-render.sh
```

---

## 📝 Pasos Resumidos

### 1. Ejecutar Script
- **Windows:** Doble click en `INICIO_DESPLIEGUE.bat`
- **Linux/Mac:** `./desplegar-render.sh`

### 2. Crear Cuenta en Render
- Ve a: https://render.com
- Regístrate con GitHub (gratis)

### 3. Subir a GitHub
```bash
# Crea un repo en: https://github.com/new
# Luego ejecuta (reemplaza TU-USUARIO):

git remote add origin https://github.com/TU-USUARIO/sgd-sistema-documental.git
git branch -M main
git push -u origin main
```

### 4. Desplegar en Render
1. En Render, click "New +" → "Blueprint"
2. Selecciona tu repositorio
3. Click "Apply"
4. Espera 5-10 minutos

### 5. Ejecutar Migraciones
1. En Render, ve a `sgd-backend`
2. Click en "Shell"
3. Ejecuta: `npm run migrate`

### 6. Actualizar URLs
1. Copia la URL del backend
2. Ve a `sgd-frontend` → "Environment"
3. Actualiza `REACT_APP_API_URL`
4. Guarda cambios

### 7. ¡Listo!
- Abre la URL del frontend
- Login: `admin` / `admin123`

---

## 🎯 Plataformas Disponibles

| Plataforma | Comando | Tiempo | Dificultad |
|------------|---------|--------|------------|
| **Render** | `desplegar-render.bat` | 10 min | ⭐ Fácil |
| **Railway** | `desplegar-railway.bat` | 15 min | ⭐⭐ Media |

---

## 📚 Documentación Completa

Para instrucciones detalladas, ver:
- `GUIA_DESPLIEGUE_GRATIS.md` - Guía completa paso a paso
- `COMO_DESPLEGAR.md` - Documentación original

---

## 🆘 Problemas Comunes

### Error: CORS
```bash
# En Render, agrega en backend → Environment:
CORS_ORIGIN=https://tu-frontend.onrender.com
```

### Error: Login falla
```bash
# En Render → sgd-backend → Shell:
npm run migrate
```

### Error: Base de datos
```bash
# Verifica que DATABASE_URL esté configurada
# Render la agrega automáticamente
```

---

## ✅ Checklist

- [ ] Script ejecutado
- [ ] Código en GitHub
- [ ] Servicios desplegados en Render
- [ ] Migraciones ejecutadas
- [ ] URLs actualizadas
- [ ] Login funciona

---

## 🎉 ¡Éxito!

Tu aplicación está en línea en:
- **Frontend:** `https://sgd-frontend-xxxx.onrender.com`
- **Backend:** `https://sgd-backend-xxxx.onrender.com`

**Credenciales:**
- Usuario: `admin`
- Contraseña: `admin123`

---

## 💡 Próximos Pasos

1. Cambia la contraseña del admin
2. Crea nuevos usuarios
3. Configura categorías
4. Sube documentos de prueba
5. Comparte la URL con tu equipo

---

## 📞 Soporte

- **Documentación:** `GUIA_DESPLIEGUE_GRATIS.md`
- **Render Docs:** https://render.com/docs
- **Railway Docs:** https://docs.railway.app

---

**Tiempo total:** ~10-15 minutos
**Costo:** $0 USD (100% gratis)
**Acceso:** Desde cualquier lugar con internet

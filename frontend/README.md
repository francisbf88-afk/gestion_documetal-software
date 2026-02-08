# Frontend - Sistema de Gestión Documental

Aplicación web React para el Sistema de Gestión Documental.

## 🚀 Deployment en Railway

### Paso 1: Preparar el Repositorio

1. Crear un repositorio Git separado para el frontend:
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit"
```

2. Subir a GitHub:
```bash
git remote add origin https://github.com/tu-usuario/sgd-frontend.git
git push -u origin main
```

### Paso 2: Configurar Railway

1. Ve a [Railway.app](https://railway.app)
2. Crea un nuevo proyecto (o usa el mismo proyecto del backend)
3. Haz clic en "+ New" → "GitHub Repo"
4. Conecta tu repositorio del frontend

### Paso 3: Configurar Variables de Entorno

En Railway, ve a tu servicio frontend → Variables y agrega:

```env
REACT_APP_API_URL=https://tu-backend.railway.app
GENERATE_SOURCEMAP=false
```

**IMPORTANTE**: Reemplaza `https://tu-backend.railway.app` con la URL real de tu backend en Railway.

### Paso 4: Deploy

Railway desplegará automáticamente tu frontend. Obtendrás una URL como:
```
https://sgd-frontend-production.up.railway.app
```

### Paso 5: Actualizar CORS en el Backend

Después de obtener la URL del frontend, actualiza la variable `CORS_ORIGIN` en el backend:

```env
CORS_ORIGIN=https://tu-frontend.railway.app
```

## 📦 Instalación Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu backend

# Iniciar en desarrollo
npm start

# Construir para producción
npm run build

# Servir build de producción localmente
npm run serve
```

## 🔧 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| PORT | Puerto del servidor de desarrollo | 3001 |
| REACT_APP_API_URL | URL de la API del backend | https://backend.railway.app |
| HOST | Host para desarrollo | 0.0.0.0 |
| GENERATE_SOURCEMAP | Generar source maps | false |

## 🏗️ Estructura del Proyecto

```
frontend/
├── public/              # Archivos estáticos
│   ├── index.html
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── components/      # Componentes React
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── DocumentList.js
│   │   └── ...
│   ├── contexts/        # Context API
│   │   └── AuthContext.js
│   ├── hooks/           # Custom hooks
│   │   └── useNotifications.js
│   ├── theme/           # Tema de Material-UI
│   │   └── theme.js
│   ├── App.js           # Componente principal
│   └── index.js         # Punto de entrada
├── .env.example         # Ejemplo de variables de entorno
├── .env.production      # Variables para producción
├── package.json
└── railway.json         # Configuración de Railway
```

## 🎨 Tecnologías

- **React** - Librería de UI
- **Material-UI** - Componentes de UI
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Monaco Editor** - Editor de código
- **Context API** - Gestión de estado

## 🔐 Autenticación

El frontend usa JWT (JSON Web Tokens) para autenticación:
- El token se almacena en `localStorage`
- Se incluye en todas las peticiones a la API
- Se verifica automáticamente al cargar la aplicación

## 📱 Características

- ✅ Login con roles (Admin, Editor, Asesor)
- ✅ Dashboard con estadísticas
- ✅ Gestión de documentos (CRUD)
- ✅ Editor de documentos integrado
- ✅ Apertura en editores externos
- ✅ Sistema de notificaciones
- ✅ Gestión de usuarios (Admin)
- ✅ Gestión de categorías
- ✅ Búsqueda y filtrado
- ✅ Responsive design

## 🐛 Troubleshooting

### Error de CORS
- Verifica que `REACT_APP_API_URL` apunte a tu backend
- Asegúrate de que el backend tenga configurado CORS correctamente

### Variables de entorno no se cargan
- Las variables deben empezar con `REACT_APP_`
- Reinicia el servidor de desarrollo después de cambiar `.env`
- En Railway, configura las variables en el dashboard

### Build falla
- Verifica que todas las dependencias estén instaladas
- Revisa los logs de Railway para errores específicos
- Asegúrate de que `REACT_APP_API_URL` esté configurada

### Página en blanco después del deploy
- Verifica la consola del navegador (F12)
- Asegúrate de que el backend esté accesible
- Verifica que las rutas de React Router estén configuradas

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm start              # Inicia servidor de desarrollo

# Producción
npm run build          # Construye para producción
npm run serve          # Sirve el build localmente

# Testing
npm test               # Ejecuta tests
npm run test:coverage  # Tests con cobertura
```

## 🌐 URLs de Acceso

### Desarrollo
- Frontend: http://localhost:3001
- Backend API: http://localhost:5001/api

### Producción (Railway)
- Frontend: https://tu-frontend.railway.app
- Backend API: https://tu-backend.railway.app/api

## 👥 Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| editor | editor123 | Editor |
| asesor | asesor123 | Asesor |

## 📚 Documentación Adicional

- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [Railway Documentation](https://docs.railway.app)

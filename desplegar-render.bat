@echo off
chcp 65001 >nul
cls

REM ========================================
REM Script de Despliegue Automático - Render.com
REM Sistema de Gestión Documental (SGD)
REM ========================================

echo.
echo ========================================
echo 🚀 DESPLIEGUE AUTOMÁTICO EN RENDER.COM
echo ========================================
echo.

REM Verificar que Git esté instalado
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git no está instalado
    echo Por favor instala Git desde: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✓ Git está instalado
echo.

REM ========================================
REM PASO 1: Crear render.yaml
REM ========================================
echo [PASO 1] Creando configuración de Render...

(
echo services:
echo   # Backend API
echo   - type: web
echo     name: sgd-backend
echo     env: node
echo     region: oregon
echo     plan: free
echo     buildCommand: cd backend ^&^& npm install
echo     startCommand: cd backend ^&^& npm start
echo     envVars:
echo       - key: NODE_ENV
echo         value: production
echo       - key: PORT
echo         value: 10000
echo       - key: DATABASE_URL
echo         fromDatabase:
echo           name: sgd-database
echo           property: connectionString
echo       - key: JWT_SECRET
echo         generateValue: true
echo       - key: CORS_ORIGIN
echo         sync: false
echo     healthCheckPath: /api/health
echo.
echo   # Frontend
echo   - type: web
echo     name: sgd-frontend
echo     env: static
echo     region: oregon
echo     plan: free
echo     buildCommand: cd frontend ^&^& npm install ^&^& npm run build
echo     staticPublishPath: frontend/build
echo     envVars:
echo       - key: REACT_APP_API_URL
echo         value: https://sgd-backend.onrender.com
echo     routes:
echo       - type: rewrite
echo         source: /*
echo         destination: /index.html
echo.
echo databases:
echo   - name: sgd-database
echo     databaseName: sgd
echo     user: sgd_user
echo     plan: free
echo     region: oregon
) > render.yaml

echo ✓ render.yaml creado
echo.

REM ========================================
REM PASO 2: Crear script de migración
REM ========================================
echo [PASO 2] Creando script de migración de base de datos...

(
echo const { Pool } = require^('pg'^);
echo const fs = require^('fs'^);
echo const path = require^('path'^);
echo.
echo const pool = new Pool^({
echo     connectionString: process.env.DATABASE_URL,
echo     ssl: { rejectUnauthorized: false }
echo }^);
echo.
echo async function runMigrations^(^) {
echo     console.log^('🔄 Ejecutando migraciones...'^);
echo     try {
echo         const schemaPath = path.join^(__dirname, 'database', 'schema.sql'^);
echo         const schema = fs.readFileSync^(schemaPath, 'utf8'^);
echo         console.log^('📝 Ejecutando schema.sql...'^);
echo         await pool.query^(schema^);
echo         console.log^('✓ Schema creado'^);
echo.
echo         const notificationsPath = path.join^(__dirname, 'database', 'notifications-schema.sql'^);
echo         const notificationsSchema = fs.readFileSync^(notificationsPath, 'utf8'^);
echo         console.log^('📝 Ejecutando notifications-schema.sql...'^);
echo         await pool.query^(notificationsSchema^);
echo         console.log^('✓ Notificaciones configuradas'^);
echo.
echo         const bcrypt = require^('bcryptjs'^);
echo         const adminPassword = await bcrypt.hash^('admin123', 10^);
echo         const checkAdmin = await pool.query^('SELECT id FROM usuarios WHERE username = $1', ['admin']^);
echo.
echo         if ^(checkAdmin.rows.length === 0^) {
echo             await pool.query^(
echo                 'INSERT INTO usuarios ^(nombre, username, email, password, rol^) VALUES ^($1, $2, $3, $4, $5^)',
echo                 ['Administrador', 'admin', 'admin@sistema.com', adminPassword, 'admin']
echo             ^);
echo             console.log^('✓ Usuario admin creado'^);
echo         }
echo         console.log^('✅ Migraciones completadas'^);
echo         process.exit^(0^);
echo     } catch ^(error^) {
echo         console.error^('❌ Error:', error^);
echo         process.exit^(1^);
echo     }
echo }
echo runMigrations^(^);
) > migrate-database.js

echo ✓ migrate-database.js creado
echo.

REM ========================================
REM PASO 3: Actualizar package.json raíz
REM ========================================
echo [PASO 3] Actualizando package.json...

(
echo {
echo   "name": "sgd-sistema-gestion-documental",
echo   "version": "1.0.0",
echo   "description": "Sistema de Gestión Documental con PostgreSQL",
echo   "scripts": {
echo     "migrate": "node migrate-database.js",
echo     "postinstall": "cd backend && npm install && cd ../frontend && npm install"
echo   },
echo   "dependencies": {
echo     "bcryptjs": "^2.4.3",
echo     "pg": "^8.11.3"
echo   }
echo }
) > package.json

echo ✓ package.json actualizado
echo.

REM ========================================
REM PASO 4: Configurar Git
REM ========================================
echo [PASO 4] Configurando Git...

if not exist .git (
    git init
    echo ✓ Repositorio Git inicializado
) else (
    echo ✓ Repositorio Git ya existe
)

git add .
git commit -m "Preparar para despliegue en Render" 2>nul
echo.

REM ========================================
REM INSTRUCCIONES FINALES
REM ========================================
echo.
echo ========================================
echo 📋 INSTRUCCIONES PARA DESPLEGAR
echo ========================================
echo.
echo 1️⃣  CREAR REPOSITORIO EN GITHUB:
echo    - Ve a: https://github.com/new
echo    - Nombre: sgd-sistema-documental
echo    - Tipo: Público o Privado
echo    - NO inicialices con README
echo.
echo 2️⃣  SUBIR CÓDIGO (reemplaza TU-USUARIO):
echo    git remote add origin https://github.com/TU-USUARIO/sgd-sistema-documental.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3️⃣  DESPLEGAR EN RENDER:
echo    - Ve a: https://render.com
echo    - Crea cuenta gratis
echo    - Click "New +" → "Blueprint"
echo    - Conecta tu repositorio
echo    - Click "Apply"
echo.
echo 4️⃣  EJECUTAR MIGRACIONES:
echo    - En Render, ve a "sgd-backend"
echo    - Click en "Shell"
echo    - Ejecuta: npm run migrate
echo.
echo 5️⃣  ACTUALIZAR URL FRONTEND:
echo    - Ve a "sgd-frontend" → "Environment"
echo    - Actualiza REACT_APP_API_URL con URL del backend
echo    - Guarda cambios
echo.
echo ========================================
echo ✅ ARCHIVOS CREADOS:
echo ========================================
echo  ✓ render.yaml
echo  ✓ migrate-database.js
echo  ✓ package.json
echo.
echo 🎉 ¡Todo listo para desplegar!
echo.
echo 📚 Ayuda: https://render.com/docs
echo.
pause

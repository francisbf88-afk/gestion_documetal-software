@echo off
chcp 65001 >nul
cls

REM ========================================
REM Script de Despliegue - Railway.app
REM Sistema de Gestión Documental (SGD)
REM ========================================

echo.
echo ========================================
echo 🚂 DESPLIEGUE EN RAILWAY.APP
echo ========================================
echo.

REM Verificar Git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git no está instalado
    pause
    exit /b 1
)

echo ✓ Git instalado
echo.

REM ========================================
REM Crear railway.json para backend
REM ========================================
echo [PASO 1] Creando configuración de Railway...

(
echo {
echo   "$schema": "https://railway.app/railway.schema.json",
echo   "build": {
echo     "builder": "NIXPACKS",
echo     "buildCommand": "npm install"
echo   },
echo   "deploy": {
echo     "startCommand": "npm start",
echo     "restartPolicyType": "ON_FAILURE",
echo     "restartPolicyMaxRetries": 10
echo   }
echo }
) > backend\railway.json

echo ✓ backend/railway.json creado
echo.

REM ========================================
REM Crear railway.json para frontend
REM ========================================

(
echo {
echo   "$schema": "https://railway.app/railway.schema.json",
echo   "build": {
echo     "builder": "NIXPACKS",
echo     "buildCommand": "npm install && npm run build"
echo   },
echo   "deploy": {
echo     "startCommand": "npx serve -s build -l $PORT",
echo     "restartPolicyType": "ON_FAILURE",
echo     "restartPolicyMaxRetries": 10
echo   }
echo }
) > frontend\railway.json

echo ✓ frontend/railway.json creado
echo.

REM ========================================
REM Crear script de migración
REM ========================================
echo [PASO 2] Creando script de migración...

(
echo const { Pool } = require^('pg'^);
echo const fs = require^('fs'^);
echo const path = require^('path'^);
echo.
echo const pool = new Pool^({
echo     connectionString: process.env.DATABASE_URL,
echo     ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
echo }^);
echo.
echo async function runMigrations^(^) {
echo     console.log^('🔄 Ejecutando migraciones...'^);
echo     try {
echo         const schemaPath = path.join^(__dirname, 'database', 'schema.sql'^);
echo         const schema = fs.readFileSync^(schemaPath, 'utf8'^);
echo         await pool.query^(schema^);
echo         console.log^('✓ Schema creado'^);
echo.
echo         const notificationsPath = path.join^(__dirname, 'database', 'notifications-schema.sql'^);
echo         const notificationsSchema = fs.readFileSync^(notificationsPath, 'utf8'^);
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
echo         await pool.end^(^);
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
REM Actualizar package.json raíz
REM ========================================
echo [PASO 3] Actualizando package.json...

(
echo {
echo   "name": "sgd-sistema-gestion-documental",
echo   "version": "1.0.0",
echo   "description": "Sistema de Gestión Documental",
echo   "scripts": {
echo     "migrate": "node migrate-database.js"
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
REM Configurar Git
REM ========================================
echo [PASO 4] Configurando Git...

if not exist .git (
    git init
    echo ✓ Git inicializado
) else (
    echo ✓ Git ya existe
)

git add .
git commit -m "Configurar para Railway" 2>nul
echo.

REM ========================================
REM INSTRUCCIONES
REM ========================================
echo.
echo ========================================
echo 📋 PASOS PARA DESPLEGAR EN RAILWAY
echo ========================================
echo.
echo 1️⃣  INSTALAR RAILWAY CLI (Opcional):
echo    npm install -g @railway/cli
echo.
echo 2️⃣  CREAR CUENTA EN RAILWAY:
echo    - Ve a: https://railway.app
echo    - Regístrate con GitHub
echo.
echo 3️⃣  OPCIÓN A - Desplegar con CLI:
echo    railway login
echo    railway init
echo    railway up
echo.
echo 4️⃣  OPCIÓN B - Desplegar desde GitHub:
echo    a. Sube tu código a GitHub:
echo       git remote add origin https://github.com/TU-USUARIO/sgd.git
echo       git push -u origin main
echo.
echo    b. En Railway:
echo       - Click "New Project"
echo       - "Deploy from GitHub repo"
echo       - Selecciona tu repositorio
echo.
echo 5️⃣  AGREGAR POSTGRESQL:
echo    - En tu proyecto, click "+ New"
echo    - Selecciona "Database"
echo    - Elige "Add PostgreSQL"
echo.
echo 6️⃣  CONFIGURAR VARIABLES (Backend):
echo    NODE_ENV=production
echo    JWT_SECRET=tu_secret_muy_seguro
echo    PORT=3000
echo    (DATABASE_URL se agrega automáticamente)
echo.
echo 7️⃣  CONFIGURAR VARIABLES (Frontend):
echo    REACT_APP_API_URL=https://tu-backend.railway.app
echo.
echo 8️⃣  EJECUTAR MIGRACIONES:
echo    railway run npm run migrate
echo.
echo 9️⃣  GENERAR DOMINIOS:
echo    - Backend: Settings → Networking → Generate Domain
echo    - Frontend: Settings → Networking → Generate Domain
echo.
echo ========================================
echo ✅ ARCHIVOS CREADOS
echo ========================================
echo  ✓ backend/railway.json
echo  ✓ frontend/railway.json
echo  ✓ migrate-database.js
echo  ✓ package.json
echo.
echo 🎉 ¡Listo para Railway!
echo.
echo 📚 Docs: https://docs.railway.app
echo.
pause

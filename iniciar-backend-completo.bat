@echo off
echo ========================================
echo      INICIO COMPLETO DEL BACKEND
echo ========================================
echo.

:: Cambiar al directorio del backend
cd /d "%~dp0backend"

echo [1/4] Verificando dependencias de Node.js...
if not exist "node_modules" (
    echo ❌ Dependencias no encontradas. Instalando...
    npm install
    if %errorLevel% neq 0 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
    echo ✓ Dependencias instaladas correctamente
) else (
    echo ✓ Dependencias ya instaladas
)

echo.
echo [2/4] Verificando configuración de variables de entorno...
if not exist ".env" (
    echo ❌ Archivo .env no encontrado en backend
    echo Creando archivo .env con configuración por defecto...
    echo PORT=5001> .env
    echo NODE_ENV=development>> .env
    echo DB_HOST=localhost>> .env
    echo DB_PORT=5432>> .env
    echo DB_NAME=sgd>> .env
    echo DB_USER=postgres>> .env
    echo DB_PASSWORD=postgres>> .env
    echo JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2024>> .env
    echo ✓ Archivo .env creado
) else (
    echo ✓ Archivo .env encontrado
)

echo.
echo [3/4] Verificando puerto 5001...
netstat -an | findstr :5001 >nul
if %errorLevel% == 0 (
    echo ⚠️  Puerto 5001 ya está en uso. Terminando procesos...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 >nul
)

echo.
echo [4/4] Iniciando servidor backend en puerto 5001...
echo ✓ Backend iniciándose...
echo ✓ API disponible en: http://localhost:5001/api
echo ✓ Acceso remoto en: http://%COMPUTERNAME%:5001/api
echo.
echo Presiona Ctrl+C para detener el servidor
echo ========================================
echo.

node server.js
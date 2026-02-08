@echo off
echo ========================================
echo      INICIAR PROYECTO LOCAL
echo ========================================
echo.

echo Verificando configuracion...

if not exist "backend\.env" (
    echo ❌ backend\.env no encontrado
    echo Ejecuta primero: setup-local.bat
    pause
    exit /b 1
)

if not exist "frontend\.env" (
    echo ❌ frontend\.env no encontrado
    echo Ejecuta primero: setup-local.bat
    pause
    exit /b 1
)

echo ✓ Configuracion encontrada
echo.
echo Iniciando servicios...
echo.

echo [Backend] Iniciando en puerto 5001...
start "SGD Backend" cmd /k "cd /d backend && npm start"

timeout /t 3 >nul

echo [Frontend] Iniciando en puerto 3001...
start "SGD Frontend" cmd /k "cd /d frontend && npm start"

echo.
echo ========================================
echo         SERVICIOS INICIADOS
echo ========================================
echo.
echo ✓ Backend:  http://localhost:5001
echo ✓ Frontend: http://localhost:3001
echo.
echo Las ventanas del backend y frontend se abrieron.
echo Cierra esta ventana cuando termines.
echo.
echo Para detener los servicios, cierra las ventanas
echo del backend y frontend.
echo.
pause
@echo off
echo ========================================
echo   Sistema Archivistico - Iniciando
echo ========================================
echo.

echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias del backend...
    call npm install
)

if not exist "frontend/node_modules" (
    echo Instalando dependencias del frontend...
    cd frontend
    call npm install --legacy-peer-deps
    cd ..
)

echo.
echo Iniciando servidor de desarrollo...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.

call npm run dev
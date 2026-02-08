@echo off
echo ========================================
echo   Sistema Archivistico - Instalacion
echo ========================================
echo.

echo Instalando dependencias del backend...
call npm install
if %errorlevel% neq 0 (
    echo Error al instalar dependencias del backend
    pause
    exit /b 1
)

echo.
echo Instalando dependencias del frontend...
cd frontend
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Error al instalar dependencias del frontend
    pause
    exit /b 1
)

cd ..
echo.
echo ========================================
echo   Instalacion completada exitosamente
echo ========================================
echo.
echo Pasos siguientes:
echo 1. Configurar la base de datos MySQL
echo 2. Ejecutar el script database/schema.sql
echo 3. Configurar el archivo .env
echo 4. Ejecutar: npm run dev
echo.
pause
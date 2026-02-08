@echo off
echo ========================================
echo    CONFIGURACION LOCAL DEL PROYECTO
echo ========================================
echo.

echo [1/5] Verificando PostgreSQL...
psql --version >nul 2>&1
if %errorLevel% == 0 (
    echo ✓ PostgreSQL instalado
) else (
    echo ❌ PostgreSQL no encontrado
    echo Por favor instala PostgreSQL desde: https://www.postgresql.org/download/
    pause
    exit /b 1
)

echo.
echo [2/5] Configurando variables de entorno del backend...
if not exist "backend\.env" (
    echo Creando backend\.env...
    (
        echo PORT=5001
        echo NODE_ENV=development
        echo.
        echo # Database configuration
        echo DB_HOST=localhost
        echo DB_PORT=5432
        echo DB_NAME=sgd
        echo DB_USER=postgres
        echo DB_PASSWORD=postgres
        echo.
        echo # JWT Secret
        echo JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2024
        echo.
        echo # CORS ^(para desarrollo local^)
        echo CORS_ORIGIN=http://localhost:3001
        echo FRONTEND_URL=http://localhost:3001
    ) > backend\.env
    echo ✓ backend\.env creado
) else (
    echo ✓ backend\.env ya existe
)

echo.
echo [3/5] Configurando variables de entorno del frontend...
if not exist "frontend\.env" (
    echo Creando frontend\.env...
    (
        echo PORT=3001
        echo REACT_APP_API_URL=http://localhost:5001
        echo HOST=0.0.0.0
        echo GENERATE_SOURCEMAP=false
    ) > frontend\.env
    echo ✓ frontend\.env creado
) else (
    echo ✓ frontend\.env ya existe
)

echo.
echo [4/5] Instalando dependencias del backend...
cd backend
call npm install
if %errorLevel% neq 0 (
    echo ❌ Error instalando dependencias del backend
    cd ..
    pause
    exit /b 1
)
echo ✓ Dependencias del backend instaladas
cd ..

echo.
echo [5/5] Instalando dependencias del frontend...
cd frontend
call npm install
if %errorLevel% neq 0 (
    echo ❌ Error instalando dependencias del frontend
    cd ..
    pause
    exit /b 1
)
echo ✓ Dependencias del frontend instaladas
cd ..

echo.
echo ========================================
echo        CONFIGURACION COMPLETADA
echo ========================================
echo.
echo ✓ Variables de entorno configuradas
echo ✓ Dependencias instaladas
echo.
echo PROXIMOS PASOS:
echo.
echo 1. Crear base de datos PostgreSQL:
echo    psql -U postgres
echo    CREATE DATABASE sgd;
echo    \q
echo.
echo 2. Ejecutar migraciones:
echo    psql -U postgres -d sgd -f database\schema.sql
echo.
echo 3. Iniciar el proyecto:
echo    iniciar-local.bat
echo.
pause
@echo off
title Sistema Archivistico - Instalacion Completa
color 0E

:: Cambiar al directorio donde está el archivo .bat
cd /d "%~dp0"

echo ========================================
echo   SISTEMA ARCHIVISTICO
echo   INSTALACION COMPLETA
echo ========================================
echo.
echo [INFO] Directorio de trabajo: %CD%
echo.

:: Verificar permisos de administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Se recomienda ejecutar como administrador
    echo para una instalacion completa del servicio
    echo.
    echo ¿Continuar sin permisos de administrador? (S/N)
    set /p continuar=
    if /i not "%continuar%"=="S" exit /b 1
)

:: Verificar Node.js
echo [1/8] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no encontrado
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org/
    echo Recomendado: Version LTS (Long Term Support)
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo [OK] Node.js %%i instalado
)

:: Verificar npm
echo [2/8] Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm no encontrado
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do echo [OK] npm %%i instalado
)

:: Instalar dependencias del backend
echo [3/8] Instalando dependencias del backend...
if exist "package.json" (
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Error al instalar dependencias del backend
        pause
        exit /b 1
    )
    echo [OK] Dependencias del backend instaladas
) else (
    echo [ERROR] No se encontro package.json en el directorio actual
    pause
    exit /b 1
)

:: Instalar dependencias del frontend
echo [4/8] Instalando dependencias del frontend...
if exist "frontend\package.json" (
    cd frontend
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [ERROR] Error al instalar dependencias del frontend
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo [OK] Dependencias del frontend instaladas
) else (
    echo [ERROR] No se encontro frontend\package.json
    pause
    exit /b 1
)

:: Configurar archivo .env
echo [5/8] Configurando variables de entorno...
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [OK] Archivo .env creado desde .env.example
        echo [AVISO] Revisa y configura .env con tus datos de MySQL
    ) else (
        echo [AVISO] No se encontro .env.example, creando .env basico...
        (
            echo DB_HOST=localhost
            echo DB_USER=root
            echo DB_PASSWORD=root
            echo DB_NAME=sgd
            echo JWT_SECRET=mi_secreto_jwt_super_seguro_2024
            echo PORT=5000
            echo NODE_ENV=development
        ) > .env
        echo [OK] Archivo .env basico creado
    )
) else (
    echo [OK] Archivo .env ya existe
)

:: Crear directorios necesarios
echo [6/8] Creando directorios necesarios...
if not exist "backend\uploads" (
    mkdir backend\uploads
    echo [OK] Directorio backend\uploads creado
)
if not exist "logs" (
    mkdir logs
    echo [OK] Directorio logs creado
)

:: Verificar PostgreSQL (opcional)
echo [7/8] Verificando conexion a PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] PostgreSQL CLI no encontrado en PATH
    echo Asegurate de que PostgreSQL este instalado y ejecutandose
) else (
    echo [OK] PostgreSQL CLI encontrado
    echo [INFO] Para inicializar la base de datos ejecuta:
    echo        psql -U postgres -d sgd -f database\schema.sql
)

:: Instalar PM2 globalmente (opcional)
echo [8/8] Instalando PM2 para gestion de procesos...
pm2 --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Instalando PM2 globalmente...
    call npm install -g pm2
    if %errorlevel% neq 0 (
        echo [AVISO] No se pudo instalar PM2 (puede requerir permisos de admin)
        echo PM2 es opcional pero recomendado para produccion
    ) else (
        echo [OK] PM2 instalado correctamente
    )
) else (
    echo [OK] PM2 ya esta instalado
)

echo.
echo ========================================
echo   INSTALACION COMPLETADA
echo ========================================
echo.
echo Archivos disponibles:
echo.
echo iniciar.bat           - Inicia backend y frontend en desarrollo
echo servicio.bat          - Gestiona servicio de Windows (requiere admin)
echo gestionar-servicio.bat - Controla servicio una vez instalado
echo.
echo Proximos pasos:
echo.
echo 1. Configura PostgreSQL y ejecuta: psql -U postgres -d sgd -f database\schema.sql
echo 2. Revisa el archivo .env con tus configuraciones
echo 3. Ejecuta iniciar.bat para probar la aplicacion
echo 4. Para produccion, ejecuta servicio.bat como administrador
echo.
echo URLs de acceso:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:5000
echo - API:      http://localhost:5000/api
echo.
echo Usuarios de prueba:
echo - Admin:  admin / admin123
echo - Editor: editor / editor123
echo - Asesor: asesor / asesor123
echo.
echo ¿Deseas iniciar la aplicacion ahora? (S/N)
set /p iniciar=
if /i "%iniciar%"=="S" (
    echo.
    echo [INFO] Iniciando aplicacion...
    call iniciar.bat
)

echo.
echo [INFO] Instalacion completa. ¡Disfruta del Sistema Archivistico!
pause
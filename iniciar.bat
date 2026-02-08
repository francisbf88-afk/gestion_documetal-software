@echo off
title Sistema Archivistico - Iniciando...
color 0A

:: Cambiar al directorio donde está el archivo .bat
cd /d "%~dp0"

echo ========================================
echo   SISTEMA ARCHIVISTICO - INICIANDO
echo ========================================
echo.
echo [INFO] Directorio actual: %CD%
echo.

:: Verificar si estamos en el directorio correcto
if not exist "package.json" (
    echo [ERROR] No se encontro package.json en el directorio actual
    echo [ERROR] Directorio actual: %CD%
    echo [ERROR] Asegurate de ejecutar este archivo desde el directorio del proyecto
    echo.
    echo [INFO] El directorio deberia contener:
    echo        - package.json
    echo        - frontend/
    echo        - backend/
    echo        - database/
    echo.
    pause
    exit /b 1
)

:: Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado o no está en el PATH
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

:: Verificar si las dependencias están instaladas
if not exist "node_modules" (
    echo [INFO] Instalando dependencias del backend...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Error al instalar dependencias del backend
        pause
        exit /b 1
    )
)

if not exist "frontend\node_modules" (
    echo [INFO] Instalando dependencias del frontend...
    cd frontend
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [ERROR] Error al instalar dependencias del frontend
        cd ..
        pause
        exit /b 1
    )
    cd ..
)

:: Verificar si existe el archivo .env
if not exist ".env" (
    echo [INFO] Creando archivo .env desde .env.example...
    if exist ".env.example" (
        copy .env.example .env >nul
    ) else (
        echo [AVISO] Creando .env basico...
        (
            echo DB_HOST=localhost
            echo DB_USER=root
            echo DB_PASSWORD=root
            echo DB_NAME=sgd
            echo JWT_SECRET=mi_secreto_jwt_super_seguro_2024
            echo PORT=5000
            echo NODE_ENV=development
        ) > .env
    )
    echo [AVISO] Revisa y configura el archivo .env con tus datos de MySQL
)

:: Crear directorio uploads si no existe
if not exist "backend\uploads" (
    echo [INFO] Creando directorio uploads...
    mkdir backend\uploads
)

:: Verificar que los puertos estén disponibles
echo [INFO] Verificando puertos disponibles...
netstat -an | findstr ":5000" >nul 2>&1
if %errorlevel%==0 (
    echo [AVISO] Puerto 5000 ya está en uso
    echo ¿Continuar de todas formas? (S/N)
    set /p continuar=
    if /i not "%continuar%"=="S" exit /b 1
)

netstat -an | findstr ":3000" >nul 2>&1
if %errorlevel%==0 (
    echo [AVISO] Puerto 3000 ya está en uso
    echo ¿Continuar de todas formas? (S/N)
    set /p continuar=
    if /i not "%continuar%"=="S" exit /b 1
)

echo.
echo [INFO] Iniciando aplicacion...
echo.
echo ========================================
echo   URLS DE ACCESO:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo   API:      http://localhost:5000/api/health
echo ========================================
echo.
echo   USUARIOS DE PRUEBA:
echo   Admin:  admin / admin123
echo   Editor: editor / editor123  
echo   Asesor: asesor / asesor123
echo ========================================
echo.
echo [INFO] Presiona Ctrl+C en cualquier ventana para detener
echo [INFO] Cierra esta ventana cuando termines de usar la aplicacion
echo.

:: Crear script temporal para el backend
(
    echo @echo off
    echo title Backend - Sistema Archivistico
    echo color 0D
    echo echo [BACKEND] Iniciando servidor en puerto 5000...
    echo echo [BACKEND] Presiona Ctrl+C para detener
    echo echo.
    echo npm run server
    echo pause
) > temp_backend.bat

:: Crear script temporal para el frontend  
(
    echo @echo off
    echo title Frontend - Sistema Archivistico
    echo color 0B
    echo echo [FRONTEND] Iniciando aplicacion React en puerto 3000...
    echo echo [FRONTEND] Se abrira automaticamente en el navegador
    echo echo [FRONTEND] Presiona Ctrl+C para detener
    echo echo.
    echo cd frontend
    echo npm start
    echo pause
) > temp_frontend.bat

:: Iniciar backend
echo [INFO] Iniciando backend...
start "Backend - Sistema Archivistico" temp_backend.bat

:: Esperar un poco antes de iniciar el frontend
echo [INFO] Esperando 5 segundos antes de iniciar frontend...
timeout /t 5 /nobreak >nul

:: Iniciar frontend
echo [INFO] Iniciando frontend...
start "Frontend - Sistema Archivistico" temp_frontend.bat

echo [INFO] Aplicacion iniciada en ventanas separadas
echo.
echo [INFO] Esperando a que los servicios esten listos...
timeout /t 10 /nobreak >nul

:: Verificar que el backend responda
echo [INFO] Verificando backend...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel%==0 (
    echo [EXITO] Backend respondiendo correctamente
) else (
    echo [AVISO] Backend aun no responde, puede necesitar mas tiempo
)

echo.
echo [INFO] ¿Abrir la aplicacion en el navegador? (S/N)
set /p abrir=
if /i "%abrir%"=="S" (
    start http://localhost:3000
)

echo.
echo [INFO] Aplicacion ejecutandose...
echo [INFO] Presiona cualquier tecla para limpiar archivos temporales y salir
pause >nul

:: Limpiar archivos temporales
if exist "temp_backend.bat" del temp_backend.bat
if exist "temp_frontend.bat" del temp_frontend.bat

echo [INFO] Archivos temporales eliminados
echo [INFO] Las ventanas de backend y frontend seguiran ejecutandose
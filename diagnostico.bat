@echo off
title Sistema Archivistico - Diagnostico
color 0F

:: Cambiar al directorio donde está el archivo .bat
cd /d "%~dp0"

echo ========================================
echo   SISTEMA ARCHIVISTICO - DIAGNOSTICO
echo ========================================
echo.

echo [INFO] Verificando entorno del sistema...
echo.

:: Mostrar directorio actual
echo 1. DIRECTORIO ACTUAL:
echo    %CD%
echo.

:: Verificar archivos del proyecto
echo 2. ARCHIVOS DEL PROYECTO:
if exist "package.json" (
    echo    ✓ package.json encontrado
) else (
    echo    ✗ package.json NO encontrado
)

if exist "frontend" (
    echo    ✓ Directorio frontend encontrado
) else (
    echo    ✗ Directorio frontend NO encontrado
)

if exist "backend" (
    echo    ✓ Directorio backend encontrado
) else (
    echo    ✗ Directorio backend NO encontrado
)

if exist "database" (
    echo    ✓ Directorio database encontrado
) else (
    echo    ✗ Directorio database NO encontrado
)

if exist ".env" (
    echo    ✓ Archivo .env encontrado
) else (
    echo    ✗ Archivo .env NO encontrado
)

echo.

:: Verificar Node.js
echo 3. NODE.JS:
node --version >nul 2>&1
if %errorlevel%==0 (
    for /f "tokens=*" %%i in ('node --version') do echo    ✓ Node.js %%i instalado
) else (
    echo    ✗ Node.js NO encontrado
)

npm --version >nul 2>&1
if %errorlevel%==0 (
    for /f "tokens=*" %%i in ('npm --version') do echo    ✓ npm %%i instalado
) else (
    echo    ✗ npm NO encontrado
)

echo.

:: Verificar dependencias
echo 4. DEPENDENCIAS:
if exist "node_modules" (
    echo    ✓ node_modules del backend encontrado
) else (
    echo    ✗ node_modules del backend NO encontrado
)

if exist "frontend\node_modules" (
    echo    ✓ node_modules del frontend encontrado
) else (
    echo    ✗ node_modules del frontend NO encontrado
)

echo.

:: Verificar puertos
echo 5. PUERTOS:
netstat -an | findstr ":3000" >nul 2>&1
if %errorlevel%==0 (
    echo    ⚠ Puerto 3000 YA ESTA EN USO
) else (
    echo    ✓ Puerto 3000 disponible
)

netstat -an | findstr ":5000" >nul 2>&1
if %errorlevel%==0 (
    echo    ⚠ Puerto 5000 YA ESTA EN USO
) else (
    echo    ✓ Puerto 5000 disponible
)

echo.

:: Verificar PostgreSQL
echo 6. POSTGRESQL:
psql --version >nul 2>&1
if %errorlevel%==0 (
    for /f "tokens=*" %%i in ('psql --version') do echo    ✓ PostgreSQL CLI encontrado: %%i
) else (
    echo    ⚠ PostgreSQL CLI no encontrado en PATH
)

echo.

:: Mostrar contenido del directorio
echo 7. CONTENIDO DEL DIRECTORIO:
dir /b
echo.

echo ========================================
echo   RECOMENDACIONES
echo ========================================
echo.

if not exist "package.json" (
    echo ❌ PROBLEMA: No estás en el directorio correcto del proyecto
    echo.
    echo SOLUCION:
    echo 1. Abre el Explorador de Windows
    echo 2. Navega a la carpeta donde descargaste/clonaste el proyecto
    echo 3. Busca la carpeta que contiene package.json
    echo 4. Ejecuta este archivo desde esa carpeta
    echo.
) else (
    echo ✅ Estás en el directorio correcto del proyecto
    echo.
)

if not exist "node_modules" (
    echo ❌ PROBLEMA: Dependencias del backend no instaladas
    echo SOLUCION: Ejecutar 'npm install'
    echo.
)

if not exist "frontend\node_modules" (
    echo ❌ PROBLEMA: Dependencias del frontend no instaladas
    echo SOLUCION: Ejecutar 'cd frontend && npm install --legacy-peer-deps'
    echo.
)

if not exist ".env" (
    echo ❌ PROBLEMA: Archivo .env no encontrado
    echo SOLUCION: Copiar .env.example a .env
    echo.
)

echo ========================================
echo   COMANDOS PARA SOLUCIONAR
echo ========================================
echo.

if exist "package.json" (
    echo Si todo se ve bien, ejecuta:
    echo.
    echo   instalar-completo.bat    (para instalacion completa)
    echo   iniciar.bat              (para iniciar la aplicacion)
    echo.
) else (
    echo Primero navega al directorio correcto del proyecto
    echo donde se encuentra package.json
    echo.
)

pause
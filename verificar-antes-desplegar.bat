@echo off
chcp 65001 >nul
cls

echo.
echo ========================================
echo 🔍 VERIFICACIÓN PRE-DESPLIEGUE
echo ========================================
echo.

set ERRORES=0

REM Verificar Node.js
echo [1/8] Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    node --version
    echo ✓ Node.js instalado
) else (
    echo ❌ Node.js NO instalado
    set /a ERRORES+=1
)
echo.

REM Verificar npm
echo [2/8] Verificando npm...
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    npm --version
    echo ✓ npm instalado
) else (
    echo ❌ npm NO instalado
    set /a ERRORES+=1
)
echo.

REM Verificar Git
echo [3/8] Verificando Git...
where git >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    git --version
    echo ✓ Git instalado
) else (
    echo ❌ Git NO instalado
    set /a ERRORES+=1
)
echo.

REM Verificar archivos críticos
echo [4/8] Verificando archivos del proyecto...

if exist "backend\package.json" (
    echo ✓ backend/package.json existe
) else (
    echo ❌ backend/package.json NO existe
    set /a ERRORES+=1
)

if exist "frontend\package.json" (
    echo ✓ frontend/package.json existe
) else (
    echo ❌ frontend/package.json NO existe
    set /a ERRORES+=1
)

if exist "database\schema.sql" (
    echo ✓ database/schema.sql existe
) else (
    echo ❌ database/schema.sql NO existe
    set /a ERRORES+=1
)

if exist "backend\server.js" (
    echo ✓ backend/server.js existe
) else (
    echo ❌ backend/server.js NO existe
    set /a ERRORES+=1
)
echo.

REM Verificar dependencias del backend
echo [5/8] Verificando dependencias del backend...
if exist "backend\node_modules" (
    echo ✓ Dependencias del backend instaladas
) else (
    echo ⚠ Dependencias del backend NO instaladas
    echo   Ejecuta: cd backend ^&^& npm install
)
echo.

REM Verificar dependencias del frontend
echo [6/8] Verificando dependencias del frontend...
if exist "frontend\node_modules" (
    echo ✓ Dependencias del frontend instaladas
) else (
    echo ⚠ Dependencias del frontend NO instaladas
    echo   Ejecuta: cd frontend ^&^& npm install
)
echo.

REM Verificar archivos de entorno
echo [7/8] Verificando archivos de configuración...
if exist "backend\.env" (
    echo ✓ backend/.env existe
) else (
    echo ⚠ backend/.env NO existe (se creará en el despliegue)
)

if exist "frontend\.env" (
    echo ✓ frontend/.env existe
) else (
    echo ⚠ frontend/.env NO existe (se creará en el despliegue)
)
echo.

REM Verificar Git
echo [8/8] Verificando repositorio Git...
if exist ".git" (
    echo ✓ Repositorio Git inicializado
    git status >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Git funcionando correctamente
    )
) else (
    echo ⚠ Repositorio Git NO inicializado
    echo   Se inicializará durante el despliegue
)
echo.

REM Resumen
echo ========================================
echo 📊 RESUMEN
echo ========================================
echo.

if %ERRORES% EQU 0 (
    echo ✅ TODO LISTO PARA DESPLEGAR
    echo.
    echo Puedes ejecutar:
    echo   - desplegar-render.bat    (Recomendado)
    echo   - desplegar-railway.bat   (Alternativa)
    echo.
) else (
    echo ❌ SE ENCONTRARON %ERRORES% ERRORES
    echo.
    echo Por favor corrige los errores antes de desplegar.
    echo.
)

echo ========================================
echo.
pause

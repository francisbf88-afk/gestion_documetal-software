@echo off
echo ========================================
echo   PREPARAR PROYECTO PARA RAILWAY
echo ========================================
echo.

echo Este script preparara tu proyecto para deployment en Railway
echo dividiendo backend y frontend en repositorios separados.
echo.
pause

echo.
echo [1/6] Verificando estructura del proyecto...
if exist "backend\package.json" (
    echo ✓ Backend encontrado
) else (
    echo ❌ Backend no encontrado
    pause
    exit /b 1
)

if exist "frontend\package.json" (
    echo ✓ Frontend encontrado
) else (
    echo ❌ Frontend no encontrado
    pause
    exit /b 1
)

echo.
echo [2/6] Instalando dependencias del backend...
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
echo [3/6] Instalando dependencias del frontend...
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
echo [4/6] Creando archivos .gitignore...
if not exist "backend\.gitignore" (
    echo node_modules/> backend\.gitignore
    echo .env>> backend\.gitignore
    echo uploads/*>> backend\.gitignore
    echo ✓ .gitignore del backend creado
)

if not exist "frontend\.gitignore" (
    echo node_modules/> frontend\.gitignore
    echo build/>> frontend\.gitignore
    echo .env.local>> frontend\.gitignore
    echo ✓ .gitignore del frontend creado
)

echo.
echo [5/6] Verificando archivos de configuración...
if exist "backend\railway.json" (
    echo ✓ backend\railway.json existe
) else (
    echo ⚠️  backend\railway.json no encontrado
)

if exist "frontend\railway.json" (
    echo ✓ frontend\railway.json existe
) else (
    echo ⚠️  frontend\railway.json no encontrado
)

if exist "backend\.env.example" (
    echo ✓ backend\.env.example existe
) else (
    echo ⚠️  backend\.env.example no encontrado
)

if exist "frontend\.env.example" (
    echo ✓ frontend\.env.example existe
) else (
    echo ⚠️  frontend\.env.example no encontrado
)

echo.
echo [6/6] Generando resumen...
echo.
echo ========================================
echo        PREPARACION COMPLETADA
echo ========================================
echo.
echo ✓ Dependencias instaladas
echo ✓ Archivos de configuración verificados
echo ✓ Proyecto listo para Railway
echo.
echo PROXIMOS PASOS:
echo.
echo 1. BACKEND:
echo    cd backend
echo    git init
echo    git add .
echo    git commit -m "Initial backend commit"
echo    git remote add origin https://github.com/tu-usuario/sgd-backend.git
echo    git push -u origin main
echo.
echo 2. FRONTEND:
echo    cd frontend
echo    git init
echo    git add .
echo    git commit -m "Initial frontend commit"
echo    git remote add origin https://github.com/tu-usuario/sgd-frontend.git
echo    git push -u origin main
echo.
echo 3. Sigue la guia en GUIA_DEPLOYMENT_RAILWAY.md
echo.
echo ========================================
pause
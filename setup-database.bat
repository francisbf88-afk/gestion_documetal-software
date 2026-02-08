@echo off
echo ========================================
echo    CONFIGURACION DE BASE DE DATOS
echo ========================================
echo.

echo Este script creara la base de datos y ejecutara las migraciones.
echo.
echo Asegurate de tener PostgreSQL instalado y ejecutandose.
echo.
pause

echo.
echo [1/3] Verificando PostgreSQL...
psql --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ PostgreSQL no encontrado
    echo Instala PostgreSQL desde: https://www.postgresql.org/download/
    pause
    exit /b 1
)
echo ✓ PostgreSQL encontrado

echo.
echo [2/3] Creando base de datos 'sgd'...
echo.
echo Ingresa la contraseña de PostgreSQL cuando se solicite.
echo.

psql -U postgres -c "CREATE DATABASE sgd;" 2>nul
if %errorLevel% == 0 (
    echo ✓ Base de datos 'sgd' creada
) else (
    echo ⚠️  La base de datos 'sgd' ya existe o hubo un error
    echo Continuando con las migraciones...
)

echo.
echo [3/3] Ejecutando migraciones...
echo.

if exist "database\schema.sql" (
    echo Ejecutando schema.sql...
    psql -U postgres -d sgd -f database\schema.sql
    if %errorLevel% == 0 (
        echo ✓ Schema principal ejecutado
    ) else (
        echo ❌ Error ejecutando schema.sql
    )
) else (
    echo ❌ database\schema.sql no encontrado
)

echo.
if exist "database\notifications-schema.sql" (
    echo Ejecutando notifications-schema.sql...
    psql -U postgres -d sgd -f database\notifications-schema.sql
    if %errorLevel% == 0 (
        echo ✓ Schema de notificaciones ejecutado
    ) else (
        echo ⚠️  Error o ya existe
    )
)

echo.
echo ========================================
echo     BASE DE DATOS CONFIGURADA
echo ========================================
echo.
echo ✓ Base de datos: sgd
echo ✓ Tablas creadas
echo.
echo PROXIMO PASO:
echo   Ejecutar: iniciar-local.bat
echo.
pause
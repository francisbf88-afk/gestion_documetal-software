@echo off
title Sistema Archivistico - Gestor de Servicio
color 0B

:: Verificar si se ejecuta como administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ========================================
    echo   PERMISOS DE ADMINISTRADOR REQUERIDOS
    echo ========================================
    echo.
    echo Este script necesita ejecutarse como administrador
    echo para poder instalar/desinstalar servicios de Windows.
    echo.
    echo Haz clic derecho en el archivo y selecciona:
    echo "Ejecutar como administrador"
    echo.
    pause
    exit /b 1
)

:menu
cls
echo ========================================
echo   SISTEMA ARCHIVISTICO - SERVICIO
echo ========================================
echo.
echo Selecciona una opcion:
echo.
echo 1. Instalar servicio (PM2)
echo 2. Desinstalar servicio
echo 3. Iniciar servicio
echo 4. Detener servicio
echo 5. Ver estado del servicio
echo 6. Ver logs del servicio
echo 7. Instalar como Servicio de Windows (NSSM)
echo 8. Salir
echo.
set /p opcion="Ingresa tu opcion (1-8): "

if "%opcion%"=="1" goto instalar_pm2
if "%opcion%"=="2" goto desinstalar
if "%opcion%"=="3" goto iniciar
if "%opcion%"=="4" goto detener
if "%opcion%"=="5" goto estado
if "%opcion%"=="6" goto logs
if "%opcion%"=="7" goto instalar_nssm
if "%opcion%"=="8" goto salir
goto menu

:instalar_pm2
echo.
echo [INFO] Instalando PM2 y configurando servicio...
echo.

:: Verificar si PM2 está instalado
pm2 --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Instalando PM2 globalmente...
    call npm install -g pm2
    if %errorlevel% neq 0 (
        echo [ERROR] Error al instalar PM2
        pause
        goto menu
    )
)

:: Crear archivo de configuración PM2
echo [INFO] Creando configuracion PM2...
(
echo module.exports = {
echo   apps: [
echo     {
echo       name: 'sistema-archivistico-backend',
echo       script: 'backend/server.js',
echo       instances: 1,
echo       exec_mode: 'fork',
echo       watch: false,
echo       env: {
echo         NODE_ENV: 'production',
echo         PORT: 5000
echo       },
echo       error_file: './logs/backend-error.log',
echo       out_file: './logs/backend-out.log',
echo       log_file: './logs/backend-combined.log'
echo     },
echo     {
echo       name: 'sistema-archivistico-frontend',
echo       script: 'serve',
echo       args: '-s frontend/build -l 3000',
echo       instances: 1,
echo       exec_mode: 'fork',
echo       watch: false,
echo       env: {
echo         NODE_ENV: 'production'
echo       },
echo       error_file: './logs/frontend-error.log',
echo       out_file: './logs/frontend-out.log',
echo       log_file: './logs/frontend-combined.log'
echo     }
echo   ]
echo };
) > ecosystem.config.js

:: Crear directorio de logs
if not exist "logs" mkdir logs

:: Instalar serve para el frontend
echo [INFO] Instalando serve para el frontend...
call npm install -g serve

:: Construir frontend si no existe
if not exist "frontend\build" (
    echo [INFO] Construyendo frontend para produccion...
    cd frontend
    call npm run build
    if %errorlevel% neq 0 (
        echo [ERROR] Error al construir frontend
        cd ..
        pause
        goto menu
    )
    cd ..
)

:: Iniciar aplicaciones con PM2
echo [INFO] Iniciando aplicaciones con PM2...
call pm2 start ecosystem.config.js
call pm2 save
call pm2 startup

echo.
echo [EXITO] Servicio instalado correctamente con PM2
echo.
echo Comandos utiles:
echo - pm2 list          : Ver aplicaciones
echo - pm2 logs          : Ver logs
echo - pm2 restart all   : Reiniciar todo
echo - pm2 stop all      : Detener todo
echo.
pause
goto menu

:desinstalar
echo.
echo [INFO] Desinstalando servicio...
call pm2 delete all
call pm2 unstartup
echo [INFO] Servicio desinstalado
pause
goto menu

:iniciar
echo.
echo [INFO] Iniciando servicio...
call pm2 start ecosystem.config.js
echo [INFO] Servicio iniciado
pause
goto menu

:detener
echo.
echo [INFO] Deteniendo servicio...
call pm2 stop all
echo [INFO] Servicio detenido
pause
goto menu

:estado
echo.
echo [INFO] Estado del servicio:
call pm2 list
echo.
pause
goto menu

:logs
echo.
echo [INFO] Logs del servicio (presiona Ctrl+C para salir):
call pm2 logs
pause
goto menu

:instalar_nssm
echo.
echo ========================================
echo   INSTALACION CON NSSM (Recomendado)
echo ========================================
echo.
echo NSSM (Non-Sucking Service Manager) es la mejor opcion
echo para crear servicios de Windows estables.
echo.
echo Pasos para instalar:
echo.
echo 1. Descarga NSSM desde: https://nssm.cc/download
echo 2. Extrae nssm.exe a una carpeta (ej: C:\nssm\)
echo 3. Abre CMD como administrador
echo 4. Ejecuta los siguientes comandos:
echo.
echo    cd /d "%~dp0"
echo    C:\nssm\nssm.exe install SistemaArchivistico
echo.
echo 5. En la ventana que se abre:
echo    - Application: %~dp0iniciar.bat
echo    - Startup directory: %~dp0
echo    - Service name: SistemaArchivistico
echo.
echo 6. Ve a la pestaña "Details":
echo    - Display name: Sistema Archivistico
echo    - Description: Sistema de gestion documental
echo.
echo 7. Haz clic en "Install service"
echo.
echo 8. Para iniciar: net start SistemaArchivistico
echo    Para detener: net stop SistemaArchivistico
echo.
echo Ventajas de NSSM:
echo - Reinicio automatico si falla
echo - Logs automaticos
echo - Mejor integracion con Windows
echo - Facil de configurar
echo.
pause
goto menu

:salir
echo.
echo [INFO] Saliendo...
exit /b 0
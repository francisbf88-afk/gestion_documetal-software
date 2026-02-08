@echo off
title Sistema Archivistico - Gestor Rapido
color 0C

:menu
cls
echo ========================================
echo   SISTEMA ARCHIVISTICO - GESTION
echo ========================================
echo.
echo Estado actual del servicio:
sc query "SistemaArchivistico" >nul 2>&1
if %errorlevel%==0 (
    echo [INFO] Servicio instalado
    for /f "tokens=4" %%i in ('sc query "SistemaArchivistico" ^| find "STATE"') do set estado=%%i
    echo [INFO] Estado: !estado!
) else (
    echo [AVISO] Servicio no instalado
)
echo.
echo Opciones disponibles:
echo.
echo 1. Iniciar servicio
echo 2. Detener servicio
echo 3. Reiniciar servicio
echo 4. Ver logs
echo 5. Abrir aplicacion en navegador
echo 6. Ver estado detallado
echo 7. Configurar inicio automatico
echo 8. Salir
echo.
set /p opcion="Selecciona una opcion (1-8): "

if "%opcion%"=="1" goto iniciar
if "%opcion%"=="2" goto detener
if "%opcion%"=="3" goto reiniciar
if "%opcion%"=="4" goto logs
if "%opcion%"=="5" goto abrir_navegador
if "%opcion%"=="6" goto estado_detallado
if "%opcion%"=="7" goto inicio_automatico
if "%opcion%"=="8" goto salir
goto menu

:iniciar
echo.
echo [INFO] Iniciando servicio...
net start SistemaArchivistico
if %errorlevel%==0 (
    echo [EXITO] Servicio iniciado correctamente
    timeout /t 5 /nobreak >nul
    echo [INFO] Verificando que la aplicacion responda...
    curl -s http://localhost:5000/api/health >nul 2>&1
    if %errorlevel%==0 (
        echo [EXITO] Backend respondiendo correctamente
    ) else (
        echo [AVISO] Backend aun no responde, puede necesitar mas tiempo
    )
) else (
    echo [ERROR] Error al iniciar servicio
)
pause
goto menu

:detener
echo.
echo [INFO] Deteniendo servicio...
net stop SistemaArchivistico
if %errorlevel%==0 (
    echo [EXITO] Servicio detenido correctamente
) else (
    echo [ERROR] Error al detener servicio
)
pause
goto menu

:reiniciar
echo.
echo [INFO] Reiniciando servicio...
net stop SistemaArchivistico
timeout /t 2 /nobreak >nul
net start SistemaArchivistico
if %errorlevel%==0 (
    echo [EXITO] Servicio reiniciado correctamente
) else (
    echo [ERROR] Error al reiniciar servicio
)
pause
goto menu

:logs
echo.
echo [INFO] Abriendo logs del sistema...
if exist "logs" (
    start notepad logs\backend-combined.log
    start notepad logs\frontend-combined.log
) else (
    echo [AVISO] No se encontraron archivos de log
    echo Verifica que el servicio este configurado correctamente
)
pause
goto menu

:abrir_navegador
echo.
echo [INFO] Abriendo aplicacion en el navegador...
start http://localhost:3000
echo [INFO] Si la pagina no carga, verifica que el servicio este iniciado
pause
goto menu

:estado_detallado
echo.
echo [INFO] Estado detallado del servicio:
echo.
sc query SistemaArchivistico
echo.
echo [INFO] Procesos relacionados:
tasklist | findstr /i "node.exe"
echo.
echo [INFO] Puertos en uso:
netstat -an | findstr ":3000\|:5000"
echo.
pause
goto menu

:inicio_automatico
echo.
echo [INFO] Configurando inicio automatico...
sc config SistemaArchivistico start= auto
if %errorlevel%==0 (
    echo [EXITO] Servicio configurado para inicio automatico
    echo El servicio se iniciara automaticamente con Windows
) else (
    echo [ERROR] Error al configurar inicio automatico
    echo Verifica que tengas permisos de administrador
)
pause
goto menu

:salir
echo.
echo [INFO] Saliendo del gestor...
exit /b 0
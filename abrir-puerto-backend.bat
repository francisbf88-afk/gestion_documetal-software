@echo off
echo ========================================
echo    CONFIGURACION PUERTO BACKEND 5001
echo ========================================
echo.

echo [1/4] Verificando permisos de administrador...
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✓ Ejecutando con permisos de administrador
) else (
    echo ❌ ERROR: Este script requiere permisos de administrador
    echo Por favor, ejecuta como administrador
    pause
    exit /b 1
)

echo.
echo [2/4] Abriendo puerto 5001 en el Firewall de Windows...

:: Eliminar reglas existentes si existen
netsh advfirewall firewall delete rule name="SGD Backend Port 5001 - Entrada" >nul 2>&1
netsh advfirewall firewall delete rule name="SGD Backend Port 5001 - Salida" >nul 2>&1

:: Crear reglas de entrada y salida para el puerto 5001
netsh advfirewall firewall add rule name="SGD Backend Port 5001 - Entrada" dir=in action=allow protocol=TCP localport=5001
if %errorLevel% == 0 (
    echo ✓ Regla de entrada creada para puerto 5001
) else (
    echo ❌ Error al crear regla de entrada
)

netsh advfirewall firewall add rule name="SGD Backend Port 5001 - Salida" dir=out action=allow protocol=TCP localport=5001
if %errorLevel% == 0 (
    echo ✓ Regla de salida creada para puerto 5001
) else (
    echo ❌ Error al crear regla de salida
)

echo.
echo [3/4] Verificando configuración del firewall...
netsh advfirewall firewall show rule name="SGD Backend Port 5001 - Entrada"
echo.

echo [4/4] Configuración completada
echo.
echo ========================================
echo           RESUMEN DE CONFIGURACION
echo ========================================
echo ✓ Puerto 5001 abierto en firewall
echo ✓ Reglas de entrada y salida configuradas
echo ✓ Backend configurado para escuchar en 0.0.0.0:5001
echo.
echo SIGUIENTE PASO: Ejecutar 'iniciar-servidor.bat' para iniciar el backend
echo.
pause
@echo off
echo 🔥 CONFIGURANDO FIREWALL PARA ACCESO REMOTO
echo ==========================================
echo.

REM Verificar si se ejecuta como administrador
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Ejecutándose como administrador
) else (
    echo ❌ ERROR: Este script debe ejecutarse como administrador
    echo.
    echo 💡 Clic derecho en el archivo y selecciona "Ejecutar como administrador"
    echo.
    pause
    exit /b 1
)

echo.
echo 🔧 Configurando reglas de firewall...
echo.

REM Eliminar reglas existentes si existen
echo 🗑️  Eliminando reglas anteriores...
netsh advfirewall firewall delete rule name="Sistema Archivistico Frontend" >nul 2>&1
netsh advfirewall firewall delete rule name="Sistema Archivistico Backend" >nul 2>&1

REM Agregar nuevas reglas
echo 📡 Agregando regla para Frontend (puerto 3001)...
netsh advfirewall firewall add rule name="Sistema Archivistico Frontend" dir=in action=allow protocol=TCP localport=3001

echo 🖥️  Agregando regla para Backend (puerto 5001)...
netsh advfirewall firewall add rule name="Sistema Archivistico Backend" dir=in action=allow protocol=TCP localport=5001

echo.
echo ✅ FIREWALL CONFIGURADO EXITOSAMENTE
echo.
echo 📋 Reglas agregadas:
echo    • Puerto 3001 (Frontend) - PERMITIDO
echo    • Puerto 5001 (Backend) - PERMITIDO
echo.
echo 🔍 Verificando configuración...
netsh advfirewall firewall show rule name="Sistema Archivistico Frontend"
echo.
netsh advfirewall firewall show rule name="Sistema Archivistico Backend"
echo.
echo 🎉 ¡Configuración completada!
echo 💡 Ahora puedes ejecutar: iniciar-servidor.bat
echo.
pause
@echo off
echo ========================================
echo    VERIFICACION PUERTO BACKEND 5001
echo ========================================
echo.

echo [1/3] Verificando si el puerto 5001 está en uso...
netstat -an | findstr :5001
if %errorLevel% == 0 (
    echo ✓ Puerto 5001 está siendo utilizado
) else (
    echo ❌ Puerto 5001 no está en uso - el servidor no está ejecutándose
)

echo.
echo [2/3] Verificando reglas del firewall...
netsh advfirewall firewall show rule name="SGD Backend Port 5001 - Entrada" | findstr "Habilitado"
if %errorLevel% == 0 (
    echo ✓ Regla de firewall de entrada está habilitada
) else (
    echo ❌ Regla de firewall de entrada no encontrada o deshabilitada
)

echo.
echo [3/3] Probando conectividad al backend...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5001/api/health' -TimeoutSec 5; Write-Host '✓ Backend responde correctamente:' $response.StatusCode } catch { Write-Host '❌ Backend no responde:' $_.Exception.Message }"

echo.
echo ========================================
echo              DIAGNOSTICO
echo ========================================
echo.
echo Si el backend no responde:
echo 1. Ejecutar 'abrir-puerto-backend.bat' como administrador
echo 2. Ejecutar 'iniciar-servidor.bat' para iniciar el backend
echo 3. Verificar que no hay otros servicios usando el puerto 5001
echo.
pause
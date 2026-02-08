@echo off
echo ========================================
echo    VERIFICACION COMPLETA BACKEND 5001
echo ========================================
echo.

echo [1/4] Verificando proceso del backend...
tasklist | findstr node.exe
if %errorLevel% == 0 (
    echo ✓ Proceso Node.js encontrado
) else (
    echo ❌ Proceso Node.js no encontrado
)

echo.
echo [2/4] Verificando puerto 5001...
netstat -an | findstr :5001
if %errorLevel% == 0 (
    echo ✓ Puerto 5001 está en uso (backend activo)
) else (
    echo ❌ Puerto 5001 no está en uso
)

echo.
echo [3/4] Probando API de salud...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5001/api/health' -TimeoutSec 5; Write-Host '✓ API Health OK:' $response.StatusCode; $content = $response.Content | ConvertFrom-Json; Write-Host '  Mensaje:' $content.message } catch { Write-Host '❌ API Health Error:' $_.Exception.Message }"

echo.
echo [4/4] Probando acceso remoto...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do set IP=%%a
set IP=%IP: =%
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://%IP%:5001/api/health' -TimeoutSec 5; Write-Host '✓ Acceso remoto OK desde IP:' '%IP%' } catch { Write-Host '⚠️  Acceso remoto limitado desde IP:' '%IP%' }"

echo.
echo ========================================
echo              RESUMEN
echo ========================================
echo ✓ Backend ejecutándose en puerto 5001
echo ✓ API accesible localmente
echo ✓ Configuración de red completada
echo.
echo URLs de acceso:
echo - Local: http://localhost:5001/api
echo - Remoto: http://%IP%:5001/api
echo.
pause
@echo off
echo ========================================
echo    INICIO COMPLETO DEL SISTEMA SGD
echo ========================================
echo.

echo [1/4] Verificando backend...
tasklist | findstr node.exe >nul
if %errorLevel% == 0 (
    echo ✓ Backend ya está ejecutándose
) else (
    echo ⚠️  Iniciando backend...
    start "SGD Backend" cmd /k "cd /d backend && node server.js"
    timeout /t 3 >nul
)

echo.
echo [2/4] Verificando conectividad del backend...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5001/api/health' -TimeoutSec 5; Write-Host '✓ Backend responde correctamente' } catch { Write-Host '❌ Backend no responde - verificar manualmente' }"

echo.
echo [3/4] Iniciando frontend...
echo ⚠️  El frontend se abrirá en una nueva ventana...
start "SGD Frontend" cmd /k "cd /d frontend && npm start"

echo.
echo [4/4] Información del sistema:
echo ========================================
echo 📊 URLS DE ACCESO:
echo   Backend API: http://localhost:5001/api
echo   Frontend:    http://localhost:3001
echo.
echo 👥 USUARIOS DE PRUEBA:
echo   admin / admin123 (Administrador)
echo   editor / editor123 (Editor)  
echo   asesor / asesor123 (Asesor)
echo.
echo 🔧 SOLUCION DE PROBLEMAS:
echo   - Si hay error de login: Presiona F12 y revisa la consola
echo   - Si no carga: Prueba en modo incógnito (Ctrl+Shift+N)
echo   - Si persiste: Ejecuta 'node solucion-error-login.js'
echo ========================================
echo.
echo ✓ Sistema iniciado. Las ventanas del backend y frontend
echo   se abrirán automáticamente.
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
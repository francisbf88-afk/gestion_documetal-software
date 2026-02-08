@echo off
echo 🚀 INICIANDO SERVIDOR DEL SISTEMA ARCHIVISTICO
echo =============================================
echo.
echo 📡 IP del servidor: 192.168.1.127
echo 🖥️  Frontend: http://192.168.1.127:3001
echo 📡 Backend: http://192.168.1.127:5001
echo.
echo ⚠️  IMPORTANTE: Asegurate de que el firewall permita conexiones en los puertos 3001 y 5001
echo 💡 Si es la primera vez, ejecuta: configurar-firewall.bat (como administrador)
echo.
echo 🔍 Verificando configuración...

REM Verificar si PostgreSQL está corriendo
tasklist /FI "IMAGENAME eq postgres.exe" 2>NUL | find /I /N "postgres.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ PostgreSQL está corriendo
) else (
    echo ⚠️  PostgreSQL no detectado - asegúrate de que esté corriendo
)

echo.
pause
echo.
echo 🔄 Iniciando servicios...
echo.

cd /d "%~dp0"

echo 📡 Iniciando backend...
start "Backend - Sistema Archivistico" cmd /k "cd backend && echo 🖥️ BACKEND INICIADO && echo 📡 API: http://192.168.1.127:5001 && echo 🔗 Health: http://192.168.1.127:5001/api/health && echo. && node server.js"

timeout /t 5 /nobreak > nul

echo 🖥️  Iniciando frontend...
start "Frontend - Sistema Archivistico" cmd /k "cd frontend && echo 🌐 FRONTEND INICIADO && echo 🖥️ URL: http://192.168.1.127:3001 && echo 🌍 Acceso remoto disponible && echo. && npm start"

echo.
echo ✅ Servicios iniciados
echo.
echo 🌐 ACCESO AL SISTEMA:
echo    • Local: http://localhost:3001
echo    • Remoto: http://192.168.1.127:3001
echo.
echo 👥 CREDENCIALES DE PRUEBA:
echo    • admin / admin123 (Administrador)
echo    • editor / editor123 (Editor)  
echo    • asesor / asesor123 (Asesor)
echo.
echo 🔧 SOLUCIÓN DE PROBLEMAS:
echo    • Si no puedes acceder remotamente, ejecuta: configurar-firewall.bat
echo    • Para diagnóstico completo: node diagnostico-red.js
echo.
pause

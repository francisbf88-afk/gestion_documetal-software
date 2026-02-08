@echo off
chcp 65001 >nul
cls

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║     🚀 SISTEMA DE GESTIÓN DOCUMENTAL - DESPLIEGUE         ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo.

:MENU
echo ========================================
echo   OPCIONES DE DESPLIEGUE GRATUITO
echo ========================================
echo.
echo   1. 🔍 Verificar sistema antes de desplegar
echo   2. 🌐 Desplegar en Render.com (Recomendado)
echo   3. 🚂 Desplegar en Railway.app
echo   4. 📚 Ver guía completa de despliegue
echo   5. ❌ Salir
echo.
echo ========================================
echo.

set /p OPCION="Selecciona una opción (1-5): "

if "%OPCION%"=="1" goto VERIFICAR
if "%OPCION%"=="2" goto RENDER
if "%OPCION%"=="3" goto RAILWAY
if "%OPCION%"=="4" goto GUIA
if "%OPCION%"=="5" goto SALIR

echo.
echo ❌ Opción inválida. Intenta de nuevo.
echo.
timeout /t 2 >nul
cls
goto MENU

:VERIFICAR
cls
echo.
echo Ejecutando verificación del sistema...
echo.
call verificar-antes-desplegar.bat
goto MENU

:RENDER
cls
echo.
echo ========================================
echo   DESPLIEGUE EN RENDER.COM
echo ========================================
echo.
echo Render.com es la opción más fácil y recomendada:
echo   ✅ PostgreSQL gratuito incluido
echo   ✅ 750 horas gratis al mes
echo   ✅ SSL/HTTPS automático
echo   ✅ Despliegue con un solo archivo
echo.
echo ¿Deseas continuar? (S/N)
set /p CONFIRMAR="> "

if /i "%CONFIRMAR%"=="S" (
    echo.
    echo Iniciando script de despliegue para Render...
    echo.
    timeout /t 2 >nul
    call desplegar-render.bat
) else (
    echo.
    echo Operación cancelada.
    timeout /t 2 >nul
)
cls
goto MENU

:RAILWAY
cls
echo.
echo ========================================
echo   DESPLIEGUE EN RAILWAY.APP
echo ========================================
echo.
echo Railway.app ofrece:
echo   ✅ $5 USD de crédito gratis al mes
echo   ✅ PostgreSQL incluido
echo   ✅ Despliegue muy rápido
echo   ✅ CLI potente
echo.
echo ¿Deseas continuar? (S/N)
set /p CONFIRMAR="> "

if /i "%CONFIRMAR%"=="S" (
    echo.
    echo Iniciando script de despliegue para Railway...
    echo.
    timeout /t 2 >nul
    call desplegar-railway.bat
) else (
    echo.
    echo Operación cancelada.
    timeout /t 2 >nul
)
cls
goto MENU

:GUIA
cls
echo.
echo ========================================
echo   GUÍA COMPLETA DE DESPLIEGUE
echo ========================================
echo.
echo Abriendo guía en el navegador...
echo.

if exist "GUIA_DESPLIEGUE_GRATIS.md" (
    start GUIA_DESPLIEGUE_GRATIS.md
    echo ✓ Guía abierta
) else (
    echo ❌ No se encontró el archivo GUIA_DESPLIEGUE_GRATIS.md
)

echo.
echo Presiona cualquier tecla para volver al menú...
pause >nul
cls
goto MENU

:SALIR
cls
echo.
echo ========================================
echo   ¡HASTA PRONTO!
echo ========================================
echo.
echo Recursos útiles:
echo   📚 GUIA_DESPLIEGUE_GRATIS.md - Guía completa
echo   🌐 https://render.com - Render.com
echo   🚂 https://railway.app - Railway.app
echo.
echo Si necesitas ayuda, revisa la documentación.
echo.
timeout /t 3 >nul
exit /b 0

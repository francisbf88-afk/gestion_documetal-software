const fs = require('fs');
const path = require('path');
const os = require('os');

// Función para obtener la IP local de la máquina
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            // Buscar IPv4 no loopback
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return 'localhost';
}

async function configurarAccesoRemoto() {
    try {
        console.log('🌐 CONFIGURANDO ACCESO REMOTO AL SISTEMA');
        console.log('==========================================\n');

        const localIP = getLocalIP();
        console.log(`🔍 IP local detectada: ${localIP}`);

        // 1. Configurar backend para aceptar conexiones externas
        console.log('\n1. 📡 CONFIGURANDO BACKEND...');
        
        const backendEnvPath = path.join(__dirname, 'backend', '.env');
        let backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
        
        // Agregar configuración de host
        if (!backendEnv.includes('HOST=')) {
            backendEnv += '\n# Network configuration\nHOST=0.0.0.0\n';
        } else {
            backendEnv = backendEnv.replace(/HOST=.*/g, 'HOST=0.0.0.0');
        }
        
        fs.writeFileSync(backendEnvPath, backendEnv);
        console.log('   ✅ Backend configurado para aceptar conexiones externas');

        // 2. Configurar frontend para usar IP del servidor
        console.log('\n2. 🖥️  CONFIGURANDO FRONTEND...');
        
        const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
        let frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
        
        // Actualizar URL de la API
        frontendEnv = frontendEnv.replace(/REACT_APP_API_URL=.*/g, `REACT_APP_API_URL=http://${localIP}:5001`);
        
        // Agregar configuración de host para desarrollo
        if (!frontendEnv.includes('HOST=')) {
            frontendEnv += `HOST=0.0.0.0\n`;
        } else {
            frontendEnv = frontendEnv.replace(/HOST=.*/g, 'HOST=0.0.0.0');
        }
        
        fs.writeFileSync(frontendEnvPath, frontendEnv);
        console.log('   ✅ Frontend configurado para acceso remoto');

        // 3. Crear script de inicio para servidor
        console.log('\n3. 📜 CREANDO SCRIPTS DE INICIO...');
        
        const startServerScript = `@echo off
echo 🚀 INICIANDO SERVIDOR DEL SISTEMA ARCHIVISTICO
echo =============================================
echo.
echo 📡 IP del servidor: ${localIP}
echo 🖥️  Frontend: http://${localIP}:3001
echo 📡 Backend: http://${localIP}:5001
echo.
echo ⚠️  IMPORTANTE: Asegurate de que el firewall permita conexiones en los puertos 3001 y 5001
echo.
pause
echo.
echo 🔄 Iniciando servicios...
echo.

cd /d "%~dp0"

echo 📡 Iniciando backend...
start "Backend - Sistema Archivistico" cmd /k "cd backend && node server.js"

timeout /t 3 /nobreak > nul

echo 🖥️  Iniciando frontend...
start "Frontend - Sistema Archivistico" cmd /k "cd frontend && npm start"

echo.
echo ✅ Servicios iniciados
echo 🌐 Accede desde cualquier máquina en: http://${localIP}:3001
echo.
pause
`;

        fs.writeFileSync(path.join(__dirname, 'iniciar-servidor.bat'), startServerScript);
        console.log('   ✅ Script de inicio creado: iniciar-servidor.bat');

        // 4. Crear archivo de configuración de red
        const networkConfig = {
            serverIP: localIP,
            frontendPort: 3001,
            backendPort: 5001,
            frontendURL: `http://${localIP}:3001`,
            backendURL: `http://${localIP}:5001`,
            accessInstructions: {
                local: `Acceso local: http://localhost:3001`,
                remote: `Acceso remoto: http://${localIP}:3001`,
                requirements: [
                    "El servidor debe estar ejecutándose",
                    "Los puertos 3001 y 5001 deben estar abiertos en el firewall",
                    "Las máquinas cliente deben estar en la misma red",
                    "PostgreSQL debe estar configurado para aceptar conexiones"
                ]
            }
        };

        fs.writeFileSync(
            path.join(__dirname, 'configuracion-red.json'), 
            JSON.stringify(networkConfig, null, 2)
        );
        console.log('   ✅ Archivo de configuración de red creado');

        // 5. Crear instrucciones de firewall
        const firewallInstructions = `# CONFIGURACIÓN DE FIREWALL PARA ACCESO REMOTO

## Windows Firewall

### Abrir puertos manualmente:
1. Abrir "Windows Defender Firewall con seguridad avanzada"
2. Clic en "Reglas de entrada" → "Nueva regla"
3. Seleccionar "Puerto" → Siguiente
4. TCP → Puertos específicos locales: 3001,5001
5. Permitir la conexión → Siguiente
6. Aplicar a todos los perfiles → Siguiente
7. Nombre: "Sistema Archivístico" → Finalizar

### Comandos automáticos (ejecutar como administrador):
\`\`\`cmd
netsh advfirewall firewall add rule name="Sistema Archivistico Frontend" dir=in action=allow protocol=TCP localport=3001
netsh advfirewall firewall add rule name="Sistema Archivistico Backend" dir=in action=allow protocol=TCP localport=5001
\`\`\`

## Verificar conectividad:
- Desde otra máquina: ping ${localIP}
- Probar acceso: http://${localIP}:3001

## Solución de problemas:
1. Verificar que el servidor esté ejecutándose
2. Comprobar que los puertos estén abiertos: netstat -an | findstr ":3001\\|:5001"
3. Verificar firewall: netsh advfirewall firewall show rule name="Sistema Archivistico Frontend"
4. Probar desde localhost primero: http://localhost:3001
`;

        fs.writeFileSync(path.join(__dirname, 'INSTRUCCIONES_FIREWALL.md'), firewallInstructions);
        console.log('   ✅ Instrucciones de firewall creadas');

        // 6. Mostrar resumen
        console.log('\n📋 RESUMEN DE CONFIGURACIÓN');
        console.log('============================');
        console.log(`🖥️  IP del servidor: ${localIP}`);
        console.log(`🌐 URL de acceso remoto: http://${localIP}:3001`);
        console.log(`📡 API del backend: http://${localIP}:5001`);
        console.log('');
        console.log('📁 ARCHIVOS CREADOS:');
        console.log('   • iniciar-servidor.bat - Script para iniciar el sistema');
        console.log('   • configuracion-red.json - Configuración de red');
        console.log('   • INSTRUCCIONES_FIREWALL.md - Guía de configuración');
        console.log('');
        console.log('🔧 PRÓXIMOS PASOS:');
        console.log('1. Configurar firewall (ver INSTRUCCIONES_FIREWALL.md)');
        console.log('2. Ejecutar: iniciar-servidor.bat');
        console.log('3. Acceder desde cualquier máquina: http://' + localIP + ':3001');
        console.log('');
        console.log('⚠️  IMPORTANTE:');
        console.log('   • Asegúrate de que PostgreSQL esté corriendo');
        console.log('   • Configura el firewall para permitir los puertos 3001 y 5001');
        console.log('   • Las máquinas cliente deben estar en la misma red');

    } catch (error) {
        console.error('❌ Error configurando acceso remoto:', error.message);
    }
}

// Ejecutar configuración
configurarAccesoRemoto();
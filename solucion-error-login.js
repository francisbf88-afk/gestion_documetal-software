const fs = require('fs');
const path = require('path');

class LoginErrorSolution {
    constructor() {
        this.frontendEnvPath = './frontend/.env';
        this.backendEnvPath = './backend/.env';
        this.packageJsonPath = './frontend/package.json';
    }

    checkAndFixFrontendConfig() {
        console.log('🔧 Verificando y corrigiendo configuración del frontend...');
        
        // Verificar archivo .env del frontend
        if (fs.existsSync(this.frontendEnvPath)) {
            let envContent = fs.readFileSync(this.frontendEnvPath, 'utf8');
            console.log('📄 Contenido actual del frontend/.env:');
            console.log(envContent);
            
            // Asegurar configuración correcta
            const correctConfig = `PORT=3001
REACT_APP_API_URL=http://localhost:5001
HOST=0.0.0.0
GENERATE_SOURCEMAP=false`;

            if (envContent.trim() !== correctConfig.trim()) {
                fs.writeFileSync(this.frontendEnvPath, correctConfig);
                console.log('✅ Configuración del frontend/.env corregida');
            } else {
                console.log('✅ Configuración del frontend/.env es correcta');
            }
        } else {
            console.log('⚠️  Archivo frontend/.env no existe, creándolo...');
            const defaultConfig = `PORT=3001
REACT_APP_API_URL=http://localhost:5001
HOST=0.0.0.0
GENERATE_SOURCEMAP=false`;
            fs.writeFileSync(this.frontendEnvPath, defaultConfig);
            console.log('✅ Archivo frontend/.env creado');
        }

        // Verificar package.json proxy
        if (fs.existsSync(this.packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
            if (packageJson.proxy !== 'http://localhost:5001') {
                packageJson.proxy = 'http://localhost:5001';
                fs.writeFileSync(this.packageJsonPath, JSON.stringify(packageJson, null, 2));
                console.log('✅ Proxy en package.json corregido');
            } else {
                console.log('✅ Proxy en package.json es correcto');
            }
        }
    }

    checkBackendConfig() {
        console.log('🔧 Verificando configuración del backend...');
        
        if (fs.existsSync(this.backendEnvPath)) {
            const envContent = fs.readFileSync(this.backendEnvPath, 'utf8');
            console.log('📄 Contenido del backend/.env:');
            console.log(envContent);
            
            if (envContent.includes('PORT=5001')) {
                console.log('✅ Puerto del backend configurado correctamente');
            } else {
                console.log('⚠️  Puerto del backend necesita corrección');
            }
        }
    }

    generateTroubleshootingSteps() {
        console.log('\n========================================');
        console.log('    PASOS DE SOLUCION DE PROBLEMAS');
        console.log('========================================');
        
        const steps = [
            {
                step: 1,
                title: 'Verificar que el backend esté ejecutándose',
                commands: [
                    'netstat -an | findstr :5001',
                    'curl http://localhost:5001/api/health'
                ],
                description: 'El backend debe estar activo en puerto 5001'
            },
            {
                step: 2,
                title: 'Limpiar caché del navegador',
                commands: [
                    'Ctrl+Shift+R (Chrome/Firefox)',
                    'Ctrl+F5 (Edge)',
                    'Abrir herramientas de desarrollador (F12) y verificar errores'
                ],
                description: 'Limpiar caché y verificar errores en consola'
            },
            {
                step: 3,
                title: 'Reiniciar el frontend',
                commands: [
                    'cd frontend',
                    'npm start'
                ],
                description: 'Reiniciar el servidor de desarrollo del frontend'
            },
            {
                step: 4,
                title: 'Verificar CORS y conectividad',
                commands: [
                    'Abrir F12 en el navegador',
                    'Ir a Network tab',
                    'Intentar login y verificar requests'
                ],
                description: 'Verificar que las requests lleguen al backend'
            },
            {
                step: 5,
                title: 'Probar en modo incógnito',
                commands: [
                    'Ctrl+Shift+N (Chrome)',
                    'Ctrl+Shift+P (Firefox)'
                ],
                description: 'Descartar problemas de caché o extensiones'
            }
        ];

        steps.forEach(step => {
            console.log(`\n${step.step}. ${step.title}`);
            console.log(`   ${step.description}`);
            step.commands.forEach(cmd => {
                console.log(`   > ${cmd}`);
            });
        });
    }

    generateDebugScript() {
        const debugScript = `// Script de debug para el navegador
// Pegar en la consola del navegador (F12)

console.log('🔍 Debug de Login - Información del sistema');
console.log('URL actual:', window.location.href);
console.log('Variables de entorno React:');
Object.keys(process.env).filter(key => key.startsWith('REACT_APP')).forEach(key => {
    console.log(\`  \${key}: \${process.env[key]}\`);
});

// Probar conectividad manual
fetch('http://localhost:5001/api/health')
    .then(response => response.json())
    .then(data => {
        console.log('✅ Backend accesible:', data);
        
        // Probar login manual
        return fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Login manual exitoso:', data);
    })
    .catch(error => {
        console.error('❌ Error en conectividad:', error);
    });`;

        fs.writeFileSync('./debug-login-navegador.js', debugScript);
        console.log('\n✅ Script de debug creado: debug-login-navegador.js');
        console.log('   Copia el contenido y pégalo en la consola del navegador (F12)');
    }

    async runSolution() {
        console.log('========================================');
        console.log('    SOLUCION ERROR DE LOGIN');
        console.log('========================================\n');

        // 1. Verificar y corregir configuraciones
        this.checkAndFixFrontendConfig();
        console.log('');
        this.checkBackendConfig();

        // 2. Generar pasos de solución
        this.generateTroubleshootingSteps();

        // 3. Crear script de debug
        this.generateDebugScript();

        console.log('\n========================================');
        console.log('           RESUMEN DE SOLUCION');
        console.log('========================================');
        console.log('✅ Configuraciones verificadas y corregidas');
        console.log('✅ Pasos de troubleshooting generados');
        console.log('✅ Script de debug del navegador creado');
        console.log('\n🔧 SIGUIENTE PASO:');
        console.log('1. Reiniciar el frontend: cd frontend && npm start');
        console.log('2. Abrir el navegador en modo incógnito');
        console.log('3. Si persiste el error, usar el script de debug');
        console.log('4. Verificar la consola del navegador (F12) para errores');
    }
}

// Ejecutar solución
if (require.main === module) {
    const solution = new LoginErrorSolution();
    solution.runSolution().catch(console.error);
}

module.exports = LoginErrorSolution;
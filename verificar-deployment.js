const fs = require('fs');
const path = require('path');

class DeploymentChecker {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.success = [];
    }

    checkFileExists(filePath, description) {
        if (fs.existsSync(filePath)) {
            this.success.push(`✅ ${description}: ${filePath}`);
            return true;
        } else {
            this.errors.push(`❌ ${description} no encontrado: ${filePath}`);
            return false;
        }
    }

    checkFileContent(filePath, searchString, description) {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes(searchString)) {
                this.success.push(`✅ ${description}`);
                return true;
            } else {
                this.warnings.push(`⚠️  ${description} - no encontrado: ${searchString}`);
                return false;
            }
        } else {
            this.errors.push(`❌ Archivo no existe: ${filePath}`);
            return false;
        }
    }

    checkBackend() {
        console.log('\n🔧 Verificando Backend...\n');

        // Archivos esenciales
        this.checkFileExists('./backend/package.json', 'package.json del backend');
        this.checkFileExists('./backend/server.js', 'server.js del backend');
        this.checkFileExists('./backend/railway.json', 'railway.json del backend');
        this.checkFileExists('./backend/.env.example', '.env.example del backend');
        this.checkFileExists('./backend/.gitignore', '.gitignore del backend');
        this.checkFileExists('./backend/README.md', 'README.md del backend');

        // Verificar configuración
        this.checkFileContent(
            './backend/server.js',
            'cors',
            'CORS configurado en server.js'
        );

        this.checkFileContent(
            './backend/config/database.js',
            'DATABASE_URL',
            'Soporte para DATABASE_URL en database.js'
        );

        // Verificar package.json
        if (fs.existsSync('./backend/package.json')) {
            const pkg = JSON.parse(fs.readFileSync('./backend/package.json', 'utf8'));
            
            if (pkg.scripts && pkg.scripts.start) {
                this.success.push('✅ Script "start" definido en backend/package.json');
            } else {
                this.errors.push('❌ Script "start" no definido en backend/package.json');
            }

            if (pkg.engines && pkg.engines.node) {
                this.success.push(`✅ Versión de Node especificada: ${pkg.engines.node}`);
            } else {
                this.warnings.push('⚠️  Versión de Node no especificada en engines');
            }
        }
    }

    checkFrontend() {
        console.log('\n🎨 Verificando Frontend...\n');

        // Archivos esenciales
        this.checkFileExists('./frontend/package.json', 'package.json del frontend');
        this.checkFileExists('./frontend/railway.json', 'railway.json del frontend');
        this.checkFileExists('./frontend/.env.example', '.env.example del frontend');
        this.checkFileExists('./frontend/.env.production', '.env.production del frontend');
        this.checkFileExists('./frontend/.gitignore', '.gitignore del frontend');
        this.checkFileExists('./frontend/README.md', 'README.md del frontend');

        // Verificar package.json
        if (fs.existsSync('./frontend/package.json')) {
            const pkg = JSON.parse(fs.readFileSync('./frontend/package.json', 'utf8'));
            
            if (pkg.scripts && pkg.scripts.build) {
                this.success.push('✅ Script "build" definido en frontend/package.json');
            } else {
                this.errors.push('❌ Script "build" no definido en frontend/package.json');
            }

            if (pkg.dependencies && pkg.dependencies.serve) {
                this.success.push('✅ Dependencia "serve" instalada');
            } else {
                this.warnings.push('⚠️  Dependencia "serve" no encontrada (necesaria para Railway)');
            }
        }

        // Verificar AuthContext
        this.checkFileContent(
            './frontend/src/contexts/AuthContext.js',
            'REACT_APP_API_URL',
            'REACT_APP_API_URL usado en AuthContext'
        );
    }

    checkDatabase() {
        console.log('\n🗄️  Verificando Base de Datos...\n');

        this.checkFileExists('./database/schema.sql', 'Schema SQL');
        this.checkFileExists('./database/notifications-schema.sql', 'Schema de notificaciones');
    }

    checkDocumentation() {
        console.log('\n📚 Verificando Documentación...\n');

        this.checkFileExists('./GUIA_DEPLOYMENT_RAILWAY.md', 'Guía de deployment');
        this.checkFileExists('./backend/README.md', 'README del backend');
        this.checkFileExists('./frontend/README.md', 'README del frontend');
    }

    generateReport() {
        console.log('\n========================================');
        console.log('     REPORTE DE VERIFICACION');
        console.log('========================================\n');

        if (this.success.length > 0) {
            console.log('✅ EXITOSOS:\n');
            this.success.forEach(msg => console.log(`   ${msg}`));
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️  ADVERTENCIAS:\n');
            this.warnings.forEach(msg => console.log(`   ${msg}`));
        }

        if (this.errors.length > 0) {
            console.log('\n❌ ERRORES:\n');
            this.errors.forEach(msg => console.log(`   ${msg}`));
        }

        console.log('\n========================================');
        console.log('              RESUMEN');
        console.log('========================================');
        console.log(`✅ Exitosos:     ${this.success.length}`);
        console.log(`⚠️  Advertencias: ${this.warnings.length}`);
        console.log(`❌ Errores:      ${this.errors.length}`);
        console.log('========================================\n');

        if (this.errors.length === 0) {
            console.log('🎉 ¡Proyecto listo para deployment en Railway!\n');
            console.log('Próximos pasos:');
            console.log('1. Ejecutar: preparar-deployment.bat');
            console.log('2. Seguir la guía: GUIA_DEPLOYMENT_RAILWAY.md');
            console.log('3. Crear repositorios en GitHub');
            console.log('4. Desplegar en Railway\n');
        } else {
            console.log('⚠️  Hay errores que deben corregirse antes del deployment.\n');
        }
    }

    run() {
        console.log('========================================');
        console.log('  VERIFICACION DE DEPLOYMENT RAILWAY');
        console.log('========================================');

        this.checkBackend();
        this.checkFrontend();
        this.checkDatabase();
        this.checkDocumentation();
        this.generateReport();
    }
}

// Ejecutar verificación
if (require.main === module) {
    const checker = new DeploymentChecker();
    checker.run();
}

module.exports = DeploymentChecker;
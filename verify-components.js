const fs = require('fs');
const path = require('path');

function verificarComponentes() {
    console.log('🔍 VERIFICANDO EXPORTACIONES DE COMPONENTES');
    console.log('='.repeat(50));

    const componentsDir = './frontend/src/components';
    const components = [
        'Login.js',
        'Dashboard.js',
        'DocumentList.js',
        'DocumentViewer.js',
        'DocumentEditor.js',
        'UploadDocument.js',
        'UserManagement.js',
        'Layout.js',
        'ProtectedRoute.js'
    ];

    components.forEach(componentFile => {
        const filePath = path.join(componentsDir, componentFile);
        
        if (!fs.existsSync(filePath)) {
            console.log(`❌ ${componentFile}: Archivo no encontrado`);
            return;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const componentName = componentFile.replace('.js', '');
        
        // Verificar exportación default
        const hasDefaultExport = content.includes(`export default ${componentName}`) || 
                                content.includes('export default ');
        
        // Verificar definición del componente
        const hasComponentDefinition = content.includes(`const ${componentName} = `) ||
                                     content.includes(`function ${componentName}(`);

        console.log(`\n📄 ${componentFile}:`);
        console.log(`   - Definición: ${hasComponentDefinition ? '✅' : '❌'}`);
        console.log(`   - Exportación: ${hasDefaultExport ? '✅' : '❌'}`);

        if (!hasDefaultExport) {
            console.log(`   ⚠️ Falta exportación default`);
        }

        if (!hasComponentDefinition) {
            console.log(`   ⚠️ No se encontró definición del componente`);
        }

        // Verificar imports problemáticos
        const problematicImports = [
            'import React,',
            'import {',
            'from \'@mui/material\'',
            'from \'@mui/icons-material\'',
            'from \'react-router-dom\'',
            'from \'axios\''
        ];

        let hasProblematicImports = false;
        problematicImports.forEach(importPattern => {
            if (content.includes(importPattern)) {
                hasProblematicImports = true;
            }
        });

        if (hasProblematicImports) {
            console.log(`   - Imports: ✅`);
        } else {
            console.log(`   - Imports: ⚠️ Podrían faltar imports`);
        }
    });

    // Verificar App.js
    console.log(`\n📄 App.js:`);
    const appPath = './frontend/src/App.js';
    if (fs.existsSync(appPath)) {
        const appContent = fs.readFileSync(appPath, 'utf8');
        
        components.forEach(componentFile => {
            const componentName = componentFile.replace('.js', '');
            const hasImport = appContent.includes(`import ${componentName} from './components/${componentName}'`);
            
            if (appContent.includes(`<${componentName}`)) {
                console.log(`   - ${componentName}: ${hasImport ? '✅ Importado' : '❌ Usado pero no importado'}`);
            }
        });
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ VERIFICACIÓN COMPLETADA');
}

verificarComponentes();
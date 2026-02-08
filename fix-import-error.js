const fs = require('fs');
const path = require('path');

function diagnosticarImportaciones() {
    console.log('🔍 DIAGNÓSTICO DE IMPORTACIONES - DOCUMENT EDITOR');
    console.log('='.repeat(60));

    // 1. Verificar DocumentEditor.js
    console.log('\n1. 📄 Verificando DocumentEditor.js...');
    const editorPath = './frontend/src/components/DocumentEditor.js';
    
    if (!fs.existsSync(editorPath)) {
        console.log('❌ DocumentEditor.js no existe');
        return;
    }

    const editorContent = fs.readFileSync(editorPath, 'utf8');
    
    // Verificar exportación
    const hasExport = editorContent.includes('export default DocumentEditor');
    console.log(`   - Exportación: ${hasExport ? '✅' : '❌'}`);
    
    // Verificar definición
    const hasDefinition = editorContent.includes('const DocumentEditor = ()');
    console.log(`   - Definición: ${hasDefinition ? '✅' : '❌'}`);
    
    // Verificar imports problemáticos
    const problematicImports = [
        'import React',
        'from \'@mui/material\'',
        'from \'@mui/icons-material\'',
        'from \'react-router-dom\'',
        'from \'../contexts/AuthContext\'',
        'from \'./Layout\'',
        'from \'axios\''
    ];
    
    console.log('   - Imports verificados:');
    problematicImports.forEach(imp => {
        const hasImport = editorContent.includes(imp);
        console.log(`     ${hasImport ? '✅' : '❌'} ${imp}`);
    });

    // 2. Verificar App.js
    console.log('\n2. 📄 Verificando App.js...');
    const appPath = './frontend/src/App.js';
    
    if (!fs.existsSync(appPath)) {
        console.log('❌ App.js no existe');
        return;
    }

    const appContent = fs.readFileSync(appPath, 'utf8');
    
    // Verificar importación de DocumentEditor
    const hasImport = appContent.includes('import DocumentEditor from \'./components/DocumentEditor\'');
    console.log(`   - Import DocumentEditor: ${hasImport ? '✅' : '❌'}`);
    
    // Verificar uso en JSX
    const hasUsage = appContent.includes('<DocumentEditor />');
    console.log(`   - Uso en JSX: ${hasUsage ? '✅' : '❌'}`);

    // 3. Verificar otros componentes que podrían tener conflictos
    console.log('\n3. 📄 Verificando otros componentes...');
    const components = ['Layout.js', 'ProtectedRoute.js'];
    
    components.forEach(comp => {
        const compPath = `./frontend/src/components/${comp}`;
        if (fs.existsSync(compPath)) {
            const compContent = fs.readFileSync(compPath, 'utf8');
            const compName = comp.replace('.js', '');
            const hasExport = compContent.includes(`export default ${compName}`) || 
                            compContent.includes('export default ');
            console.log(`   - ${comp}: ${hasExport ? '✅' : '❌'} exportación`);
        } else {
            console.log(`   - ${comp}: ❌ no existe`);
        }
    });

    // 4. Generar soluciones
    console.log('\n' + '='.repeat(60));
    console.log('🛠️ SOLUCIONES RECOMENDADAS:');
    
    if (!hasExport) {
        console.log('\n❌ PROBLEMA: Falta exportación en DocumentEditor.js');
        console.log('✅ SOLUCIÓN: Agregar al final del archivo:');
        console.log('   export default DocumentEditor;');
    }
    
    if (!hasDefinition) {
        console.log('\n❌ PROBLEMA: Falta definición del componente');
        console.log('✅ SOLUCIÓN: Verificar que exista:');
        console.log('   const DocumentEditor = () => { ... };');
    }
    
    if (!hasImport) {
        console.log('\n❌ PROBLEMA: Falta importación en App.js');
        console.log('✅ SOLUCIÓN: Agregar importación:');
        console.log('   import DocumentEditor from \'./components/DocumentEditor\';');
    }

    console.log('\n🔄 PASOS PARA APLICAR LA SOLUCIÓN:');
    console.log('1. Detener el frontend (Ctrl+C)');
    console.log('2. Aplicar las correcciones mostradas arriba');
    console.log('3. Reiniciar el frontend: cd frontend && npm start');
    console.log('4. Probar la ruta: http://localhost:3000/documents/{id}/edit');

    // 5. Crear archivo de respaldo si es necesario
    if (!hasExport || !hasDefinition) {
        console.log('\n💾 CREANDO RESPALDO DE DOCUMENTEDITOR...');
        const backupPath = './frontend/src/components/DocumentEditor.backup.js';
        fs.copyFileSync(editorPath, backupPath);
        console.log(`✅ Respaldo creado en: ${backupPath}`);
    }
}

diagnosticarImportaciones();
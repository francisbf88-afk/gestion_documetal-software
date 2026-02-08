const axios = require('axios');

async function checkServices() {
    console.log('🔍 VERIFICACIÓN DE SERVICIOS');
    console.log('============================\n');

    // Verificar Backend
    console.log('1. 🔧 Verificando Backend (puerto 5000)...');
    try {
        const response = await axios.get('http://localhost:5000/api/auth/login', { 
            timeout: 3000,
            validateStatus: () => true // Aceptar cualquier código de estado
        });
        console.log(`✅ Backend responde (código: ${response.status})`);
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Backend NO está ejecutándose en puerto 5000');
        } else {
            console.log(`⚠️  Backend responde con error: ${error.message}`);
        }
    }

    // Verificar Frontend
    console.log('\n2. 🌐 Verificando Frontend (puerto 3000)...');
    try {
        const response = await axios.get('http://localhost:3000', { 
            timeout: 3000,
            validateStatus: () => true
        });
        console.log(`✅ Frontend responde (código: ${response.status})`);
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Frontend NO está ejecutándose en puerto 3000');
        } else {
            console.log(`⚠️  Frontend responde con error: ${error.message}`);
        }
    }

    // Verificar Frontend en puerto alternativo
    console.log('\n3. 🌐 Verificando Frontend (puerto 3001)...');
    try {
        const response = await axios.get('http://localhost:3001', { 
            timeout: 3000,
            validateStatus: () => true
        });
        console.log(`✅ Frontend responde en puerto 3001 (código: ${response.status})`);
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Frontend NO está ejecutándose en puerto 3001');
        } else {
            console.log(`⚠️  Frontend responde con error: ${error.message}`);
        }
    }

    console.log('\n📋 INSTRUCCIONES:');
    console.log('================');
    console.log('Si el Backend NO está ejecutándose:');
    console.log('   cd backend && node server.js');
    console.log('');
    console.log('Si el Frontend NO está ejecutándose:');
    console.log('   cd frontend && npm start');
    console.log('');
    console.log('Una vez que ambos estén ejecutándose:');
    console.log('1. Ve a http://localhost:3000 (o 3001)');
    console.log('2. Inicia sesión con: admin / admin123');
    console.log('3. Ve a Lista de Documentos');
    console.log('4. Edita un documento TXT');
    console.log('5. Busca la sección "Información del Documento"');
    console.log('6. Deberías ver los selectores de Tipo de Documento e Importancia');
}

checkServices();
const axios = require('axios');

async function verifyAdminLogin() {
    console.log('🔍 Verificando login de admin...\n');

    try {
        const response = await axios.post('http://localhost:5001/api/auth/login', {
            username: 'admin',
            password: 'admin123'
        });

        if (response.status === 200) {
            console.log('✅ LOGIN EXITOSO\n');
            console.log('========================================');
            console.log('   INFORMACIÓN DEL USUARIO');
            console.log('========================================');
            console.log(`Nombre:   ${response.data.user.nombre}`);
            console.log(`Usuario:  ${response.data.user.username}`);
            console.log(`Email:    ${response.data.user.email || 'No configurado'}`);
            console.log(`Rol:      ${response.data.user.rol}`);
            console.log(`Token:    ${response.data.token.substring(0, 30)}...`);
            console.log('========================================\n');
            console.log('✅ El usuario admin puede iniciar sesión correctamente');
        }
    } catch (error) {
        console.log('❌ ERROR EN LOGIN\n');
        if (error.response) {
            console.log(`Status: ${error.response.status}`);
            console.log(`Mensaje: ${error.response.data.message}`);
        } else {
            console.log(`Error: ${error.message}`);
        }
        console.log('\n⚠️  Verifica que el backend esté ejecutándose en puerto 5001');
    }
}

verifyAdminLogin();
const { pool } = require('./config/database');

async function checkAdminUsername() {
    try {
        console.log('🔍 Verificando username de admin...\n');
        
        const result = await pool.query('SELECT id, nombre, username, email, rol FROM usuarios WHERE email = $1', ['admin@sistema.com']);
        
        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log('✅ Usuario admin encontrado:');
            console.log(`   - ID: ${user.id}`);
            console.log(`   - Nombre: ${user.nombre}`);
            console.log(`   - Username: ${user.username || 'NULL'}`);
            console.log(`   - Email: ${user.email}`);
            console.log(`   - Rol: ${user.rol}`);
        } else {
            console.log('❌ Usuario admin no encontrado');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkAdminUsername();
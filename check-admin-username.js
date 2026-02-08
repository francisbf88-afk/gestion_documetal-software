const { pool } = require('./backend/config/database');

async function checkAdminUsername() {
    try {
        console.log('🔍 Verificando username de admin...\n');
        
        const result = await pool.query('SELECT username, email, rol FROM usuarios WHERE rol = $1', ['admin']);
        
        if (result.rows.length > 0) {
            console.log('✅ Usuarios admin encontrados:');
            result.rows.forEach(user => {
                console.log(`   - Username: ${user.username}`);
                console.log(`   - Email: ${user.email}`);
                console.log(`   - Rol: ${user.rol}`);
            });
        } else {
            console.log('❌ No se encontraron usuarios admin');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkAdminUsername();
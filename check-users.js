const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'sgd',
    port: process.env.DB_PORT || 5432
});

async function checkUsers() {
    try {
        console.log('🔍 Verificando usuarios en la base de datos...');
        
        const result = await pool.query('SELECT id, nombre, username, rol, activo FROM usuarios ORDER BY id');
        
        if (result.rows.length === 0) {
            console.log('❌ No hay usuarios en la base de datos');
            console.log('💡 Ejecuta el script de inicialización de la base de datos');
        } else {
            console.log('👥 Usuarios encontrados:');
            result.rows.forEach(user => {
                const status = user.activo ? '✅ Activo' : '❌ Inactivo';
                console.log(`   - ${user.nombre} (${user.username}) - Rol: ${user.rol} - ${status}`);
            });
        }
        
        // Verificar contraseñas de usuarios de prueba
        console.log('\n🔐 Verificando contraseñas de usuarios de prueba...');
        const bcrypt = require('bcryptjs');
        
        const testPasswords = {
            'admin': 'admin123',
            'editor': 'editor123',
            'asesor': 'asesor123'
        };
        
        for (const [username, expectedPassword] of Object.entries(testPasswords)) {
            const userResult = await pool.query('SELECT password FROM usuarios WHERE username = $1', [username]);
            if (userResult.rows.length > 0) {
                const isValid = await bcrypt.compare(expectedPassword, userResult.rows[0].password);
                console.log(`   - ${username}: ${isValid ? '✅ Contraseña correcta' : '❌ Contraseña incorrecta'}`);
            } else {
                console.log(`   - ${username}: ❌ Usuario no encontrado`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error verificando usuarios:', error.message);
    } finally {
        await pool.end();
    }
}

checkUsers();
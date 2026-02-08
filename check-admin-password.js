const { pool } = require('./backend/config/database');
const bcrypt = require('./backend/node_modules/bcrypt');

async function checkAdminPassword() {
    try {
        console.log('🔍 Verificando contraseña de admin...\n');
        
        const result = await pool.query('SELECT email, password FROM usuarios WHERE email = $1', ['admin@sistema.com']);
        
        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log(`✅ Usuario encontrado: ${user.email}`);
            
            // Probar diferentes contraseñas comunes
            const passwords = ['admin123', 'admin', '123456', 'password'];
            
            for (const pwd of passwords) {
                const isValid = await bcrypt.compare(pwd, user.password);
                console.log(`   - Probando "${pwd}": ${isValid ? '✅ VÁLIDA' : '❌ Inválida'}`);
                if (isValid) {
                    console.log(`\n🎉 Contraseña correcta encontrada: "${pwd}"`);
                    break;
                }
            }
        } else {
            console.log('❌ Usuario admin no encontrado');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkAdminPassword();
const { pool } = require('./backend/config/database');
const bcrypt = require('bcryptjs');

async function resetAdminPasswordQuick() {
    console.log('========================================');
    console.log('   RESET RAPIDO - PASSWORD ADMIN');
    console.log('========================================\n');

    try {
        // Verificar conexión
        console.log('🔍 Conectando a la base de datos...');
        const client = await pool.connect();
        console.log('✅ Conexión exitosa');
        client.release();

        // Buscar usuario admin
        console.log('🔍 Buscando usuario admin...');
        const userCheck = await pool.query(
            'SELECT id, username, nombre, rol FROM usuarios WHERE username = $1',
            ['admin']
        );

        if (userCheck.rows.length === 0) {
            console.log('❌ Usuario admin no encontrado');
            console.log('⚠️  Creando usuario admin...');
            
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.query(
                'INSERT INTO usuarios (nombre, username, password, rol) VALUES ($1, $2, $3, $4)',
                ['Administrador', 'admin', hashedPassword, 'admin']
            );
            
            console.log('✅ Usuario admin creado');
        } else {
            const admin = userCheck.rows[0];
            console.log(`✅ Usuario encontrado: ${admin.nombre} (${admin.rol})`);

            // Restablecer contraseña
            console.log('🔐 Restableciendo contraseña...');
            const newPassword = 'admin123';
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await pool.query(
                'UPDATE usuarios SET password = $1 WHERE username = $2',
                [hashedPassword, 'admin']
            );

            console.log('✅ Contraseña actualizada');

            // Verificar
            console.log('🔍 Verificando nueva contraseña...');
            const verifyUser = await pool.query(
                'SELECT password FROM usuarios WHERE username = $1',
                ['admin']
            );

            const isValid = await bcrypt.compare(newPassword, verifyUser.rows[0].password);
            
            if (isValid) {
                console.log('✅ Verificación exitosa');
            } else {
                console.log('❌ Error en verificación');
                process.exit(1);
            }
        }

        console.log('\n========================================');
        console.log('✅ CONTRASEÑA RESTABLECIDA EXITOSAMENTE');
        console.log('========================================');
        console.log('');
        console.log('📋 CREDENCIALES DE ACCESO:');
        console.log('   Usuario:     admin');
        console.log('   Contraseña:  admin123');
        console.log('');
        console.log('🌐 URL de acceso:');
        console.log('   http://localhost:3001');
        console.log('');
        console.log('========================================');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetAdminPasswordQuick();
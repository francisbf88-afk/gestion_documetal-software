const { pool } = require('./backend/config/database');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class PasswordReset {
    async resetAdminPassword(newPassword) {
        try {
            console.log('🔍 Buscando usuario admin...');
            
            // Verificar que el usuario admin existe
            const userCheck = await pool.query(
                'SELECT id, username, nombre FROM usuarios WHERE username = $1',
                ['admin']
            );

            if (userCheck.rows.length === 0) {
                console.log('❌ Usuario admin no encontrado');
                return false;
            }

            const admin = userCheck.rows[0];
            console.log(`✅ Usuario encontrado: ${admin.nombre} (ID: ${admin.id})`);

            // Encriptar nueva contraseña
            console.log('🔐 Encriptando nueva contraseña...');
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Actualizar contraseña
            await pool.query(
                'UPDATE usuarios SET password = $1 WHERE username = $2',
                [hashedPassword, 'admin']
            );

            console.log('✅ Contraseña actualizada exitosamente');
            
            // Verificar que la nueva contraseña funciona
            console.log('🔍 Verificando nueva contraseña...');
            const verifyUser = await pool.query(
                'SELECT password FROM usuarios WHERE username = $1',
                ['admin']
            );

            const isValid = await bcrypt.compare(newPassword, verifyUser.rows[0].password);
            
            if (isValid) {
                console.log('✅ Verificación exitosa - la nueva contraseña funciona correctamente');
                return true;
            } else {
                console.log('❌ Error en verificación - algo salió mal');
                return false;
            }

        } catch (error) {
            console.error('❌ Error al restablecer contraseña:', error.message);
            return false;
        }
    }

    async resetWithPrompt() {
        return new Promise((resolve) => {
            rl.question('Ingresa la nueva contraseña para admin: ', async (password) => {
                if (!password || password.length < 6) {
                    console.log('❌ La contraseña debe tener al menos 6 caracteres');
                    rl.close();
                    resolve(false);
                    return;
                }

                rl.question(`Confirma la contraseña: `, async (confirmPassword) => {
                    if (password !== confirmPassword) {
                        console.log('❌ Las contraseñas no coinciden');
                        rl.close();
                        resolve(false);
                        return;
                    }

                    const success = await this.resetAdminPassword(password);
                    rl.close();
                    resolve(success);
                });
            });
        });
    }

    async resetToDefault() {
        console.log('🔧 Restableciendo contraseña de admin a valor por defecto...');
        const defaultPassword = 'admin123';
        return await this.resetAdminPassword(defaultPassword);
    }

    async showAllUsers() {
        console.log('👥 Usuarios en el sistema:');
        try {
            const result = await pool.query(
                'SELECT id, nombre, username, rol FROM usuarios ORDER BY id'
            );
            
            console.log('\n┌─────┬──────────────────┬──────────────┬──────────────┐');
            console.log('│ ID  │ Nombre           │ Username     │ Rol          │');
            console.log('├─────┼──────────────────┼──────────────┼──────────────┤');
            
            result.rows.forEach(user => {
                const id = String(user.id).padEnd(3);
                const nombre = String(user.nombre).padEnd(16);
                const username = String(user.username).padEnd(12);
                const rol = String(user.rol).padEnd(12);
                console.log(`│ ${id} │ ${nombre} │ ${username} │ ${rol} │`);
            });
            
            console.log('└─────┴──────────────────┴──────────────┴──────────────┘\n');
        } catch (error) {
            console.error('❌ Error al listar usuarios:', error.message);
        }
    }

    async run() {
        console.log('========================================');
        console.log('   RESTABLECER CONTRASEÑA DE ADMIN');
        console.log('========================================\n');

        // Mostrar usuarios
        await this.showAllUsers();

        console.log('Opciones:');
        console.log('1. Restablecer a contraseña por defecto (admin123)');
        console.log('2. Establecer una nueva contraseña personalizada');
        console.log('');

        rl.question('Selecciona una opción (1 o 2): ', async (option) => {
            if (option === '1') {
                const success = await this.resetToDefault();
                if (success) {
                    console.log('\n========================================');
                    console.log('✅ CONTRASEÑA RESTABLECIDA');
                    console.log('========================================');
                    console.log('Usuario: admin');
                    console.log('Contraseña: admin123');
                    console.log('========================================');
                }
                rl.close();
                process.exit(0);
            } else if (option === '2') {
                const success = await this.resetWithPrompt();
                if (success) {
                    console.log('\n========================================');
                    console.log('✅ CONTRASEÑA ACTUALIZADA');
                    console.log('========================================');
                    console.log('Usuario: admin');
                    console.log('Contraseña: [la que ingresaste]');
                    console.log('========================================');
                }
                process.exit(0);
            } else {
                console.log('❌ Opción inválida');
                rl.close();
                process.exit(1);
            }
        });
    }
}

// Ejecutar
if (require.main === module) {
    const reset = new PasswordReset();
    reset.run().catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });
}

module.exports = PasswordReset;
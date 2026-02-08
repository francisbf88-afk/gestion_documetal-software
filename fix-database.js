const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'sgd',
    port: process.env.DB_PORT || 5432,
});

async function repararBaseDatos() {
    console.log('🔧 REPARANDO BASE DE DATOS...');
    console.log('='.repeat(50));

    try {
        // 1. Agregar columna activo si no existe
        console.log('\n1. 📋 Agregando columna activo...');
        try {
            await pool.query('ALTER TABLE usuarios ADD COLUMN activo BOOLEAN DEFAULT TRUE');
            console.log('✅ Columna activo agregada');
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log('✅ Columna activo ya existe');
            } else {
                throw error;
            }
        }

        // 2. Verificar si username existe y es único
        console.log('\n2. 🔑 Verificando columna username...');
        const usernameExists = await pool.query(`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'usuarios' AND column_name = 'username'
        `);

        if (usernameExists.rows.length === 0) {
            console.log('❌ Columna username no existe, agregándola...');
            await pool.query('ALTER TABLE usuarios ADD COLUMN username VARCHAR(50) UNIQUE');
            console.log('✅ Columna username agregada');
        } else {
            console.log('✅ Columna username existe');
        }

        // 3. Verificar usuarios existentes
        console.log('\n3. 👥 Verificando usuarios existentes...');
        const users = await pool.query('SELECT id, nombre, username, email, rol FROM usuarios');
        
        if (users.rows.length === 0) {
            console.log('❌ No hay usuarios, creando usuarios por defecto...');
            await crearUsuariosPorDefecto();
        } else {
            console.log(`✅ Usuarios encontrados: ${users.rows.length}`);
            
            // Verificar si los usuarios tienen username
            for (const user of users.rows) {
                if (!user.username) {
                    console.log(`🔄 Actualizando username para usuario ${user.nombre}...`);
                    let username = user.email ? user.email.split('@')[0] : user.nombre.toLowerCase().replace(/\s+/g, '');
                    
                    // Asignar usernames específicos para usuarios conocidos
                    if (user.email === 'admin@sistema.com' || user.rol === 'admin') {
                        username = 'admin';
                    } else if (user.email === 'asesor@sistema.com' || user.rol === 'asesor') {
                        username = 'asesor';
                    } else if (user.email === 'editor@sistema.com' || user.rol === 'editor') {
                        username = 'editor';
                    }

                    await pool.query('UPDATE usuarios SET username = $1 WHERE id = $2', [username, user.id]);
                    console.log(`✅ Username actualizado: ${username}`);
                }
            }
        }

        // 4. Actualizar contraseñas con las nuevas
        console.log('\n4. 🔐 Actualizando contraseñas...');
        const passwordUpdates = [
            { username: 'admin', password: 'admin123' },
            { username: 'asesor', password: 'asesor123' },
            { username: 'editor', password: 'editor123' }
        ];

        for (const update of passwordUpdates) {
            const userExists = await pool.query('SELECT id FROM usuarios WHERE username = $1', [update.username]);
            if (userExists.rows.length > 0) {
                const hashedPassword = await bcrypt.hash(update.password, 10);
                await pool.query('UPDATE usuarios SET password = $1 WHERE username = $2', [hashedPassword, update.username]);
                console.log(`✅ Contraseña actualizada para ${update.username}`);
            }
        }

        // 5. Hacer username NOT NULL si todos los usuarios tienen username
        console.log('\n5. 🔒 Configurando restricciones...');
        const usersWithoutUsername = await pool.query('SELECT COUNT(*) as count FROM usuarios WHERE username IS NULL');
        if (usersWithoutUsername.rows[0].count === '0') {
            try {
                await pool.query('ALTER TABLE usuarios ALTER COLUMN username SET NOT NULL');
                console.log('✅ Columna username configurada como NOT NULL');
            } catch (error) {
                console.log('⚠️ No se pudo configurar username como NOT NULL:', error.message);
            }
        }

        // 6. Verificar estado final
        console.log('\n6. ✅ VERIFICACIÓN FINAL...');
        const finalUsers = await pool.query('SELECT id, nombre, username, email, rol, activo FROM usuarios ORDER BY id');
        console.log('Usuarios configurados:');
        finalUsers.rows.forEach(user => {
            console.log(`   - ${user.username}: ${user.nombre} (${user.rol}) - Activo: ${user.activo}`);
        });

        console.log('\n✅ BASE DE DATOS REPARADA EXITOSAMENTE');

    } catch (error) {
        console.error('❌ Error reparando base de datos:', error.message);
    } finally {
        await pool.end();
    }
}

async function crearUsuariosPorDefecto() {
    const usuarios = [
        {
            nombre: 'Administrador',
            username: 'admin',
            email: 'admin@sistema.com',
            password: await bcrypt.hash('admin123', 10),
            rol: 'admin'
        },
        {
            nombre: 'Asesor Demo',
            username: 'asesor',
            email: 'asesor@sistema.com',
            password: await bcrypt.hash('asesor123', 10),
            rol: 'asesor'
        },
        {
            nombre: 'Editor Demo',
            username: 'editor',
            email: 'editor@sistema.com',
            password: await bcrypt.hash('editor123', 10),
            rol: 'editor'
        }
    ];

    for (const usuario of usuarios) {
        await pool.query(
            'INSERT INTO usuarios (nombre, username, email, password, rol, activo) VALUES ($1, $2, $3, $4, $5, $6)',
            [usuario.nombre, usuario.username, usuario.email, usuario.password, usuario.rol, true]
        );
        console.log(`✅ Usuario creado: ${usuario.username}`);
    }
}

// Ejecutar reparación
repararBaseDatos();
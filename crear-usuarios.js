const { pool } = require('./backend/config/database');
const bcrypt = require('bcryptjs');

async function crearUsuarios() {
    console.log('========================================');
    console.log('   CREAR USUARIOS INICIALES');
    console.log('========================================\n');

    const usuarios = [
        {
            nombre: 'Administrador',
            username: 'admin',
            email: 'admin@sistema.com',
            password: 'admin123',
            rol: 'admin'
        },
        {
            nombre: 'Editor',
            username: 'editor',
            email: 'editor@sistema.com',
            password: 'editor123',
            rol: 'editor'
        },
        {
            nombre: 'Asesor',
            username: 'asesor',
            email: 'asesor@sistema.com',
            password: 'asesor123',
            rol: 'asesor'
        }
    ];

    try {
        // Verificar conexión
        const client = await pool.connect();
        console.log('✅ Conectado a PostgreSQL\n');
        client.release();

        for (const usuario of usuarios) {
            try {
                // Verificar si el usuario ya existe
                const existe = await pool.query(
                    'SELECT id FROM usuarios WHERE username = $1',
                    [usuario.username]
                );

                if (existe.rows.length > 0) {
                    console.log(`⚠️  Usuario ${usuario.username} ya existe`);
                    continue;
                }

                // Hash de la contraseña
                const hashedPassword = await bcrypt.hash(usuario.password, 10);

                // Insertar usuario
                await pool.query(
                    'INSERT INTO usuarios (nombre, username, email, password, rol) VALUES ($1, $2, $3, $4, $5)',
                    [usuario.nombre, usuario.username, usuario.email, hashedPassword, usuario.rol]
                );

                console.log(`✅ Usuario ${usuario.username} creado exitosamente`);
            } catch (error) {
                console.log(`❌ Error creando usuario ${usuario.username}:`, error.message);
            }
        }

        // Mostrar usuarios creados
        console.log('\n========================================');
        console.log('   USUARIOS EN EL SISTEMA');
        console.log('========================================\n');

        const result = await pool.query(
            'SELECT id, nombre, username, email, rol FROM usuarios ORDER BY id'
        );

        console.log('┌─────┬──────────────────┬──────────────┬─────────────────────────┬──────────┐');
        console.log('│ ID  │ Nombre           │ Username     │ Email                   │ Rol      │');
        console.log('├─────┼──────────────────┼──────────────┼─────────────────────────┼──────────┤');

        result.rows.forEach(user => {
            const id = String(user.id).padEnd(3);
            const nombre = String(user.nombre).padEnd(16);
            const username = String(user.username).padEnd(12);
            const email = String(user.email || '').padEnd(23);
            const rol = String(user.rol).padEnd(8);
            console.log(`│ ${id} │ ${nombre} │ ${username} │ ${email} │ ${rol} │`);
        });

        console.log('└─────┴──────────────────┴──────────────┴─────────────────────────┴──────────┘\n');

        console.log('========================================');
        console.log('   CREDENCIALES DE ACCESO');
        console.log('========================================\n');
        console.log('Admin:  admin / admin123');
        console.log('Editor: editor / editor123');
        console.log('Asesor: asesor / asesor123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

crearUsuarios();

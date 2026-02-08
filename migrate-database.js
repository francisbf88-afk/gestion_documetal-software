const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos desde DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function runMigrations() {
    console.log('🔄 Ejecutando migraciones...');
    
    try {
        // Leer y ejecutar schema.sql
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('📝 Ejecutando schema.sql...');
        await pool.query(schema);
        console.log('✓ Schema creado exitosamente');
        
        // Leer y ejecutar notifications-schema.sql
        const notificationsPath = path.join(__dirname, 'database', 'notifications-schema.sql');
        const notificationsSchema = fs.readFileSync(notificationsPath, 'utf8');
        
        console.log('📝 Ejecutando notifications-schema.sql...');
        await pool.query(notificationsSchema);
        console.log('✓ Notificaciones configuradas');
        
        // Crear usuario admin por defecto
        const bcrypt = require('bcryptjs');
        const adminPassword = await bcrypt.hash('admin123', 10);
        
        const checkAdmin = await pool.query(
            'SELECT id FROM usuarios WHERE username = $1',
            ['admin']
        );
        
        if (checkAdmin.rows.length === 0) {
            await pool.query(
                `INSERT INTO usuarios (nombre, username, email, password, rol)
                 VALUES ($1, $2, $3, $4, $5)`,
                ['Administrador', 'admin', 'admin@sistema.com', adminPassword, 'admin']
            );
            console.log('✓ Usuario admin creado');
        } else {
            console.log('ℹ Usuario admin ya existe');
        }
        
        console.log('✅ Migraciones completadas exitosamente');
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en migraciones:', error);
        await pool.end();
        process.exit(1);
    }
}

runMigrations();

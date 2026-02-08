const fs = require('fs');
const path = require('path');
const { pool } = require('./backend/config/database');

async function migrateToPostgreSQL() {
    console.log('🚀 Iniciando migración a PostgreSQL...');
    
    try {
        // Leer el archivo SQL del schema
        const schemaPath = path.join(__dirname, 'COMPLETE_POSTGRESQL_SCHEMA.sql');
        
        if (!fs.existsSync(schemaPath)) {
            console.error('❌ No se encontró el archivo COMPLETE_POSTGRESQL_SCHEMA.sql');
            console.log('📝 Asegúrate de que el archivo esté en la raíz del proyecto');
            process.exit(1);
        }
        
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        
        // Conectar a la base de datos
        const client = await pool.connect();
        console.log('✅ Conectado a PostgreSQL');
        
        // Ejecutar el schema completo
        console.log('📊 Ejecutando schema de PostgreSQL...');
        await client.query(schemaSql);
        console.log('✅ Schema ejecutado correctamente');
        
        // Verificar la instalación
        console.log('🔍 Verificando instalación...');
        
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        
        console.log('📋 Tablas creadas:');
        tablesResult.rows.forEach(row => {
            console.log(`  - ${row.table_name}`);
        });
        
        // Verificar datos iniciales
        const usuariosCount = await client.query('SELECT COUNT(*) FROM usuarios');
        const categoriasCount = await client.query('SELECT COUNT(*) FROM categorias');
        const permisosCount = await client.query('SELECT COUNT(*) FROM permisos');
        const tiposCount = await client.query('SELECT COUNT(*) FROM tipos_documento');
        
        console.log('\n📊 Datos iniciales:');
        console.log(`  - Usuarios: ${usuariosCount.rows[0].count}`);
        console.log(`  - Categorías: ${categoriasCount.rows[0].count}`);
        console.log(`  - Permisos: ${permisosCount.rows[0].count}`);
        console.log(`  - Tipos de documento: ${tiposCount.rows[0].count}`);
        
        // Mostrar usuarios creados
        const usuarios = await client.query('SELECT username, rol FROM usuarios ORDER BY id');
        console.log('\n👥 Usuarios creados:');
        usuarios.rows.forEach(user => {
            console.log(`  - ${user.username} (${user.rol})`);
        });
        
        client.release();
        
        console.log('\n🎉 ¡Migración completada exitosamente!');
        console.log('📝 Credenciales de acceso:');
        console.log('  - admin / admin123');
        console.log('  - editor / editor123');
        console.log('  - asesor / asesor123');
        
        console.log('\n🚀 Puedes iniciar el servidor con: npm run dev');
        
    } catch (error) {
        console.error('❌ Error durante la migración:', error.message);
        console.error('📋 Detalles:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Ejecutar migración
migrateToPostgreSQL();
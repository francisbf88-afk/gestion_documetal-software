const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuración de la base de datos
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'sgd',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5432,
});

async function setupNotifications() {
    try {
        console.log('🔄 Configurando sistema de notificaciones...');
        
        // Leer el archivo SQL de notificaciones
        const sqlPath = path.join(__dirname, 'database', 'notifications-schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        // Ejecutar el SQL
        await pool.query(sql);
        
        console.log('✅ Sistema de notificaciones configurado exitosamente');
        console.log('📋 Se han creado:');
        console.log('   - Tabla de notificaciones');
        console.log('   - Función para crear notificaciones automáticas');
        console.log('   - Trigger para detectar modificaciones de no-admins');
        console.log('   - Funciones auxiliares para gestión de notificaciones');
        
        // Verificar que todo se creó correctamente
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'notificaciones'
        `);
        
        if (tablesResult.rows.length > 0) {
            console.log('✅ Tabla de notificaciones creada correctamente');
        } else {
            console.log('❌ Error: No se pudo crear la tabla de notificaciones');
        }
        
        // Verificar triggers
        const triggersResult = await pool.query(`
            SELECT trigger_name 
            FROM information_schema.triggers 
            WHERE trigger_name = 'trigger_notificacion_modificacion'
        `);
        
        if (triggersResult.rows.length > 0) {
            console.log('✅ Trigger de notificaciones creado correctamente');
        } else {
            console.log('❌ Error: No se pudo crear el trigger de notificaciones');
        }
        
        console.log('\n🎉 ¡Sistema de notificaciones listo para usar!');
        console.log('💡 Las notificaciones se generarán automáticamente cuando:');
        console.log('   - Un editor cree un documento');
        console.log('   - Un editor modifique un documento');
        console.log('   - Un asesor realice alguna acción (si tiene permisos)');
        console.log('   - Cualquier usuario no-admin modifique archivos');
        
    } catch (error) {
        console.error('❌ Error al configurar sistema de notificaciones:', error);
        console.error('Detalles:', error.message);
    } finally {
        await pool.end();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    setupNotifications();
}

module.exports = { setupNotifications };
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'sgd',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const runMigration = async () => {
    try {
        console.log('🔄 Ejecutando migración de categorías...');
        
        // Leer el archivo SQL de migración
        const migrationSQL = fs.readFileSync(path.join(__dirname, 'database', 'add-categories.sql'), 'utf8');
        
        // Ejecutar la migración
        await pool.query(migrationSQL);
        
        console.log('✅ Migración de categorías completada exitosamente');
        console.log('📋 Se han creado:');
        console.log('   - Tabla "categorias"');
        console.log('   - Columna "id_categoria" en tabla "documentos"');
        console.log('   - 8 categorías por defecto');
        console.log('   - Índices para mejorar rendimiento');
        
        // Verificar que las categorías se crearon
        const categoriesResult = await pool.query('SELECT nombre, descripcion FROM categorias ORDER BY orden');
        console.log('\n📁 Categorías creadas:');
        categoriesResult.rows.forEach(cat => {
            console.log(`   - ${cat.nombre}: ${cat.descripcion}`);
        });
        
        // Verificar documentos actualizados
        const documentsResult = await pool.query('SELECT COUNT(*) as count FROM documentos WHERE id_categoria IS NOT NULL');
        console.log(`\n📄 ${documentsResult.rows[0].count} documento(s) asignados a "Archivo General"`);
        
    } catch (error) {
        if (error.message.includes('already exists')) {
            console.log('⚠️  La migración ya fue ejecutada anteriormente');
        } else {
            console.error('❌ Error ejecutando migración:', error.message);
        }
    } finally {
        await pool.end();
    }
};

// Ejecutar migración si se llama directamente
if (require.main === module) {
    runMigration();
}

module.exports = { runMigration };
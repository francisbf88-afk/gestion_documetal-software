const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'sgd',
    port: process.env.DB_PORT || 5432,
});

async function completarTablaDocumentos() {
    console.log('🔧 COMPLETANDO ESTRUCTURA DE TABLA DOCUMENTOS');
    console.log('='.repeat(50));

    try {
        // Obtener columnas actuales
        const columnsResult = await pool.query(`
            SELECT column_name
            FROM information_schema.columns 
            WHERE table_name = 'documentos';
        `);
        
        const existingColumns = columnsResult.rows.map(row => row.column_name);
        console.log('📋 Columnas existentes:', existingColumns.join(', '));

        // Columnas que deberían existir según el código
        const requiredColumns = [
            { name: 'mime_type', type: 'VARCHAR(100)', nullable: true },
            { name: 'es_publico', type: 'BOOLEAN', default: 'FALSE' },
            { name: 'requiere_aprobacion', type: 'BOOLEAN', default: 'FALSE' }
        ];

        // Agregar columnas faltantes
        for (const column of requiredColumns) {
            if (!existingColumns.includes(column.name)) {
                console.log(`\n🔧 Agregando columna ${column.name}...`);
                
                let alterQuery = `ALTER TABLE documentos ADD COLUMN ${column.name} ${column.type}`;
                if (column.default) {
                    alterQuery += ` DEFAULT ${column.default}`;
                }
                
                await pool.query(alterQuery);
                console.log(`✅ Columna ${column.name} agregada`);
            } else {
                console.log(`✅ Columna ${column.name} ya existe`);
            }
        }

        // Verificar estructura final
        console.log('\n📋 ESTRUCTURA FINAL DE TABLA DOCUMENTOS:');
        const finalColumnsResult = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'documentos' 
            ORDER BY ordinal_position;
        `);
        
        finalColumnsResult.rows.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'}) ${col.column_default ? `[${col.column_default}]` : ''}`);
        });

        // Probar query completa
        console.log('\n🧪 Probando query completa de documentos...');
        const testQuery = `
            SELECT d.*, u.nombre as usuario_nombre, t.nombre as tipo_nombre, i.nivel as importancia_nivel
            FROM documentos d
            JOIN usuarios u ON d.id_usuario = u.id
            JOIN tipos_documento t ON d.id_tipo_documento = t.id
            JOIN importancias i ON d.id_importancia = i.id
            WHERE d.estado = 'activo'
            LIMIT 1
        `;
        
        const testResult = await pool.query(testQuery);
        console.log('✅ Query completa funciona correctamente');
        console.log(`   - Documentos encontrados: ${testResult.rows.length}`);

        console.log('\n✅ TABLA DOCUMENTOS COMPLETADA EXITOSAMENTE');

    } catch (error) {
        console.error('❌ Error completando tabla:', error.message);
    } finally {
        await pool.end();
    }
}

// Ejecutar
completarTablaDocumentos();
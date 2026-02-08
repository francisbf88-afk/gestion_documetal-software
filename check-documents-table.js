const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'sgd',
    port: process.env.DB_PORT || 5432,
});

async function verificarTablaDocumentos() {
    console.log('🔍 VERIFICANDO ESTRUCTURA DE TABLA DOCUMENTOS');
    console.log('='.repeat(50));

    try {
        // 1. Verificar estructura de tabla documentos
        console.log('\n1. 📋 Estructura de tabla documentos:');
        const columnsResult = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'documentos' 
            ORDER BY ordinal_position;
        `);
        
        columnsResult.rows.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });

        // 2. Verificar si hay documentos
        console.log('\n2. 📄 Documentos existentes:');
        const docsResult = await pool.query('SELECT COUNT(*) as count FROM documentos');
        console.log(`   - Total documentos: ${docsResult.rows[0].count}`);

        // 3. Probar query que está fallando
        console.log('\n3. 🧪 Probando query de documentos...');
        try {
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
            console.log('✅ Query de documentos funciona correctamente');
            console.log(`   - Documentos encontrados: ${testResult.rows.length}`);
            
        } catch (error) {
            console.log('❌ Error en query de documentos:', error.message);
            
            // Verificar si falta la columna estado
            const hasEstado = columnsResult.rows.some(col => col.column_name === 'estado');
            if (!hasEstado) {
                console.log('\n🔧 Agregando columna estado faltante...');
                await pool.query(`
                    ALTER TABLE documentos 
                    ADD COLUMN estado VARCHAR(20) DEFAULT 'activo' 
                    CHECK (estado IN ('activo', 'archivado', 'eliminado'))
                `);
                console.log('✅ Columna estado agregada');
            }
        }

        // 4. Verificar foreign keys
        console.log('\n4. 🔗 Verificando foreign keys...');
        const fkResult = await pool.query(`
            SELECT 
                tc.constraint_name, 
                tc.table_name, 
                kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
                AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = tc.constraint_name
                AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' 
                AND tc.table_name = 'documentos';
        `);
        
        if (fkResult.rows.length > 0) {
            console.log('✅ Foreign keys encontradas:');
            fkResult.rows.forEach(fk => {
                console.log(`   - ${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
            });
        } else {
            console.log('⚠️ No se encontraron foreign keys, agregándolas...');
            
            try {
                await pool.query(`
                    ALTER TABLE documentos 
                    ADD CONSTRAINT fk_documentos_usuario 
                    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE;
                `);
                console.log('✅ FK usuarios agregada');
            } catch (error) {
                console.log('⚠️ FK usuarios ya existe o error:', error.message);
            }
            
            try {
                await pool.query(`
                    ALTER TABLE documentos 
                    ADD CONSTRAINT fk_documentos_tipo 
                    FOREIGN KEY (id_tipo_documento) REFERENCES tipos_documento(id) ON DELETE RESTRICT;
                `);
                console.log('✅ FK tipos_documento agregada');
            } catch (error) {
                console.log('⚠️ FK tipos_documento ya existe o error:', error.message);
            }
            
            try {
                await pool.query(`
                    ALTER TABLE documentos 
                    ADD CONSTRAINT fk_documentos_importancia 
                    FOREIGN KEY (id_importancia) REFERENCES importancias(id) ON DELETE RESTRICT;
                `);
                console.log('✅ FK importancias agregada');
            } catch (error) {
                console.log('⚠️ FK importancias ya existe o error:', error.message);
            }
        }

        console.log('\n✅ VERIFICACIÓN COMPLETADA');

    } catch (error) {
        console.error('❌ Error durante verificación:', error.message);
    } finally {
        await pool.end();
    }
}

// Ejecutar
verificarTablaDocumentos();
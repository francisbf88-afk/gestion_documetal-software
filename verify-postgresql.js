const { pool } = require('./backend/config/database');

async function verifyPostgreSQL() {
    console.log('🔍 Verificando instalación de PostgreSQL...');
    
    try {
        const client = await pool.connect();
        console.log('✅ Conexión establecida');
        
        // Verificar tablas
        const tablesResult = await client.query(`
            SELECT table_name, 
                   (SELECT COUNT(*) FROM information_schema.columns 
                    WHERE table_name = t.table_name AND table_schema = 'public') as column_count
            FROM information_schema.tables t
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        
        console.log('\n📋 Tablas en la base de datos:');
        tablesResult.rows.forEach(row => {
            console.log(`  ✓ ${row.table_name} (${row.column_count} columnas)`);
        });
        
        // Verificar índices
        const indexesResult = await client.query(`
            SELECT indexname, tablename 
            FROM pg_indexes 
            WHERE schemaname = 'public' 
            AND indexname NOT LIKE '%_pkey'
            ORDER BY tablename, indexname
        `);
        
        console.log(`\n🔍 Índices creados (${indexesResult.rows.length}):`);
        let currentTable = '';
        indexesResult.rows.forEach(row => {
            if (row.tablename !== currentTable) {
                console.log(`  📊 ${row.tablename}:`);
                currentTable = row.tablename;
            }
            console.log(`    - ${row.indexname}`);
        });
        
        // Verificar vistas
        const viewsResult = await client.query(`
            SELECT table_name 
            FROM information_schema.views 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        
        console.log(`\n👁️ Vistas creadas (${viewsResult.rows.length}):`);
        viewsResult.rows.forEach(row => {
            console.log(`  - ${row.table_name}`);
        });
        
        // Verificar funciones
        const functionsResult = await client.query(`
            SELECT routine_name, routine_type
            FROM information_schema.routines 
            WHERE routine_schema = 'public'
            ORDER BY routine_name
        `);
        
        console.log(`\n⚙️ Funciones creadas (${functionsResult.rows.length}):`);
        functionsResult.rows.forEach(row => {
            console.log(`  - ${row.routine_name} (${row.routine_type})`);
        });
        
        // Verificar datos
        console.log('\n📊 Conteo de registros:');
        const tables = ['usuarios', 'categorias', 'permisos', 'tipos_documento', 'importancias', 'roles_permisos'];
        
        for (const table of tables) {
            try {
                const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
                console.log(`  - ${table}: ${result.rows[0].count} registros`);
            } catch (error) {
                console.log(`  - ${table}: Error al contar`);
            }
        }
        
        // Probar una vista
        console.log('\n🧪 Probando vista v_documentos_completos...');
        const viewTest = await client.query('SELECT COUNT(*) FROM v_documentos_completos');
        console.log(`  ✓ Vista funciona correctamente: ${viewTest.rows[0].count} documentos`);
        
        // Probar una función
        console.log('\n🧪 Probando función get_tamaño_documentos_usuario...');
        const functionTest = await client.query('SELECT get_tamaño_documentos_usuario(1) as tamaño');
        console.log(`  ✓ Función funciona correctamente: ${functionTest.rows[0].tamaño} bytes`);
        
        client.release();
        
        console.log('\n🎉 ¡Verificación completada exitosamente!');
        console.log('✅ La base de datos PostgreSQL está lista para usar');
        
    } catch (error) {
        console.error('❌ Error durante la verificación:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Ejecutar verificación
verifyPostgreSQL();
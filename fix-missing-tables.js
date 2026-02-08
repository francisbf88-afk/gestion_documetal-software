const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'sgd',
    port: process.env.DB_PORT || 5432,
});

async function crearTablasFaltantes() {
    console.log('🔧 VERIFICANDO Y CREANDO TABLAS FALTANTES...');
    console.log('='.repeat(50));

    try {
        // 1. Verificar tablas existentes
        console.log('\n1. 📋 Verificando tablas existentes...');
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        
        const existingTables = tablesResult.rows.map(row => row.table_name);
        console.log('✅ Tablas existentes:', existingTables.join(', '));

        // 2. Crear tabla permisos si no existe
        if (!existingTables.includes('permisos')) {
            console.log('\n2. 🔐 Creando tabla permisos...');
            await pool.query(`
                CREATE TABLE permisos (
                    id SERIAL PRIMARY KEY,
                    nombre VARCHAR(50) NOT NULL UNIQUE,
                    descripcion TEXT,
                    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('✅ Tabla permisos creada');
        } else {
            console.log('\n2. ✅ Tabla permisos ya existe');
        }

        // 3. Crear tabla roles_permisos si no existe
        if (!existingTables.includes('roles_permisos')) {
            console.log('\n3. 🔗 Creando tabla roles_permisos...');
            await pool.query(`
                CREATE TABLE roles_permisos (
                    id SERIAL PRIMARY KEY,
                    rol VARCHAR(20) NOT NULL,
                    id_permiso INTEGER NOT NULL,
                    FOREIGN KEY (id_permiso) REFERENCES permisos(id) ON DELETE CASCADE,
                    UNIQUE(rol, id_permiso)
                );
            `);
            console.log('✅ Tabla roles_permisos creada');
        } else {
            console.log('\n3. ✅ Tabla roles_permisos ya existe');
        }

        // 4. Insertar permisos básicos si no existen
        console.log('\n4. 📝 Verificando permisos básicos...');
        const permisosResult = await pool.query('SELECT COUNT(*) as count FROM permisos');
        
        if (permisosResult.rows[0].count === '0') {
            console.log('📝 Insertando permisos básicos...');
            await pool.query(`
                INSERT INTO permisos (nombre, descripcion) VALUES 
                ('crear_documentos', 'Crear nuevos documentos'),
                ('leer_documentos', 'Ver documentos'),
                ('editar_documentos', 'Editar documentos existentes'),
                ('eliminar_documentos', 'Eliminar documentos'),
                ('descargar_documentos', 'Descargar documentos'),
                ('gestionar_usuarios', 'Administrar usuarios del sistema'),
                ('ver_reportes', 'Ver reportes y estadísticas'),
                ('configurar_sistema', 'Configurar parámetros del sistema');
            `);
            console.log('✅ Permisos básicos insertados');
        } else {
            console.log('✅ Permisos básicos ya existen');
        }

        // 5. Asignar permisos por rol si no existen
        console.log('\n5. 🔗 Verificando asignación de permisos por rol...');
        const rolesPermisosResult = await pool.query('SELECT COUNT(*) as count FROM roles_permisos');
        
        if (rolesPermisosResult.rows[0].count === '0') {
            console.log('🔗 Asignando permisos por rol...');
            await pool.query(`
                INSERT INTO roles_permisos (rol, id_permiso) VALUES 
                -- Admin: todos los permisos
                ('admin', 1), ('admin', 2), ('admin', 3), ('admin', 4), ('admin', 5), ('admin', 6), ('admin', 7), ('admin', 8),
                -- Editor: crear, leer, editar, descargar
                ('editor', 1), ('editor', 2), ('editor', 3), ('editor', 5),
                -- Asesor: solo leer y descargar
                ('asesor', 2), ('asesor', 5);
            `);
            console.log('✅ Permisos por rol asignados');
        } else {
            console.log('✅ Permisos por rol ya están asignados');
        }

        // 6. Verificar otras tablas necesarias
        const tablasNecesarias = [
            'tipos_documento',
            'importancias',
            'documentos',
            'documentos_permisos',
            'historial_documentos'
        ];

        console.log('\n6. 📋 Verificando otras tablas necesarias...');
        for (const tabla of tablasNecesarias) {
            if (!existingTables.includes(tabla)) {
                console.log(`⚠️ Tabla faltante: ${tabla}`);
            } else {
                console.log(`✅ Tabla ${tabla}: OK`);
            }
        }

        // 7. Crear tablas faltantes básicas
        if (!existingTables.includes('tipos_documento')) {
            console.log('\n📄 Creando tabla tipos_documento...');
            await pool.query(`
                CREATE TABLE tipos_documento (
                    id SERIAL PRIMARY KEY,
                    nombre VARCHAR(50) NOT NULL UNIQUE,
                    descripcion TEXT,
                    extensiones_permitidas TEXT[],
                    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            
            await pool.query(`
                INSERT INTO tipos_documento (nombre, descripcion, extensiones_permitidas) VALUES 
                ('Contrato', 'Documentos contractuales', ARRAY['pdf', 'docx', 'doc']),
                ('Informe', 'Informes y reportes', ARRAY['pdf', 'docx', 'doc', 'xlsx', 'xls']),
                ('Acta', 'Actas de reuniones', ARRAY['pdf', 'docx', 'doc']),
                ('Memorando', 'Memorandos internos', ARRAY['pdf', 'docx', 'doc']),
                ('Propuesta', 'Propuestas comerciales', ARRAY['pdf', 'docx', 'doc', 'pptx', 'ppt']),
                ('Otro', 'Otros tipos de documentos', ARRAY['txt', 'rtf', 'odt']);
            `);
            console.log('✅ Tabla tipos_documento creada e inicializada');
        }

        if (!existingTables.includes('importancias')) {
            console.log('\n📊 Creando tabla importancias...');
            await pool.query(`
                CREATE TABLE importancias (
                    id SERIAL PRIMARY KEY,
                    nivel VARCHAR(20) NOT NULL UNIQUE,
                    descripcion TEXT,
                    orden INTEGER NOT NULL,
                    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            
            await pool.query(`
                INSERT INTO importancias (nivel, descripcion, orden) VALUES 
                ('Alta', 'Documentos de alta prioridad', 1),
                ('Media', 'Documentos de prioridad media', 2),
                ('Baja', 'Documentos de baja prioridad', 3);
            `);
            console.log('✅ Tabla importancias creada e inicializada');
        }

        if (!existingTables.includes('documentos')) {
            console.log('\n📁 Creando tabla documentos...');
            await pool.query(`
                CREATE TABLE documentos (
                    id SERIAL PRIMARY KEY,
                    nombre_original VARCHAR(255) NOT NULL,
                    nombre_archivo VARCHAR(255) NOT NULL,
                    ruta VARCHAR(500) NOT NULL,
                    id_usuario INTEGER NOT NULL,
                    id_tipo_documento INTEGER NOT NULL,
                    id_importancia INTEGER NOT NULL,
                    formato VARCHAR(10) NOT NULL,
                    tamaño BIGINT NOT NULL,
                    mime_type VARCHAR(100),
                    es_publico BOOLEAN DEFAULT FALSE,
                    requiere_aprobacion BOOLEAN DEFAULT FALSE,
                    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'archivado', 'eliminado')),
                    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
                    FOREIGN KEY (id_tipo_documento) REFERENCES tipos_documento(id) ON DELETE RESTRICT,
                    FOREIGN KEY (id_importancia) REFERENCES importancias(id) ON DELETE RESTRICT
                );
            `);
            console.log('✅ Tabla documentos creada');
        }

        if (!existingTables.includes('documentos_permisos')) {
            console.log('\n🔐 Creando tabla documentos_permisos...');
            await pool.query(`
                CREATE TABLE documentos_permisos (
                    id SERIAL PRIMARY KEY,
                    id_documento INTEGER NOT NULL,
                    id_usuario INTEGER NOT NULL,
                    puede_leer BOOLEAN DEFAULT TRUE,
                    puede_editar BOOLEAN DEFAULT FALSE,
                    puede_eliminar BOOLEAN DEFAULT FALSE,
                    puede_descargar BOOLEAN DEFAULT TRUE,
                    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (id_documento) REFERENCES documentos(id) ON DELETE CASCADE,
                    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
                    UNIQUE(id_documento, id_usuario)
                );
            `);
            console.log('✅ Tabla documentos_permisos creada');
        }

        if (!existingTables.includes('historial_documentos')) {
            console.log('\n📜 Creando tabla historial_documentos...');
            await pool.query(`
                CREATE TABLE historial_documentos (
                    id SERIAL PRIMARY KEY,
                    id_documento INTEGER NOT NULL,
                    id_usuario INTEGER NOT NULL,
                    accion VARCHAR(50) NOT NULL,
                    descripcion TEXT,
                    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (id_documento) REFERENCES documentos(id) ON DELETE CASCADE,
                    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
                );
            `);
            console.log('✅ Tabla historial_documentos creada');
        }

        console.log('\n✅ TODAS LAS TABLAS VERIFICADAS Y CREADAS');
        
        // Verificación final
        const finalTablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        
        console.log('\n📋 TABLAS FINALES:');
        finalTablesResult.rows.forEach(row => {
            console.log(`   ✅ ${row.table_name}`);
        });

    } catch (error) {
        console.error('❌ Error creando tablas:', error.message);
    } finally {
        await pool.end();
    }
}

// Ejecutar
crearTablasFaltantes();
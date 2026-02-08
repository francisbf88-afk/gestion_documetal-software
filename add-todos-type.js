const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'sgd',
    port: process.env.DB_PORT || 5432
});

async function addTodosType() {
    try {
        console.log('🔄 Agregando tipo de documento "Todos"...');
        
        // Verificar si ya existe
        const existing = await pool.query(
            'SELECT id FROM tipos_documento WHERE nombre = $1',
            ['Todos']
        );
        
        if (existing.rows.length > 0) {
            console.log('⚠️  El tipo "Todos" ya existe');
            return;
        }
        
        // Agregar el tipo "Todos" con todas las extensiones permitidas
        const allExtensions = [
            // Documentos
            'pdf', 'docx', 'doc', 'txt', 'rtf', 'odt',
            // Hojas de cálculo
            'xlsx', 'xls', 'csv', 'ods',
            // Presentaciones
            'pptx', 'ppt', 'odp',
            // Imágenes
            'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg',
            // Bases de datos
            'accdb', 'mdb', 'db', 'sqlite',
            // Archivos comprimidos
            'zip', 'rar', '7z', 'tar', 'gz',
            // Audio
            'mp3', 'wav', 'ogg', 'flac',
            // Video
            'mp4', 'avi', 'mkv', 'mov', 'wmv',
            // Otros
            'json', 'xml', 'html', 'css', 'js', 'py', 'java', 'cpp', 'c'
        ];
        
        const result = await pool.query(
            'INSERT INTO tipos_documento (nombre, descripcion, extensiones_permitidas) VALUES ($1, $2, $3) RETURNING id',
            [
                'Todos',
                'Permite subir cualquier tipo de archivo sin restricciones de formato',
                allExtensions
            ]
        );
        
        console.log('✅ Tipo "Todos" agregado exitosamente');
        console.log(`📋 ID: ${result.rows[0].id}`);
        console.log(`📄 Extensiones permitidas: ${allExtensions.length} formatos`);
        console.log('💡 Este tipo permite subir archivos de cualquier formato en modo múltiple');
        
    } catch (error) {
        console.error('❌ Error agregando tipo "Todos":', error.message);
    } finally {
        await pool.end();
    }
}

addTodosType();
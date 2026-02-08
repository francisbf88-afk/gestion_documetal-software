const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la base de datos
// Railway proporciona DATABASE_URL, pero también soportamos variables individuales
const dbConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
} : {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'sgd',
    port: process.env.DB_PORT || 5432,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

const pool = new Pool(dbConfig);

// Función para probar la conexión
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Conexión a PostgreSQL establecida correctamente');
        client.release();
    } catch (error) {
        console.error('❌ Error conectando a PostgreSQL:', error.message);
        process.exit(1);
    }
};

module.exports = { pool, testConnection };
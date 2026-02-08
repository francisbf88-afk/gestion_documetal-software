const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const metadataRoutes = require('./routes/metadata');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos del frontend en producción
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/metadata', metadataRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Servir el frontend en producción
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
    });
}

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({ 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
const startServer = async () => {
    try {
        // Probar conexión a la base de datos
        await testConnection();
        
        const host = process.env.HOST || '0.0.0.0'; // Permitir conexiones externas
        
        app.listen(PORT, host, () => {
            console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
            console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API disponible en: http://${host}:${PORT}/api`);
            
            if (process.env.NODE_ENV !== 'production') {
                console.log(`🌐 Frontend disponible en: http://localhost:3000`);
                console.log(`🌍 Acceso remoto: http://<IP_DEL_SERVIDOR>:${PORT}/api`);
            }
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
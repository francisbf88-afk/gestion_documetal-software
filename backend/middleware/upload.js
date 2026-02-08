const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, '../uploads');
fs.ensureDirSync(uploadsDir);

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generar nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

// Tipos MIME permitidos y sus extensiones
const allowedMimeTypes = {
    // Documentos de texto
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/msword': '.doc',
    'application/pdf': '.pdf',
    'text/plain': '.txt',
    'application/rtf': '.rtf',
    'application/vnd.oasis.opendocument.text': '.odt',
    
    // Hojas de cálculo
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.ms-excel': '.xls',
    'text/csv': '.csv',
    'application/vnd.oasis.opendocument.spreadsheet': '.ods',
    
    // Presentaciones
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.oasis.opendocument.presentation': '.odp',
    
    // Imágenes
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/bmp': '.bmp',
    'image/webp': '.webp',
    'image/tiff': '.tiff',
    
    // Bases de datos
    'application/vnd.ms-access': '.accdb',
    'application/x-msaccess': '.mdb',
    'application/vnd.sqlite3': '.sqlite',
    'application/x-sqlite3': '.db',
    
    // Archivos comprimidos
    'application/zip': '.zip',
    'application/x-rar-compressed': '.rar',
    'application/x-7z-compressed': '.7z'
};

// Filtro de archivos permitidos
const fileFilter = (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype.toLowerCase();
    
    // Verificar por MIME type
    if (allowedMimeTypes[mimeType]) {
        return cb(null, true);
    }
    
    // Verificar por extensión como fallback
    const allowedExtensions = Object.values(allowedMimeTypes);
    if (allowedExtensions.includes(fileExtension)) {
        return cb(null, true);
    }
    
    // Lista de extensiones adicionales permitidas
    const additionalExtensions = ['.jpeg'];
    if (additionalExtensions.includes(fileExtension)) {
        return cb(null, true);
    }
    
    cb(new Error(`Tipo de archivo no permitido: ${fileExtension}. Tipos permitidos: ${allowedExtensions.join(', ')}`), false);
};

// Configuración de multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB máximo
    }
});

// Middleware para manejar errores de multer
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'El archivo es demasiado grande. Máximo 50MB.' });
        }
        return res.status(400).json({ message: 'Error al subir archivo: ' + error.message });
    } else if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
};

// Función para obtener el tipo de contenido basado en la extensión
const getContentType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
        '.pdf': 'application/pdf',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.doc': 'application/msword',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.xls': 'application/vnd.ms-excel',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.webp': 'image/webp',
        '.txt': 'text/plain',
        '.csv': 'text/csv',
        '.accdb': 'application/vnd.ms-access',
        '.mdb': 'application/x-msaccess',
        '.sqlite': 'application/vnd.sqlite3',
        '.db': 'application/x-sqlite3'
    };
    
    return contentTypes[ext] || 'application/octet-stream';
};

module.exports = { 
    upload, 
    handleUploadError, 
    getContentType,
    allowedMimeTypes 
};
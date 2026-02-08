const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const mammoth = require('mammoth');
const XLSX = require('xlsx');
const multer = require('multer');
const { pool } = require('../config/database');
const { verifyToken, isAdmin, hasPermission, hasDocumentPermission } = require('../middleware/auth');
const { upload, handleUploadError, getContentType } = require('../middleware/upload');

const router = express.Router();

// Función para registrar historial
const logDocumentAction = async (documentId, userId, action, description = null) => {
    try {
        await pool.query(
            'INSERT INTO historial_documentos (id_documento, id_usuario, accion, descripcion) VALUES ($1, $2, $3, $4)',
            [documentId, userId, action, description]
        );
    } catch (error) {
        console.error('Error registrando historial:', error);
    }
};

// Subir documento único (requiere permiso crear_documentos)
router.post('/upload', verifyToken, hasPermission('crear_documentos'), upload.single('document'), handleUploadError, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo' });
        }

        const { tipo_documento, importancia, categoria, es_publico = false } = req.body;

        if (!tipo_documento || !importancia || !categoria) {
            return res.status(400).json({ message: 'Tipo de documento, importancia y categoría son requeridos' });
        }

        // Verificar que el tipo de documento existe y permite esta extensión
        const tipos = await pool.query(
            'SELECT * FROM tipos_documento WHERE id = $1',
            [tipo_documento]
        );

        if (tipos.rows.length === 0) {
            return res.status(400).json({ message: 'Tipo de documento no válido' });
        }

        const tipoDoc = tipos.rows[0];
        const formato = path.extname(req.file.originalname).toLowerCase().substring(1);
        
        if (tipoDoc.extensiones_permitidas && tipoDoc.nombre !== 'Todos' && !tipoDoc.extensiones_permitidas.includes(formato)) {
            // Eliminar archivo subido si no es válido
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ 
                message: `Formato ${formato} no permitido para tipo ${tipoDoc.nombre}. Formatos permitidos: ${tipoDoc.extensiones_permitidas.join(', ')}` 
            });
        }

        // Verificar que la importancia existe
        const importancias = await pool.query(
            'SELECT id FROM importancias WHERE id = $1',
            [importancia]
        );

        if (importancias.rows.length === 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Importancia no válida' });
        }

        // Verificar que la categoría existe
        const categorias = await pool.query(
            'SELECT id FROM categorias WHERE id = $1',
            [categoria]
        );

        if (categorias.rows.length === 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Categoría no válida' });
        }

        const mimeType = getContentType(req.file.originalname);

        // Insertar documento en la base de datos
        const result = await pool.query(
            `INSERT INTO documentos 
             (nombre_original, nombre_archivo, ruta, id_usuario, id_tipo_documento, id_importancia, id_categoria, formato, tamaño, mime_type, es_publico) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
            [
                req.file.originalname,
                req.file.filename,
                req.file.path,
                req.user.id,
                tipo_documento,
                importancia,
                categoria,
                formato,
                req.file.size,
                mimeType,
                es_publico === 'true'
            ]
        );

        const documentId = result.rows[0].id;

        // Registrar en historial
        await logDocumentAction(documentId, req.user.id, 'creado', `Documento ${req.file.originalname} subido`);

        res.status(201).json({
            message: 'Documento subido exitosamente',
            documentId: documentId,
            filename: req.file.filename
        });

    } catch (error) {
        console.error('Error al subir documento:', error);
        // Limpiar archivo si hay error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Subir múltiples documentos (requiere permiso crear_documentos)
router.post('/upload-multiple', verifyToken, hasPermission('crear_documentos'), (req, res) => {
    // Configurar multer dinámicamente para manejar errores de campo
    const uploadMultiple = upload.array('documents', 10);
    
    uploadMultiple(req, res, async (err) => {
        // Manejar errores de multer específicamente
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({ 
                        message: 'Campo de archivo inesperado. Asegúrate de usar el nombre de campo "documents".',
                        error: err.message 
                    });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({ 
                        message: 'Demasiados archivos. Máximo 10 archivos permitidos.',
                        error: err.message 
                    });
                }
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ 
                        message: 'Archivo demasiado grande. Máximo 50MB por archivo.',
                        error: err.message 
                    });
                }
                return res.status(400).json({ 
                    message: 'Error al subir archivo: ' + err.message,
                    error: err.message 
                });
            }
            return res.status(400).json({ 
                message: 'Error al procesar archivos: ' + err.message,
                error: err.message 
            });
        }

        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No se han subido archivos' });
            }

            const { tipo_documento, importancia, categoria, es_publico = false } = req.body;

            if (!tipo_documento || !importancia || !categoria) {
                // Limpiar archivos subidos
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
                return res.status(400).json({ message: 'Tipo de documento, importancia y categoría son requeridos' });
            }

            // Verificar que el tipo de documento existe
            const tipos = await pool.query(
                'SELECT * FROM tipos_documento WHERE id = $1',
                [tipo_documento]
            );

            if (tipos.rows.length === 0) {
                // Limpiar archivos subidos
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
                return res.status(400).json({ message: 'Tipo de documento no válido' });
            }

            const tipoDoc = tipos.rows[0];

            // Verificar que la importancia existe
            const importancias = await pool.query(
                'SELECT id FROM importancias WHERE id = $1',
                [importancia]
            );

            if (importancias.rows.length === 0) {
                // Limpiar archivos subidos
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
                return res.status(400).json({ message: 'Importancia no válida' });
            }

            // Verificar que la categoría existe
            const categorias = await pool.query(
                'SELECT id FROM categorias WHERE id = $1',
                [categoria]
            );

            if (categorias.rows.length === 0) {
                // Limpiar archivos subidos
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
                return res.status(400).json({ message: 'Categoría no válida' });
            }

            const results = [];
            const errors = [];

            // Procesar cada archivo individualmente
            for (const file of req.files) {
                try {
                    const formato = path.extname(file.originalname).toLowerCase().substring(1);
                    
                    // Verificar formato permitido
                    if (tipoDoc.extensiones_permitidas && tipoDoc.nombre !== 'Todos' && !tipoDoc.extensiones_permitidas.includes(formato)) {
                        fs.unlinkSync(file.path);
                        errors.push({
                            filename: file.originalname,
                            error: `Formato ${formato} no permitido para tipo ${tipoDoc.nombre}. Formatos permitidos: ${tipoDoc.extensiones_permitidas.join(', ')}`
                        });
                        continue;
                    }

                    // Verificar tamaño del archivo
                    if (file.size > 50 * 1024 * 1024) {
                        fs.unlinkSync(file.path);
                        errors.push({
                            filename: file.originalname,
                            error: 'Archivo demasiado grande (máximo 50MB)'
                        });
                        continue;
                    }

                    const mimeType = getContentType(file.originalname);

                    // Insertar documento en la base de datos
                    const result = await pool.query(
                        `INSERT INTO documentos 
                         (nombre_original, nombre_archivo, ruta, id_usuario, id_tipo_documento, id_importancia, id_categoria, formato, tamaño, mime_type, es_publico) 
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
                        [
                            file.originalname,
                            file.filename,
                            file.path,
                            req.user.id,
                            tipo_documento,
                            importancia,
                            categoria,
                            formato,
                            file.size,
                            mimeType,
                            es_publico === 'true'
                        ]
                    );

                    const documentId = result.rows[0].id;

                    // Registrar en historial
                    await logDocumentAction(documentId, req.user.id, 'creado', `Documento ${file.originalname} subido (lote múltiple)`);

                    results.push({
                        filename: file.originalname,
                        documentId: documentId,
                        success: true
                    });

                } catch (error) {
                    console.error(`Error procesando archivo ${file.originalname}:`, error);
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                    errors.push({
                        filename: file.originalname,
                        error: `Error interno al procesar archivo: ${error.message}`
                    });
                }
            }

            const successCount = results.length;
            const errorCount = errors.length;

            // Responder con resultados detallados
            res.status(successCount > 0 ? 201 : 400).json({
                message: `Procesados ${successCount + errorCount} archivos. ${successCount} exitosos, ${errorCount} con errores.`,
                results: results,
                errors: errors,
                summary: {
                    total: successCount + errorCount,
                    successful: successCount,
                    failed: errorCount
                }
            });

        } catch (error) {
            console.error('Error al subir documentos múltiples:', error);
            // Limpiar archivos si hay error
            if (req.files) {
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            }
            res.status(500).json({ message: 'Error interno del servidor: ' + error.message });
        }
    });
});

// Listar documentos con filtros
router.get('/', verifyToken, hasPermission('leer_documentos'), async (req, res) => {
    try {
        const { tipo, importancia, formato, categoria, page = 1, limit = 10, search } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT d.*, u.nombre as usuario_nombre, t.nombre as tipo_nombre, i.nivel as importancia_nivel, c.nombre as categoria_nombre, c.color as categoria_color, c.icono as categoria_icono
            FROM documentos d
            JOIN usuarios u ON d.id_usuario = u.id
            JOIN tipos_documento t ON d.id_tipo_documento = t.id
            JOIN importancias i ON d.id_importancia = i.id
            LEFT JOIN categorias c ON d.id_categoria = c.id
            WHERE d.estado = 'activo'
        `;
        
        const params = [];
        let paramCount = 0;

        // Filtros de acceso por rol
        if (req.user.rol !== 'admin') {
            paramCount++;
            query += ` AND (d.es_publico = true OR d.id_usuario = $${paramCount}`;
            params.push(req.user.id);
            
            // Agregar documentos con permisos específicos
            paramCount++;
            query += ` OR EXISTS (
                SELECT 1 FROM documentos_permisos dp 
                WHERE dp.id_documento = d.id AND dp.id_usuario = $${paramCount} AND dp.puede_leer = true
            ))`;
            params.push(req.user.id);
        }

        if (categoria) {
            paramCount++;
            query += ` AND d.id_categoria = ${paramCount}`;
            params.push(categoria);
        }

        if (tipo) {
            paramCount++;
            query += ` AND d.id_tipo_documento = $${paramCount}`;
            params.push(tipo);
        }

        if (importancia) {
            paramCount++;
            query += ` AND d.id_importancia = $${paramCount}`;
            params.push(importancia);
        }

        if (formato) {
            paramCount++;
            query += ` AND d.formato = $${paramCount}`;
            params.push(formato);
        }

        if (search) {
            paramCount++;
            query += ` AND (d.nombre_original ILIKE $${paramCount} OR t.nombre ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        paramCount++;
        query += ` ORDER BY d.fecha_subida DESC LIMIT $${paramCount}`;
        params.push(parseInt(limit));
        
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(parseInt(offset));

        const documents = await pool.query(query, params);

        // Contar total de documentos para paginación
        let countQuery = `
            SELECT COUNT(*) as total
            FROM documentos d
            JOIN tipos_documento t ON d.id_tipo_documento = t.id
            WHERE d.estado = 'activo'
        `;
        
        const countParams = [];
        let countParamCount = 0;
        
        // Aplicar los mismos filtros de acceso
        if (req.user.rol !== 'admin') {
            countParamCount++;
            countQuery += ` AND (d.es_publico = true OR d.id_usuario = $${countParamCount}`;
            countParams.push(req.user.id);
            
            countParamCount++;
            countQuery += ` OR EXISTS (
                SELECT 1 FROM documentos_permisos dp 
                WHERE dp.id_documento = d.id AND dp.id_usuario = $${countParamCount} AND dp.puede_leer = true
            ))`;
            countParams.push(req.user.id);
        }

        if (categoria) {
            countParamCount++;
            countQuery += ` AND d.id_categoria = ${countParamCount}`;
            countParams.push(categoria);
        }
        if (tipo) {
            countParamCount++;
            countQuery += ` AND d.id_tipo_documento = $${countParamCount}`;
            countParams.push(tipo);
        }
        if (importancia) {
            countParamCount++;
            countQuery += ` AND d.id_importancia = $${countParamCount}`;
            countParams.push(importancia);
        }
        if (formato) {
            countParamCount++;
            countQuery += ` AND d.formato = $${countParamCount}`;
            countParams.push(formato);
        }
        if (search) {
            countParamCount++;
            countQuery += ` AND (d.nombre_original ILIKE $${countParamCount} OR t.nombre ILIKE $${countParamCount})`;
            countParams.push(`%${search}%`);
        }

        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].total);

        res.json({
            documents: documents.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error al listar documentos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Descargar documento
router.get('/:id/download', verifyToken, hasDocumentPermission('download'), async (req, res) => {
    try {
        const { id } = req.params;

        const documents = await pool.query(
            'SELECT * FROM documentos WHERE id = $1 AND estado = $2',
            [id, 'activo']
        );

        if (documents.rows.length === 0) {
            return res.status(404).json({ message: 'Documento no encontrado' });
        }

        const document = documents.rows[0];
        const filePath = document.ruta;

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
        }

        // Registrar descarga en historial
        await logDocumentAction(id, req.user.id, 'descargado');

        res.download(filePath, document.nombre_original);

    } catch (error) {
        console.error('Error al descargar documento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener contenido de documento para visualización/edición
router.get('/:id/content', verifyToken, hasDocumentPermission('read'), async (req, res) => {
    try {
        const { id } = req.params;

        const documents = await pool.query(
            `SELECT d.*, d.id_tipo_documento as tipo_documento, d.id_importancia as importancia
             FROM documentos d 
             WHERE d.id = $1 AND d.estado = $2`,
            [id, 'activo']
        );

        if (documents.rows.length === 0) {
            return res.status(404).json({ message: 'Documento no encontrado' });
        }

        const document = documents.rows[0];
        const filePath = document.ruta;

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
        }

        // Verificar permisos de edición
        let canEdit = false;
        if (req.user.rol === 'admin') {
            canEdit = true;
        } else {
            // Verificar permisos específicos del documento
            const permResult = await pool.query(
                'SELECT puede_editar FROM documentos_permisos WHERE id_documento = $1 AND id_usuario = $2',
                [id, req.user.id]
            );
            
            if (permResult.rows.length > 0) {
                canEdit = permResult.rows[0].puede_editar;
            } else {
                // Permisos por rol por defecto
                canEdit = ['editor'].includes(req.user.rol);
            }
        }

        // Procesar según el tipo de archivo
        if (document.formato === 'docx') {
            // Convertir DOCX a HTML
            const result = await mammoth.convertToHtml({ path: filePath });
            res.json({
                type: 'html',
                content: result.value,
                canEdit: canEdit,
                document: {
                    id: document.id,
                    nombre: document.nombre_original,
                    formato: document.formato,
                    tipo_documento: document.tipo_documento,
                    importancia: document.importancia
                }
            });
        } else if (['xlsx', 'xls'].includes(document.formato)) {
            // Convertir Excel a JSON
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            res.json({
                type: 'spreadsheet',
                content: jsonData,
                canEdit: canEdit,
                document: {
                    id: document.id,
                    nombre: document.nombre_original,
                    formato: document.formato,
                    tipo_documento: document.tipo_documento,
                    importancia: document.importancia
                }
            });
        } else if (document.formato === 'pdf') {
            // Para PDFs, devolver la URL para visualización
            res.json({
                type: 'pdf',
                content: `/api/documents/${id}/file`,
                canEdit: false, // PDFs no son editables
                document: {
                    id: document.id,
                    nombre: document.nombre_original,
                    formato: document.formato,
                    tipo_documento: document.tipo_documento,
                    importancia: document.importancia
                }
            });
        } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(document.formato)) {
            // Para imágenes, devolver la URL
            res.json({
                type: 'image',
                content: `/api/documents/${id}/file`,
                canEdit: false,
                document: {
                    id: document.id,
                    nombre: document.nombre_original,
                    formato: document.formato,
                    tipo_documento: document.tipo_documento,
                    importancia: document.importancia
                }
            });
        } else if (document.formato === 'txt') {
            // Para archivos de texto plano
            const textContent = fs.readFileSync(filePath, 'utf8');
            res.json({
                type: 'text',
                content: textContent,
                canEdit: canEdit,
                document: {
                    id: document.id,
                    nombre: document.nombre_original,
                    formato: document.formato,
                    tipo_documento: document.tipo_documento,
                    importancia: document.importancia
                }
            });
        } else {
            res.json({
                type: 'unsupported',
                content: null,
                canEdit: false,
                message: `Formato ${document.formato} no soportado para visualización en línea. Use la opción de descarga.`,
                document: {
                    id: document.id,
                    nombre: document.nombre_original,
                    formato: document.formato,
                    tipo_documento: document.tipo_documento,
                    importancia: document.importancia
                }
            });
        }

    } catch (error) {
        console.error('Error al obtener contenido del documento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Servir archivo directamente (para PDFs e imágenes)
router.get('/:id/file', verifyToken, hasDocumentPermission('read'), async (req, res) => {
    try {
        const { id } = req.params;

        const documents = await pool.query(
            'SELECT * FROM documentos WHERE id = $1 AND estado = $2',
            [id, 'activo']
        );

        if (documents.rows.length === 0) {
            return res.status(404).json({ message: 'Documento no encontrado' });
        }

        const document = documents.rows[0];
        const filePath = document.ruta;

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
        }

        // Establecer el tipo de contenido correcto
        res.setHeader('Content-Type', document.mime_type || getContentType(document.nombre_original));
        res.setHeader('Content-Disposition', `inline; filename="${document.nombre_original}"`);
        
        // Enviar el archivo
        res.sendFile(path.resolve(filePath));

    } catch (error) {
        console.error('Error al servir archivo:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Guardar cambios en documento
router.put('/:id/content', verifyToken, hasDocumentPermission('edit'), async (req, res) => {
    try {
        const { id } = req.params;
        const { content, type, tipo_documento, importancia } = req.body;

        const documents = await pool.query(
            'SELECT * FROM documentos WHERE id = $1 AND estado = $2',
            [id, 'activo']
        );

        if (documents.rows.length === 0) {
            return res.status(404).json({ message: 'Documento no encontrado' });
        }

        const document = documents.rows[0];
        const filePath = document.ruta;

        if (type === 'html' && document.formato === 'docx') {
            // Convertir HTML a DOCX (implementación básica)
            const htmlDocx = require('html-docx-js');
            const docxBuffer = htmlDocx.asBlob(content);
            
            fs.writeFileSync(filePath, docxBuffer);
            
        } else if (type === 'spreadsheet' && ['xlsx', 'xls'].includes(document.formato)) {
            // Convertir JSON a Excel
            const worksheet = XLSX.utils.aoa_to_sheet(content);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, filePath);
            
        } else if (type === 'text' && document.formato === 'txt') {
            // Guardar texto plano
            fs.writeFileSync(filePath, content, 'utf8');
            
        } else {
            return res.status(400).json({ message: 'Tipo de contenido no compatible con el formato del archivo' });
        }

        // Actualizar fecha de modificación y metadatos si se proporcionan
        let updateQuery = 'UPDATE documentos SET fecha_actualizacion = CURRENT_TIMESTAMP';
        let updateParams = [];
        let paramIndex = 1;

        if (tipo_documento) {
            updateQuery += `, id_tipo_documento = $${paramIndex}`;
            updateParams.push(tipo_documento);
            paramIndex++;
        }

        if (importancia) {
            updateQuery += `, id_importancia = $${paramIndex}`;
            updateParams.push(importancia);
            paramIndex++;
        }

        updateQuery += ` WHERE id = $${paramIndex}`;
        updateParams.push(id);

        await pool.query(updateQuery, updateParams);

        // Registrar en historial
        await logDocumentAction(id, req.user.id, 'editado', `Documento ${document.nombre_original} modificado`);

        res.json({ message: 'Documento actualizado exitosamente' });

    } catch (error) {
        console.error('Error al guardar documento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Eliminar documento
router.delete('/:id', verifyToken, hasDocumentPermission('delete'), async (req, res) => {
    try {
        const { id } = req.params;

        const documents = await pool.query(
            'SELECT * FROM documentos WHERE id = $1 AND estado = $2',
            [id, 'activo']
        );

        if (documents.rows.length === 0) {
            return res.status(404).json({ message: 'Documento no encontrado' });
        }

        const document = documents.rows[0];

        // Marcar como eliminado en lugar de eliminar físicamente
        await pool.query(
            'UPDATE documentos SET estado = $1 WHERE id = $2',
            ['eliminado', id]
        );

        // Registrar en historial
        await logDocumentAction(id, req.user.id, 'eliminado', `Documento ${document.nombre_original} eliminado`);

        res.json({ message: 'Documento eliminado exitosamente' });

    } catch (error) {
        console.error('Error al eliminar documento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener permisos de documento (solo admin)
router.get('/:id/permissions', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el documento existe
        const docResult = await pool.query('SELECT * FROM documentos WHERE id = $1', [id]);
        if (docResult.rows.length === 0) {
            return res.status(404).json({ message: 'Documento no encontrado' });
        }

        const document = docResult.rows[0];

        // Obtener permisos específicos del documento
        const permissionsResult = await pool.query(`
            SELECT dp.*, u.nombre as usuario_nombre, u.email as usuario_email, u.rol as usuario_rol
            FROM documentos_permisos dp
            JOIN usuarios u ON dp.id_usuario = u.id
            WHERE dp.id_documento = $1
            ORDER BY u.nombre
        `, [id]);

        res.json({
            permissions: permissionsResult.rows,
            isPublic: document.es_publico
        });

    } catch (error) {
        console.error('Error al obtener permisos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Actualizar permiso específico de usuario (solo admin)
router.put('/:id/permissions/:userId', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id, userId } = req.params;
        const { puede_leer = true, puede_editar = false, puede_eliminar = false, puede_descargar = true } = req.body;

        // Verificar que el documento existe
        const docResult = await pool.query('SELECT id FROM documentos WHERE id = $1', [id]);
        if (docResult.rows.length === 0) {
            return res.status(404).json({ message: 'Documento no encontrado' });
        }

        // Verificar que el usuario existe
        const userResult = await pool.query('SELECT id FROM usuarios WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar permisos
        await pool.query(`
            UPDATE documentos_permisos 
            SET puede_leer = $1, puede_editar = $2, puede_eliminar = $3, puede_descargar = $4
            WHERE id_documento = $5 AND id_usuario = $6
        `, [puede_leer, puede_editar, puede_eliminar, puede_descargar, id, userId]);

        res.json({ message: 'Permisos actualizados exitosamente' });

    } catch (error) {
        console.error('Error al actualizar permisos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Eliminar permiso específico de usuario (solo admin)
router.delete('/:id/permissions/:userId', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id, userId } = req.params;

        await pool.query('DELETE FROM documentos_permisos WHERE id_documento = $1 AND id_usuario = $2', [id, userId]);

        res.json({ message: 'Permiso eliminado exitosamente' });

    } catch (error) {
        console.error('Error al eliminar permiso:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Actualizar visibilidad del documento (solo admin)
router.put('/:id/visibility', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { es_publico } = req.body;

        // Verificar que el documento existe
        const docResult = await pool.query('SELECT id FROM documentos WHERE id = $1', [id]);
        if (docResult.rows.length === 0) {
            return res.status(404).json({ message: 'Documento no encontrado' });
        }

        // Actualizar visibilidad
        await pool.query('UPDATE documentos SET es_publico = $1 WHERE id = $2', [es_publico, id]);

        // Registrar en historial
        await logDocumentAction(id, req.user.id, 'visibilidad_cambiada', `Documento ${es_publico ? 'público' : 'privado'}`);

        res.json({ message: 'Visibilidad actualizada exitosamente' });

    } catch (error) {
        console.error('Error al actualizar visibilidad:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Gestionar permisos de documento (solo admin)
router.post('/:id/permissions', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { id_usuario, puede_leer = true, puede_editar = false, puede_eliminar = false, puede_descargar = true } = req.body;

        // Verificar que el documento existe
        const docResult = await pool.query('SELECT id FROM documentos WHERE id = $1', [id]);
        if (docResult.rows.length === 0) {
            return res.status(404).json({ message: 'Documento no encontrado' });
        }

        // Verificar que el usuario existe
        const userResult = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id_usuario]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Insertar o actualizar permisos
        await pool.query(`
            INSERT INTO documentos_permisos (id_documento, id_usuario, puede_leer, puede_editar, puede_eliminar, puede_descargar)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id_documento, id_usuario) 
            DO UPDATE SET 
                puede_leer = EXCLUDED.puede_leer,
                puede_editar = EXCLUDED.puede_editar,
                puede_eliminar = EXCLUDED.puede_eliminar,
                puede_descargar = EXCLUDED.puede_descargar
        `, [id, id_usuario, puede_leer, puede_editar, puede_eliminar, puede_descargar]);

        res.json({ message: 'Permisos actualizados exitosamente' });

    } catch (error) {
        console.error('Error al gestionar permisos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Abrir documento en editor externo
router.post('/:id/open-external', verifyToken, hasDocumentPermission('read'), async (req, res) => {
    try {
        const { id } = req.params;
        const { exec } = require('child_process');
        const os = require('os');

        const documents = await pool.query(
            'SELECT * FROM documentos WHERE id = $1 AND estado = $2',
            [id, 'activo']
        );

        if (documents.rows.length === 0) {
            return res.status(404).json({ message: 'Documento no encontrado' });
        }

        const document = documents.rows[0];
        const filePath = document.ruta;

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
        }

        // Verificar que el formato es compatible con editores externos
        const supportedFormats = ['doc', 'docx', 'pdf', 'xlsx', 'xls', 'csv', 'txt', 'rtf'];
        if (!supportedFormats.includes(document.formato.toLowerCase())) {
            return res.status(400).json({ 
                message: `Formato ${document.formato} no soportado para apertura en editor externo` 
            });
        }

        // Determinar el comando según el sistema operativo
        let command;
        const platform = os.platform();
        const absolutePath = path.resolve(filePath);

        switch (platform) {
            case 'win32':
                // Windows - usar start para abrir con la aplicación predeterminada
                command = `start "" "${absolutePath}"`;
                break;
            case 'darwin':
                // macOS - usar open
                command = `open "${absolutePath}"`;
                break;
            case 'linux':
                // Linux - usar xdg-open
                command = `xdg-open "${absolutePath}"`;
                break;
            default:
                return res.status(400).json({ 
                    message: `Sistema operativo ${platform} no soportado para apertura externa` 
                });
        }

        // Ejecutar el comando
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error al abrir archivo externo:', error);
                return res.status(500).json({ 
                    message: 'Error al abrir el archivo en editor externo',
                    details: error.message 
                });
            }

            // Registrar la acción en el historial
            logDocumentAction(id, req.user.id, 'abierto_externo', `Documento ${document.nombre_original} abierto en editor externo`);
        });

        res.json({ 
            message: 'Documento abierto en editor externo exitosamente',
            filename: document.nombre_original,
            format: document.formato
        });

    } catch (error) {
        console.error('Error al abrir documento en editor externo:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener historial de documento (solo admin)
router.get('/:id/history', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const history = await pool.query(`
            SELECT h.*, u.nombre as usuario_nombre
            FROM historial_documentos h
            JOIN usuarios u ON h.id_usuario = u.id
            WHERE h.id_documento = $1
            ORDER BY h.fecha_accion DESC
        `, [id]);

        res.json(history.rows);

    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
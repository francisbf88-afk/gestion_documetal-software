const express = require('express');
const { pool } = require('../config/database');
const { verifyToken, isAdmin, hasPermission } = require('../middleware/auth');

const router = express.Router();

// Obtener todas las categorías (disponible para todos los usuarios autenticados)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { includeInactive = false } = req.query;
        
        let query = `
            SELECT c.*, 
                   COUNT(d.id) as total_documentos,
                   COUNT(CASE WHEN d.estado = 'activo' THEN 1 END) as documentos_activos
            FROM categorias c
            LEFT JOIN documentos d ON c.id = d.id_categoria
        `;
        
        const params = [];
        
        if (!includeInactive || includeInactive === 'false') {
            query += ' WHERE c.activa = true';
        }
        
        query += `
            GROUP BY c.id, c.nombre, c.descripcion, c.color, c.icono, c.orden, c.activa, c.fecha_creacion, c.fecha_actualizacion
            ORDER BY c.orden ASC, c.nombre ASC
        `;

        const result = await pool.query(query, params);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener una categoría específica
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(`
            SELECT c.*, 
                   COUNT(d.id) as total_documentos,
                   COUNT(CASE WHEN d.estado = 'activo' THEN 1 END) as documentos_activos
            FROM categorias c
            LEFT JOIN documentos d ON c.id = d.id_categoria
            WHERE c.id = $1
            GROUP BY c.id, c.nombre, c.descripcion, c.color, c.icono, c.orden, c.activa, c.fecha_creacion, c.fecha_actualizacion
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Crear nueva categoría (solo admin)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { nombre, descripcion, color = '#2196F3', icono = '📁', orden = 0 } = req.body;
        
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
        }
        
        // Verificar que el nombre no exista
        const existingCategory = await pool.query(
            'SELECT id FROM categorias WHERE LOWER(nombre) = LOWER($1)',
            [nombre.trim()]
        );
        
        if (existingCategory.rows.length > 0) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        }
        
        // Validar color hexadecimal
        const colorRegex = /^#[0-9A-F]{6}$/i;
        if (color && !colorRegex.test(color)) {
            return res.status(400).json({ message: 'El color debe ser un código hexadecimal válido (ej: #FF0000)' });
        }
        
        const result = await pool.query(`
            INSERT INTO categorias (nombre, descripcion, color, icono, orden)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [nombre.trim(), descripcion?.trim() || null, color, icono, parseInt(orden) || 0]);
        
        res.status(201).json({
            message: 'Categoría creada exitosamente',
            categoria: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        if (error.code === '23505') { // Unique violation
            res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        } else {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
});

// Actualizar categoría (solo admin)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, color, icono, orden, activa } = req.body;
        
        // Verificar que la categoría existe
        const existingCategory = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
        if (existingCategory.rows.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        
        // Verificar que el nombre no esté en uso por otra categoría
        if (nombre && nombre.trim() !== '') {
            const duplicateCheck = await pool.query(
                'SELECT id FROM categorias WHERE LOWER(nombre) = LOWER($1) AND id != $2',
                [nombre.trim(), id]
            );
            
            if (duplicateCheck.rows.length > 0) {
                return res.status(400).json({ message: 'Ya existe otra categoría con ese nombre' });
            }
        }
        
        // Validar color si se proporciona
        if (color) {
            const colorRegex = /^#[0-9A-F]{6}$/i;
            if (!colorRegex.test(color)) {
                return res.status(400).json({ message: 'El color debe ser un código hexadecimal válido (ej: #FF0000)' });
            }
        }
        
        // Construir query de actualización dinámicamente
        const updates = [];
        const values = [];
        let paramIndex = 1;
        
        if (nombre !== undefined && nombre.trim() !== '') {
            updates.push(`nombre = $${paramIndex}`);
            values.push(nombre.trim());
            paramIndex++;
        }
        
        if (descripcion !== undefined) {
            updates.push(`descripcion = $${paramIndex}`);
            values.push(descripcion?.trim() || null);
            paramIndex++;
        }
        
        if (color !== undefined) {
            updates.push(`color = $${paramIndex}`);
            values.push(color);
            paramIndex++;
        }
        
        if (icono !== undefined) {
            updates.push(`icono = $${paramIndex}`);
            values.push(icono);
            paramIndex++;
        }
        
        if (orden !== undefined) {
            updates.push(`orden = $${paramIndex}`);
            values.push(parseInt(orden) || 0);
            paramIndex++;
        }
        
        if (activa !== undefined) {
            updates.push(`activa = $${paramIndex}`);
            values.push(Boolean(activa));
            paramIndex++;
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
        }
        
        values.push(id);
        const query = `
            UPDATE categorias 
            SET ${updates.join(', ')}, fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = $${paramIndex}
            RETURNING *
        `;
        
        const result = await pool.query(query, values);
        
        res.json({
            message: 'Categoría actualizada exitosamente',
            categoria: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        if (error.code === '23505') { // Unique violation
            res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        } else {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
});

// Eliminar categoría (solo admin)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { moveToCategory } = req.body; // ID de categoría destino para mover documentos
        
        // Verificar que la categoría existe
        const existingCategory = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
        if (existingCategory.rows.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        
        // Verificar si hay documentos en esta categoría
        const documentsCount = await pool.query(
            'SELECT COUNT(*) as count FROM documentos WHERE id_categoria = $1 AND estado = $2',
            [id, 'activo']
        );
        
        const totalDocuments = parseInt(documentsCount.rows[0].count);
        
        if (totalDocuments > 0) {
            if (moveToCategory) {
                // Verificar que la categoría destino existe
                const targetCategory = await pool.query('SELECT id FROM categorias WHERE id = $1', [moveToCategory]);
                if (targetCategory.rows.length === 0) {
                    return res.status(400).json({ message: 'La categoría destino no existe' });
                }
                
                // Mover documentos a la nueva categoría
                await pool.query(
                    'UPDATE documentos SET id_categoria = $1 WHERE id_categoria = $2',
                    [moveToCategory, id]
                );
            } else {
                // Mover documentos a "Archivo General"
                const archivoGeneral = await pool.query(
                    'SELECT id FROM categorias WHERE nombre = $1',
                    ['Archivo General']
                );
                
                if (archivoGeneral.rows.length > 0) {
                    await pool.query(
                        'UPDATE documentos SET id_categoria = $1 WHERE id_categoria = $2',
                        [archivoGeneral.rows[0].id, id]
                    );
                } else {
                    // Si no existe "Archivo General", establecer como NULL
                    await pool.query(
                        'UPDATE documentos SET id_categoria = NULL WHERE id_categoria = $1',
                        [id]
                    );
                }
            }
        }
        
        // Eliminar la categoría
        await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
        
        res.json({
            message: `Categoría eliminada exitosamente. ${totalDocuments} documento(s) fueron reasignados.`,
            documentsReassigned: totalDocuments
        });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener documentos por categoría
router.get('/:id/documents', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10, search } = req.query;
        const offset = (page - 1) * limit;
        
        // Verificar que la categoría existe
        const categoryCheck = await pool.query('SELECT nombre FROM categorias WHERE id = $1', [id]);
        if (categoryCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        
        let query = `
            SELECT d.*, u.nombre as usuario_nombre, t.nombre as tipo_nombre, i.nivel as importancia_nivel, c.nombre as categoria_nombre
            FROM documentos d
            JOIN usuarios u ON d.id_usuario = u.id
            JOIN tipos_documento t ON d.id_tipo_documento = t.id
            JOIN importancias i ON d.id_importancia = i.id
            LEFT JOIN categorias c ON d.id_categoria = c.id
            WHERE d.estado = 'activo' AND d.id_categoria = $1
        `;
        
        const params = [id];
        let paramCount = 1;
        
        // Filtros de acceso por rol
        if (req.user.rol !== 'admin') {
            paramCount++;
            query += ` AND (d.es_publico = true OR d.id_usuario = $${paramCount}`;
            params.push(req.user.id);
            
            paramCount++;
            query += ` OR EXISTS (
                SELECT 1 FROM documentos_permisos dp 
                WHERE dp.id_documento = d.id AND dp.id_usuario = $${paramCount} AND dp.puede_leer = true
            ))`;
            params.push(req.user.id);
        }
        
        if (search) {
            paramCount++;
            query += ` AND (d.nombre_original ILIKE $${paramCount} OR t.nombre ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }
        
        paramCount++;
        query += ` ORDER BY d.nombre_original ASC LIMIT $${paramCount}`;
        params.push(parseInt(limit));
        
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(parseInt(offset));
        
        const documents = await pool.query(query, params);
        
        // Contar total para paginación
        let countQuery = `
            SELECT COUNT(*) as total
            FROM documentos d
            WHERE d.estado = 'activo' AND d.id_categoria = $1
        `;
        const countParams = [id];
        let countParamCount = 1;
        
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
        
        if (search) {
            countParamCount++;
            countQuery += ` AND (d.nombre_original ILIKE $${countParamCount} OR t.nombre ILIKE $${countParamCount})`;
            countParams.push(`%${search}%`);
        }
        
        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].total);
        
        res.json({
            categoria: categoryCheck.rows[0].nombre,
            documents: documents.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error al obtener documentos por categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener documentos de una categoría específica
router.get('/:id/documents', verifyToken, hasPermission('leer_documentos'), async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        // Verificar que la categoría existe
        const categoryResult = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
        if (categoryResult.rows.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        const category = categoryResult.rows[0];

        // Obtener documentos de la categoría con filtros de acceso
        let query = `
            SELECT d.*, u.nombre as usuario_nombre, t.nombre as tipo_nombre, i.nivel as importancia_nivel
            FROM documentos d
            JOIN usuarios u ON d.id_usuario = u.id
            JOIN tipos_documento t ON d.id_tipo_documento = t.id
            JOIN importancias i ON d.id_importancia = i.id
            WHERE d.id_categoria = $1 AND d.estado = 'activo'
        `;
        
        const params = [id];
        let paramCount = 1;

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

        paramCount++;
        query += ` ORDER BY d.fecha_subida DESC LIMIT $${paramCount}`;
        params.push(parseInt(limit));
        
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(parseInt(offset));

        const documents = await pool.query(query, params);

        // Contar total de documentos
        let countQuery = `
            SELECT COUNT(*) as total
            FROM documentos d
            WHERE d.id_categoria = $1 AND d.estado = 'activo'
        `;
        
        const countParams = [id];
        let countParamCount = 1;
        
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

        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].total);

        res.json({
            category: category,
            documents: documents.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error al obtener documentos de categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Mover documento a otra categoría (solo admin y propietario)
router.put('/:categoryId/documents/:documentId/move', verifyToken, async (req, res) => {
    try {
        const { categoryId, documentId } = req.params;
        const { newCategoryId } = req.body;

        if (!newCategoryId) {
            return res.status(400).json({ message: 'Nueva categoría es requerida' });
        }

        // Verificar que el documento existe
        const docResult = await pool.query('SELECT * FROM documentos WHERE id = $1 AND estado = $2', [documentId, 'activo']);
        if (docResult.rows.length === 0) {
            return res.status(404).json({ message: 'Documento no encontrado' });
        }

        const document = docResult.rows[0];

        // Verificar permisos (admin o propietario del documento)
        if (req.user.rol !== 'admin' && document.id_usuario !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permisos para mover este documento' });
        }

        // Verificar que las categorías existen
        const [oldCategoryResult, newCategoryResult] = await Promise.all([
            pool.query('SELECT nombre FROM categorias WHERE id = $1', [categoryId]),
            pool.query('SELECT nombre FROM categorias WHERE id = $1', [newCategoryId])
        ]);

        if (oldCategoryResult.rows.length === 0) {
            return res.status(404).json({ message: 'Categoría origen no encontrada' });
        }

        if (newCategoryResult.rows.length === 0) {
            return res.status(404).json({ message: 'Categoría destino no encontrada' });
        }

        // Mover el documento
        await pool.query('UPDATE documentos SET id_categoria = $1 WHERE id = $2', [newCategoryId, documentId]);

        // Registrar en historial si existe la función
        try {
            await pool.query(
                'INSERT INTO historial_documentos (id_documento, id_usuario, accion, descripcion) VALUES ($1, $2, $3, $4)',
                [documentId, req.user.id, 'movido', `Documento movido de "${oldCategoryResult.rows[0].nombre}" a "${newCategoryResult.rows[0].nombre}"`]
            );
        } catch (historyError) {
            console.warn('No se pudo registrar en historial:', historyError.message);
        }

        res.json({ 
            message: 'Documento movido exitosamente',
            oldCategory: oldCategoryResult.rows[0].nombre,
            newCategory: newCategoryResult.rows[0].nombre
        });

    } catch (error) {
        console.error('Error al mover documento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
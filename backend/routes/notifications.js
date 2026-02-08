const express = require('express');
const { Pool } = require('pg');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Configuración de la base de datos
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'sgd',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5432,
});

// Obtener todas las notificaciones del usuario (con paginación)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, unread_only = false } = req.query;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT 
                n.id,
                n.tipo,
                n.titulo,
                n.mensaje,
                n.leida,
                n.fecha_creacion,
                n.fecha_lectura,
                u.nombre as usuario_origen,
                u.rol as rol_origen,
                d.nombre_original as documento_nombre,
                d.id as documento_id
            FROM notificaciones n
            LEFT JOIN usuarios u ON n.id_usuario_origen = u.id
            LEFT JOIN documentos d ON n.id_documento = d.id
            WHERE n.id_usuario_destinatario = $1
        `;
        
        const params = [req.user.id];
        
        if (unread_only === 'true') {
            query += ' AND n.leida = FALSE';
        }
        
        query += ' ORDER BY n.fecha_creacion DESC LIMIT $2 OFFSET $3';
        params.push(limit, offset);
        
        const result = await pool.query(query, params);
        
        // Obtener el total de notificaciones
        let countQuery = `
            SELECT COUNT(*) as total 
            FROM notificaciones 
            WHERE id_usuario_destinatario = $1
        `;
        const countParams = [req.user.id];
        
        if (unread_only === 'true') {
            countQuery += ' AND leida = FALSE';
        }
        
        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].total);
        
        res.json({
            notificaciones: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener contador de notificaciones no leídas
router.get('/unread-count', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT COUNT(*) as count FROM notificaciones WHERE id_usuario_destinatario = $1 AND leida = FALSE',
            [req.user.id]
        );
        
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (error) {
        console.error('Error al obtener contador de notificaciones:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Marcar notificación como leída
router.put('/:id/read', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            `UPDATE notificaciones 
             SET leida = TRUE, fecha_lectura = CURRENT_TIMESTAMP 
             WHERE id = $1 AND id_usuario_destinatario = $2 
             RETURNING *`,
            [id, req.user.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }
        
        res.json({ 
            message: 'Notificación marcada como leída',
            notificacion: result.rows[0]
        });
    } catch (error) {
        console.error('Error al marcar notificación como leída:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Marcar todas las notificaciones como leídas
router.put('/read-all', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE notificaciones 
             SET leida = TRUE, fecha_lectura = CURRENT_TIMESTAMP 
             WHERE id_usuario_destinatario = $1 AND leida = FALSE 
             RETURNING id`,
            [req.user.id]
        );
        
        res.json({ 
            message: 'Todas las notificaciones marcadas como leídas',
            count: result.rows.length
        });
    } catch (error) {
        console.error('Error al marcar todas las notificaciones como leídas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Eliminar notificación
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM notificaciones WHERE id = $1 AND id_usuario_destinatario = $2 RETURNING *',
            [id, req.user.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }
        
        res.json({ message: 'Notificación eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar notificación:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Crear notificación manual (solo para admins)
router.post('/', verifyToken, async (req, res) => {
    try {
        // Verificar que el usuario sea admin
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para crear notificaciones' });
        }
        
        const { 
            id_usuario_destinatario, 
            tipo, 
            titulo, 
            mensaje, 
            id_documento = null 
        } = req.body;
        
        if (!id_usuario_destinatario || !tipo || !titulo || !mensaje) {
            return res.status(400).json({ 
                message: 'Faltan campos requeridos: id_usuario_destinatario, tipo, titulo, mensaje' 
            });
        }
        
        const result = await pool.query(
            `INSERT INTO notificaciones (
                id_usuario_destinatario, 
                id_usuario_origen, 
                id_documento, 
                tipo, 
                titulo, 
                mensaje
            ) VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [id_usuario_destinatario, req.user.id, id_documento, tipo, titulo, mensaje]
        );
        
        res.status(201).json({
            message: 'Notificación creada correctamente',
            notificacion: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear notificación:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener estadísticas de notificaciones (solo para admins)
router.get('/stats', verifyToken, async (req, res) => {
    try {
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para ver estadísticas' });
        }
        
        const stats = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN leida = FALSE THEN 1 END) as no_leidas,
                COUNT(CASE WHEN tipo = 'documento_editado' THEN 1 END) as editados,
                COUNT(CASE WHEN tipo = 'documento_creado' THEN 1 END) as creados,
                COUNT(CASE WHEN tipo = 'documento_eliminado' THEN 1 END) as eliminados,
                COUNT(CASE WHEN fecha_creacion >= CURRENT_DATE THEN 1 END) as hoy
            FROM notificaciones
        `);
        
        res.json(stats.rows[0]);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
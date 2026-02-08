const express = require('express');
const { pool } = require('../config/database');
const { verifyToken, isAdmin, isAnyRole } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los tipos de documento
router.get('/tipos-documento', verifyToken, isAnyRole, async (req, res) => {
    try {
        const tipos = await pool.query(
            'SELECT * FROM tipos_documento ORDER BY nombre'
        );
        res.json(tipos.rows);
    } catch (error) {
        console.error('Error al obtener tipos de documento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Crear nuevo tipo de documento (solo admin)
router.post('/tipos-documento', verifyToken, isAdmin, async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre es requerido' });
        }

        const result = await pool.query(
            'INSERT INTO tipos_documento (nombre, descripcion) VALUES ($1, $2) RETURNING id',
            [nombre, descripcion || null]
        );

        res.status(201).json({
            message: 'Tipo de documento creado exitosamente',
            id: result.rows[0].id
        });

    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ message: 'Ya existe un tipo de documento con ese nombre' });
        }
        console.error('Error al crear tipo de documento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Actualizar tipo de documento (solo admin)
router.put('/tipos-documento/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre es requerido' });
        }

        const result = await pool.query(
            'UPDATE tipos_documento SET nombre = $1, descripcion = $2 WHERE id = $3',
            [nombre, descripcion || null, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Tipo de documento no encontrado' });
        }

        res.json({ message: 'Tipo de documento actualizado exitosamente' });

    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ message: 'Ya existe un tipo de documento con ese nombre' });
        }
        console.error('Error al actualizar tipo de documento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Eliminar tipo de documento (solo admin)
router.delete('/tipos-documento/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si hay documentos usando este tipo
        const documents = await pool.query(
            'SELECT COUNT(*) as count FROM documentos WHERE id_tipo_documento = $1',
            [id]
        );

        if (parseInt(documents.rows[0].count) > 0) {
            return res.status(400).json({ 
                message: 'No se puede eliminar el tipo de documento porque hay documentos que lo utilizan' 
            });
        }

        const result = await pool.query(
            'DELETE FROM tipos_documento WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Tipo de documento no encontrado' });
        }

        res.json({ message: 'Tipo de documento eliminado exitosamente' });

    } catch (error) {
        console.error('Error al eliminar tipo de documento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener todas las importancias
router.get('/importancias', verifyToken, isAnyRole, async (req, res) => {
    try {
        const importancias = await pool.query(
            'SELECT * FROM importancias ORDER BY orden'
        );
        res.json(importancias.rows);
    } catch (error) {
        console.error('Error al obtener importancias:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Crear nueva importancia (solo admin)
router.post('/importancias', verifyToken, isAdmin, async (req, res) => {
    try {
        const { nivel, descripcion, orden } = req.body;

        if (!nivel || !orden) {
            return res.status(400).json({ message: 'El nivel y orden son requeridos' });
        }

        const result = await pool.query(
            'INSERT INTO importancias (nivel, descripcion, orden) VALUES ($1, $2, $3) RETURNING id',
            [nivel, descripcion || null, orden]
        );

        res.status(201).json({
            message: 'Importancia creada exitosamente',
            id: result.rows[0].id
        });

    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ message: 'Ya existe una importancia con ese nivel' });
        }
        console.error('Error al crear importancia:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Actualizar importancia (solo admin)
router.put('/importancias/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { nivel, descripcion, orden } = req.body;

        if (!nivel || !orden) {
            return res.status(400).json({ message: 'El nivel y orden son requeridos' });
        }

        const result = await pool.query(
            'UPDATE importancias SET nivel = $1, descripcion = $2, orden = $3 WHERE id = $4',
            [nivel, descripcion || null, orden, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Importancia no encontrada' });
        }

        res.json({ message: 'Importancia actualizada exitosamente' });

    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ message: 'Ya existe una importancia con ese nivel' });
        }
        console.error('Error al actualizar importancia:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Eliminar importancia (solo admin)
router.delete('/importancias/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si hay documentos usando esta importancia
        const documents = await pool.query(
            'SELECT COUNT(*) as count FROM documentos WHERE id_importancia = $1',
            [id]
        );

        if (parseInt(documents.rows[0].count) > 0) {
            return res.status(400).json({ 
                message: 'No se puede eliminar la importancia porque hay documentos que la utilizan' 
            });
        }

        const result = await pool.query(
            'DELETE FROM importancias WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Importancia no encontrada' });
        }

        res.json({ message: 'Importancia eliminada exitosamente' });

    } catch (error) {
        console.error('Error al eliminar importancia:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener estadísticas del sistema (solo admin)
router.get('/estadisticas', verifyToken, isAdmin, async (req, res) => {
    try {
        // Total de documentos
        const totalDocs = await pool.query('SELECT COUNT(*) as total FROM documentos');
        
        // Documentos por tipo
        const docsPorTipo = await pool.query(`
            SELECT t.nombre, COUNT(d.id) as cantidad
            FROM tipos_documento t
            LEFT JOIN documentos d ON t.id = d.id_tipo_documento
            GROUP BY t.id, t.nombre
            ORDER BY cantidad DESC
        `);
        
        // Documentos por importancia
        const docsPorImportancia = await pool.query(`
            SELECT i.nivel, COUNT(d.id) as cantidad
            FROM importancias i
            LEFT JOIN documentos d ON i.id = d.id_importancia
            GROUP BY i.id, i.nivel, i.orden
            ORDER BY i.orden
        `);
        
        // Total de usuarios
        const totalUsers = await pool.query('SELECT COUNT(*) as total FROM usuarios');
        
        // Usuarios por rol
        const usersPorRol = await pool.query(`
            SELECT rol, COUNT(*) as cantidad
            FROM usuarios
            GROUP BY rol
        `);

        res.json({
            totalDocumentos: parseInt(totalDocs.rows[0].total),
            totalUsuarios: parseInt(totalUsers.rows[0].total),
            documentosPorTipo: docsPorTipo.rows,
            documentosPorImportancia: docsPorImportancia.rows,
            usuariosPorRol: usersPorRol.rows
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
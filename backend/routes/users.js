const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { verifyToken, isAdmin, hasPermission } = require('../middleware/auth');

const router = express.Router();

// Listar usuarios para selección en permisos (solo admin)
router.get('/for-permissions', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await pool.query(`
            SELECT id, nombre, username, email, rol
            FROM usuarios
            WHERE activo = true AND rol != 'admin'
            ORDER BY nombre
        `);

        res.json(users.rows);

    } catch (error) {
        console.error('Error al listar usuarios para permisos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Listar usuarios (solo admin)
router.get('/', verifyToken, hasPermission('gestionar_usuarios'), async (req, res) => {
    try {
        const { page = 1, limit = 10, search, rol } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT id, nombre, username, email, rol, activo, fecha_creacion, fecha_actualizacion
            FROM usuarios
            WHERE 1=1
        `;
        
        const params = [];
        let paramCount = 0;

        if (search) {
            paramCount++;
            query += ` AND (nombre ILIKE $${paramCount} OR username ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        if (rol) {
            paramCount++;
            query += ` AND rol = $${paramCount}`;
            params.push(rol);
        }

        paramCount++;
        query += ` ORDER BY fecha_creacion DESC LIMIT $${paramCount}`;
        params.push(parseInt(limit));
        
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(parseInt(offset));

        const users = await pool.query(query, params);

        // Contar total de usuarios para paginación
        let countQuery = `SELECT COUNT(*) as total FROM usuarios WHERE 1=1`;
        const countParams = [];
        let countParamCount = 0;
        
        if (search) {
            countParamCount++;
            countQuery += ` AND (nombre ILIKE $${countParamCount} OR username ILIKE $${countParamCount} OR email ILIKE $${countParamCount})`;
            countParams.push(`%${search}%`);
        }
        if (rol) {
            countParamCount++;
            countQuery += ` AND rol = $${countParamCount}`;
            countParams.push(rol);
        }

        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].total);

        res.json({
            users: users.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error al listar usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener usuario por ID (solo admin)
router.get('/:id', verifyToken, hasPermission('gestionar_usuarios'), async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT id, nombre, username, email, rol, activo, fecha_creacion, fecha_actualizacion FROM usuarios WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Crear usuario (solo admin)
router.post('/', verifyToken, hasPermission('gestionar_usuarios'), async (req, res) => {
    try {
        const { nombre, username, email, password, rol } = req.body;

        if (!nombre || !username || !password || !rol) {
            return res.status(400).json({ message: 'Nombre, username, contraseña y rol son requeridos' });
        }

        // Validar rol
        const validRoles = ['admin', 'editor', 'asesor'];
        if (!validRoles.includes(rol)) {
            return res.status(400).json({ message: 'Rol no válido' });
        }

        // Verificar que el username no exista
        const existingUser = await pool.query(
            'SELECT id FROM usuarios WHERE username = $1',
            [username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'El nombre de usuario ya existe' });
        }

        // Verificar que el email no exista (si se proporciona)
        if (email) {
            const existingEmail = await pool.query(
                'SELECT id FROM usuarios WHERE email = $1',
                [email]
            );

            if (existingEmail.rows.length > 0) {
                return res.status(400).json({ message: 'El email ya está registrado' });
            }
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, username, email, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, username, email, rol, fecha_creacion',
            [nombre, username, email || null, hashedPassword, rol]
        );

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Actualizar usuario (solo admin)
router.put('/:id', verifyToken, hasPermission('gestionar_usuarios'), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, username, email, rol, activo } = req.body;

        // Verificar que el usuario existe
        const existingUser = await pool.query(
            'SELECT id FROM usuarios WHERE id = $1',
            [id]
        );

        if (existingUser.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Validar rol si se proporciona
        if (rol) {
            const validRoles = ['admin', 'editor', 'asesor'];
            if (!validRoles.includes(rol)) {
                return res.status(400).json({ message: 'Rol no válido' });
            }
        }

        // Verificar que el username no exista en otro usuario
        if (username) {
            const existingUsername = await pool.query(
                'SELECT id FROM usuarios WHERE username = $1 AND id != $2',
                [username, id]
            );

            if (existingUsername.rows.length > 0) {
                return res.status(400).json({ message: 'El nombre de usuario ya existe' });
            }
        }

        // Verificar que el email no exista en otro usuario
        if (email) {
            const existingEmail = await pool.query(
                'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
                [email, id]
            );

            if (existingEmail.rows.length > 0) {
                return res.status(400).json({ message: 'El email ya está registrado' });
            }
        }

        // Construir query de actualización dinámicamente
        const updates = [];
        const values = [];
        let paramCount = 0;

        if (nombre !== undefined) {
            paramCount++;
            updates.push(`nombre = $${paramCount}`);
            values.push(nombre);
        }
        if (username !== undefined) {
            paramCount++;
            updates.push(`username = $${paramCount}`);
            values.push(username);
        }
        if (email !== undefined) {
            paramCount++;
            updates.push(`email = $${paramCount}`);
            values.push(email);
        }
        if (rol !== undefined) {
            paramCount++;
            updates.push(`rol = $${paramCount}`);
            values.push(rol);
        }
        if (activo !== undefined) {
            paramCount++;
            updates.push(`activo = $${paramCount}`);
            values.push(activo);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No hay campos para actualizar' });
        }

        paramCount++;
        values.push(id);

        const query = `
            UPDATE usuarios 
            SET ${updates.join(', ')} 
            WHERE id = $${paramCount} 
            RETURNING id, nombre, username, email, rol, activo, fecha_actualizacion
        `;

        const result = await pool.query(query, values);

        res.json({
            message: 'Usuario actualizado exitosamente',
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Cambiar contraseña (solo admin)
router.put('/:id/password', verifyToken, hasPermission('gestionar_usuarios'), async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'La contraseña es requerida' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Verificar que el usuario existe
        const existingUser = await pool.query(
            'SELECT id FROM usuarios WHERE id = $1',
            [id]
        );

        if (existingUser.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Encriptar nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Actualizar contraseña
        await pool.query(
            'UPDATE usuarios SET password = $1 WHERE id = $2',
            [hashedPassword, id]
        );

        res.json({ message: 'Contraseña actualizada exitosamente' });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Cambiar propia contraseña (cualquier usuario autenticado)
router.put('/me/password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Contraseña actual y nueva contraseña son requeridas' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
        }

        // Obtener usuario actual con contraseña
        const userResult = await pool.query(
            'SELECT id, password FROM usuarios WHERE id = $1',
            [req.user.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = userResult.rows[0];

        // Verificar contraseña actual
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
        }

        // Encriptar nueva contraseña
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar contraseña
        await pool.query(
            'UPDATE usuarios SET password = $1 WHERE id = $2',
            [hashedNewPassword, req.user.id]
        );

        res.json({ message: 'Contraseña actualizada exitosamente' });

    } catch (error) {
        console.error('Error al cambiar propia contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Desactivar usuario (soft delete)
router.delete('/:id', verifyToken, hasPermission('gestionar_usuarios'), async (req, res) => {
    try {
        const { id } = req.params;

        // No permitir eliminar al propio usuario
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ message: 'No puedes desactivar tu propia cuenta' });
        }

        // Verificar que el usuario existe
        const existingUser = await pool.query(
            'SELECT id FROM usuarios WHERE id = $1',
            [id]
        );

        if (existingUser.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Desactivar usuario
        await pool.query(
            'UPDATE usuarios SET activo = false WHERE id = $1',
            [id]
        );

        res.json({ message: 'Usuario desactivado exitosamente' });

    } catch (error) {
        console.error('Error al desactivar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener permisos de un usuario
router.get('/:id/permissions', verifyToken, hasPermission('gestionar_usuarios'), async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener permisos por rol
        const permissions = await pool.query(`
            SELECT p.nombre, p.descripcion
            FROM usuarios u
            JOIN roles_permisos rp ON u.rol = rp.rol
            JOIN permisos p ON rp.id_permiso = p.id
            WHERE u.id = $1
        `, [id]);

        res.json(permissions.rows);

    } catch (error) {
        console.error('Error al obtener permisos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener estadísticas de usuarios
router.get('/stats/overview', verifyToken, hasPermission('gestionar_usuarios'), async (req, res) => {
    try {
        const stats = await pool.query(`
            SELECT 
                COUNT(*) as total_usuarios,
                COUNT(*) FILTER (WHERE activo = true) as usuarios_activos,
                COUNT(*) FILTER (WHERE rol = 'admin') as administradores,
                COUNT(*) FILTER (WHERE rol = 'editor') as editores,
                COUNT(*) FILTER (WHERE rol = 'asesor') as asesores
            FROM usuarios
        `);

        res.json(stats.rows[0]);

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
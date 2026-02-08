const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Registro de usuario (solo para admin)
router.post('/register', verifyToken, async (req, res) => {
    try {
        // Solo admin puede registrar usuarios
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ message: 'Solo los administradores pueden registrar usuarios' });
        }

        const { nombre, username, email, password, rol } = req.body;

        // Validaciones
        if (!nombre || !username || !password || !rol) {
            return res.status(400).json({ message: 'Nombre, username, contraseña y rol son requeridos' });
        }

        if (!['admin', 'asesor', 'editor'].includes(rol)) {
            return res.status(400).json({ message: 'Rol no válido' });
        }

        // Verificar si el username ya existe
        const existingUsers = await pool.query(
            'SELECT id FROM usuarios WHERE username = $1',
            [username]
        );

        if (existingUsers.rows.length > 0) {
            return res.status(400).json({ message: 'El nombre de usuario ya está registrado' });
        }

        // Verificar si el email ya existe (si se proporciona)
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

        // Insertar usuario
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, username, email, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [nombre, username, email || null, hashedPassword, rol]
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            userId: result.rows[0].id
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos' });
        }

        // Buscar usuario por username
        const users = await pool.query(
            'SELECT id, nombre, username, email, password, rol FROM usuarios WHERE username = $1',
            [username]
        );

        if (users.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = users.rows[0];

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username, rol: user.rol },
            process.env.JWT_SECRET || 'secreto_jwt',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                username: user.username,
                email: user.email,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener perfil del usuario actual
router.get('/profile', verifyToken, (req, res) => {
    res.json({
        user: {
            id: req.user.id,
            nombre: req.user.nombre,
            username: req.user.username,
            email: req.user.email,
            rol: req.user.rol
        }
    });
});

// Cambiar contraseña
router.put('/change-password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Contraseña actual y nueva son requeridas' });
        }

        // Obtener contraseña actual del usuario
        const users = await pool.query(
            'SELECT password FROM usuarios WHERE id = $1',
            [req.user.id]
        );

        if (users.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar contraseña actual
        const isValidPassword = await bcrypt.compare(currentPassword, users.rows[0].password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Contraseña actual incorrecta' });
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
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
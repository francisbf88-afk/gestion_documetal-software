const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Middleware para verificar token JWT
const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Token de acceso requerido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_jwt');
        
        // Verificar que el usuario aún existe y está activo
        const result = await pool.query(
            'SELECT id, nombre, username, email, rol, activo FROM usuarios WHERE id = $1',
            [decoded.userId]
        );

        if (result.rows.length === 0 || !result.rows[0].activo) {
            return res.status(401).json({ message: 'Usuario no válido o inactivo' });
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token no válido' });
    }
};

// Middleware para verificar permisos específicos
const hasPermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            const userRole = req.user.rol;
            
            // Verificar si el rol tiene el permiso
            const permissionResult = await pool.query(`
                SELECT rp.* FROM roles_permisos rp
                JOIN permisos p ON rp.id_permiso = p.id
                WHERE rp.rol = $1 AND p.nombre = $2
            `, [userRole, permissionName]);

            if (permissionResult.rows.length === 0) {
                return res.status(403).json({ 
                    message: `No tienes permisos para: ${permissionName}` 
                });
            }

            next();
        } catch (error) {
            console.error('Error verificando permisos:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    };
};

// Middleware para verificar permisos específicos de documento
const hasDocumentPermission = (action) => {
    return async (req, res, next) => {
        try {
            const documentId = req.params.id;
            const userId = req.user.id;
            const userRole = req.user.rol;

            // Los admins tienen todos los permisos
            if (userRole === 'admin') {
                return next();
            }

            // Verificar permisos específicos del documento
            const permissionResult = await pool.query(`
                SELECT * FROM documentos_permisos 
                WHERE id_documento = $1 AND id_usuario = $2
            `, [documentId, userId]);

            if (permissionResult.rows.length > 0) {
                const perms = permissionResult.rows[0];
                
                switch (action) {
                    case 'read':
                        if (!perms.puede_leer) {
                            return res.status(403).json({ message: 'No tienes permisos para leer este documento' });
                        }
                        break;
                    case 'edit':
                        if (!perms.puede_editar) {
                            return res.status(403).json({ message: 'No tienes permisos para editar este documento' });
                        }
                        break;
                    case 'delete':
                        if (!perms.puede_eliminar) {
                            return res.status(403).json({ message: 'No tienes permisos para eliminar este documento' });
                        }
                        break;
                    case 'download':
                        if (!perms.puede_descargar) {
                            return res.status(403).json({ message: 'No tienes permisos para descargar este documento' });
                        }
                        break;
                }
            } else {
                // Si no hay permisos específicos, usar permisos por rol
                const rolePermissions = {
                    'editor': ['read', 'edit', 'download'],
                    'asesor': ['read', 'download']
                };

                if (!rolePermissions[userRole] || !rolePermissions[userRole].includes(action)) {
                    return res.status(403).json({ 
                        message: `No tienes permisos para ${action} este documento` 
                    });
                }
            }

            next();
        } catch (error) {
            console.error('Error verificando permisos de documento:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    };
};

// Middleware para verificar roles específicos
const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ message: 'No tienes permisos para esta acción' });
        }

        next();
    };
};

// Middleware específicos por rol
const isAdmin = verifyRole(['admin']);
const isAdminOrEditor = verifyRole(['admin', 'editor']);
const isAnyRole = verifyRole(['admin', 'asesor', 'editor']);

module.exports = {
    verifyToken,
    verifyRole,
    hasPermission,
    hasDocumentPermission,
    isAdmin,
    isAdminOrEditor,
    isAnyRole
};
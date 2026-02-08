-- Script para crear usuario administrador inicial
-- Ejecutar después de las migraciones

-- Verificar si el usuario admin ya existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE username = 'admin') THEN
        -- Crear usuario admin
        -- Contraseña: admin123 (hasheada con bcrypt)
        INSERT INTO usuarios (nombre, username, email, password, rol)
        VALUES (
            'Administrador',
            'admin',
            'admin@sistema.com',
            '$2a$10$YourHashedPasswordHere',
            'admin'
        );
        RAISE NOTICE 'Usuario admin creado exitosamente';
    ELSE
        RAISE NOTICE 'Usuario admin ya existe';
    END IF;
END $$;

-- Crear usuarios de prueba adicionales
DO $$
BEGIN
    -- Editor
    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE username = 'editor') THEN
        INSERT INTO usuarios (nombre, username, email, password, rol)
        VALUES (
            'Editor',
            'editor',
            'editor@sistema.com',
            '$2a$10$YourHashedPasswordHere',
            'editor'
        );
        RAISE NOTICE 'Usuario editor creado exitosamente';
    END IF;

    -- Asesor
    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE username = 'asesor') THEN
        INSERT INTO usuarios (nombre, username, email, password, rol)
        VALUES (
            'Asesor',
            'asesor',
            'asesor@sistema.com',
            '$2a$10$YourHashedPasswordHere',
            'asesor'
        );
        RAISE NOTICE 'Usuario asesor creado exitosamente';
    END IF;
END $$;

-- Mostrar usuarios creados
SELECT id, nombre, username, rol, created_at 
FROM usuarios 
ORDER BY id;

-- Tabla de notificaciones
CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    id_usuario_destinatario INTEGER NOT NULL, -- Usuario que recibe la notificación (admin)
    id_usuario_origen INTEGER NOT NULL, -- Usuario que realizó la acción
    id_documento INTEGER, -- Documento relacionado (opcional)
    tipo VARCHAR(50) NOT NULL, -- 'documento_editado', 'documento_creado', 'documento_eliminado'
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP,
    FOREIGN KEY (id_usuario_destinatario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_origen) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_documento) REFERENCES documentos(id) ON DELETE SET NULL
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_notificaciones_destinatario ON notificaciones(id_usuario_destinatario);
CREATE INDEX idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX idx_notificaciones_fecha ON notificaciones(fecha_creacion);

-- Función para crear notificación automática cuando un no-admin modifica un documento
CREATE OR REPLACE FUNCTION crear_notificacion_modificacion()
RETURNS TRIGGER AS $$
DECLARE
    usuario_rol VARCHAR(20);
    admin_id INTEGER;
    usuario_nombre VARCHAR(100);
    documento_nombre VARCHAR(255);
BEGIN
    -- Obtener el rol del usuario que realizó la acción
    SELECT rol, nombre INTO usuario_rol, usuario_nombre 
    FROM usuarios 
    WHERE id = NEW.id_usuario;
    
    -- Solo crear notificación si el usuario NO es admin
    IF usuario_rol != 'admin' THEN
        -- Obtener nombre del documento
        SELECT nombre_original INTO documento_nombre 
        FROM documentos 
        WHERE id = NEW.id_documento;
        
        -- Obtener todos los administradores
        FOR admin_id IN 
            SELECT id FROM usuarios WHERE rol = 'admin' AND activo = TRUE
        LOOP
            -- Crear notificación para cada administrador
            INSERT INTO notificaciones (
                id_usuario_destinatario,
                id_usuario_origen,
                id_documento,
                tipo,
                titulo,
                mensaje
            ) VALUES (
                admin_id,
                NEW.id_usuario,
                NEW.id_documento,
                CASE 
                    WHEN NEW.accion = 'editado' THEN 'documento_editado'
                    WHEN NEW.accion = 'creado' THEN 'documento_creado'
                    WHEN NEW.accion = 'eliminado' THEN 'documento_eliminado'
                    ELSE 'documento_modificado'
                END,
                CASE 
                    WHEN NEW.accion = 'editado' THEN 'Documento editado por ' || usuario_nombre
                    WHEN NEW.accion = 'creado' THEN 'Nuevo documento creado por ' || usuario_nombre
                    WHEN NEW.accion = 'eliminado' THEN 'Documento eliminado por ' || usuario_nombre
                    ELSE 'Documento modificado por ' || usuario_nombre
                END,
                CASE 
                    WHEN NEW.accion = 'editado' THEN 'El usuario ' || usuario_nombre || ' (' || usuario_rol || ') ha editado el documento "' || documento_nombre || '"'
                    WHEN NEW.accion = 'creado' THEN 'El usuario ' || usuario_nombre || ' (' || usuario_rol || ') ha creado el documento "' || documento_nombre || '"'
                    WHEN NEW.accion = 'eliminado' THEN 'El usuario ' || usuario_nombre || ' (' || usuario_rol || ') ha eliminado el documento "' || documento_nombre || '"'
                    ELSE 'El usuario ' || usuario_nombre || ' (' || usuario_rol || ') ha modificado el documento "' || documento_nombre || '"'
                END
            );
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para crear notificaciones automáticamente
CREATE TRIGGER trigger_notificacion_modificacion
    AFTER INSERT ON historial_documentos
    FOR EACH ROW
    EXECUTE FUNCTION crear_notificacion_modificacion();

-- Función para marcar notificación como leída
CREATE OR REPLACE FUNCTION marcar_notificacion_leida(notif_id INTEGER, usuario_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE notificaciones 
    SET leida = TRUE, fecha_lectura = CURRENT_TIMESTAMP
    WHERE id = notif_id AND id_usuario_destinatario = usuario_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener notificaciones no leídas de un usuario
CREATE OR REPLACE FUNCTION obtener_notificaciones_no_leidas(usuario_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    tipo VARCHAR(50),
    titulo VARCHAR(255),
    mensaje TEXT,
    fecha_creacion TIMESTAMP,
    usuario_origen VARCHAR(100),
    documento_nombre VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.tipo,
        n.titulo,
        n.mensaje,
        n.fecha_creacion,
        u.nombre as usuario_origen,
        d.nombre_original as documento_nombre
    FROM notificaciones n
    LEFT JOIN usuarios u ON n.id_usuario_origen = u.id
    LEFT JOIN documentos d ON n.id_documento = d.id
    WHERE n.id_usuario_destinatario = usuario_id 
    AND n.leida = FALSE
    ORDER BY n.fecha_creacion DESC;
END;
$$ LANGUAGE plpgsql;
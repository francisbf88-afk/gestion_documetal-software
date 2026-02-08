-- ============================================================================
-- SCHEMA COMPLETO DE POSTGRESQL - SISTEMA DE GESTIÓN DOCUMENTAL
-- ============================================================================
-- Base de datos: sgd (Sistema de Gestión Documental)
-- Versión: 1.0
-- Fecha: 2024
-- ============================================================================

-- ============================================================================
-- 1. TABLA: USUARIOS
-- ============================================================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('admin', 'asesor', 'editor')) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_activo ON usuarios(activo);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_username ON usuarios(username);

-- ============================================================================
-- 2. TABLA: PERMISOS
-- ============================================================================
CREATE TABLE permisos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. TABLA: ROLES_PERMISOS (Relación N:M)
-- ============================================================================
CREATE TABLE roles_permisos (
    id SERIAL PRIMARY KEY,
    rol VARCHAR(20) NOT NULL,
    id_permiso INTEGER NOT NULL,
    FOREIGN KEY (id_permiso) REFERENCES permisos(id) ON DELETE CASCADE,
    UNIQUE(rol, id_permiso)
);

-- Índices para roles_permisos
CREATE INDEX idx_roles_permisos_rol ON roles_permisos(rol);
CREATE INDEX idx_roles_permisos_permiso ON roles_permisos(id_permiso);

-- ============================================================================
-- 4. TABLA: TIPOS_DOCUMENTO
-- ============================================================================
CREATE TABLE tipos_documento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    extensiones_permitidas TEXT[],
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para tipos_documento
CREATE INDEX idx_tipos_documento_nombre ON tipos_documento(nombre);

-- ============================================================================
-- 5. TABLA: IMPORTANCIAS
-- ============================================================================
CREATE TABLE importancias (
    id SERIAL PRIMARY KEY,
    nivel VARCHAR(20) NOT NULL UNIQUE,
    descripcion TEXT,
    orden INTEGER NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para importancias
CREATE INDEX idx_importancias_orden ON importancias(orden);

-- ============================================================================
-- 6. TABLA: CATEGORÍAS
-- ============================================================================
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#2196F3',
    icono VARCHAR(50) DEFAULT '📁',
    orden INTEGER DEFAULT 0,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para categorias
CREATE INDEX idx_categorias_activa ON categorias(activa);
CREATE INDEX idx_categorias_orden ON categorias(orden);
CREATE INDEX idx_categorias_nombre ON categorias(nombre);

-- ============================================================================
-- 7. TABLA: DOCUMENTOS (Principal)
-- ============================================================================
CREATE TABLE documentos (
    id SERIAL PRIMARY KEY,
    nombre_original VARCHAR(255) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta VARCHAR(500) NOT NULL,
    id_usuario INTEGER NOT NULL,
    id_tipo_documento INTEGER NOT NULL,
    id_importancia INTEGER NOT NULL,
    id_categoria INTEGER,
    formato VARCHAR(10) NOT NULL,
    tamaño BIGINT NOT NULL,
    mime_type VARCHAR(100),
    es_publico BOOLEAN DEFAULT FALSE,
    requiere_aprobacion BOOLEAN DEFAULT FALSE,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'archivado', 'eliminado')),
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_documento) REFERENCES tipos_documento(id) ON DELETE RESTRICT,
    FOREIGN KEY (id_importancia) REFERENCES importancias(id) ON DELETE RESTRICT,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE SET NULL
);

-- Índices para documentos
CREATE INDEX idx_documentos_usuario ON documentos(id_usuario);
CREATE INDEX idx_documentos_tipo ON documentos(id_tipo_documento);
CREATE INDEX idx_documentos_importancia ON documentos(id_importancia);
CREATE INDEX idx_documentos_categoria ON documentos(id_categoria);
CREATE INDEX idx_documentos_estado ON documentos(estado);
CREATE INDEX idx_documentos_fecha_subida ON documentos(fecha_subida);
CREATE INDEX idx_documentos_es_publico ON documentos(es_publico);

-- ============================================================================
-- 8. TABLA: DOCUMENTOS_PERMISOS (Permisos Granulares)
-- ============================================================================
CREATE TABLE documentos_permisos (
    id SERIAL PRIMARY KEY,
    id_documento INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    puede_leer BOOLEAN DEFAULT TRUE,
    puede_editar BOOLEAN DEFAULT FALSE,
    puede_eliminar BOOLEAN DEFAULT FALSE,
    puede_descargar BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_documento) REFERENCES documentos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE(id_documento, id_usuario)
);

-- Índices para documentos_permisos
CREATE INDEX idx_documentos_permisos_documento ON documentos_permisos(id_documento);
CREATE INDEX idx_documentos_permisos_usuario ON documentos_permisos(id_usuario);

-- ============================================================================
-- 9. TABLA: HISTORIAL_DOCUMENTOS (Auditoría)
-- ============================================================================
CREATE TABLE historial_documentos (
    id SERIAL PRIMARY KEY,
    id_documento INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    accion VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_documento) REFERENCES documentos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices para historial_documentos
CREATE INDEX idx_historial_documento ON historial_documentos(id_documento);
CREATE INDEX idx_historial_usuario ON historial_documentos(id_usuario);
CREATE INDEX idx_historial_fecha ON historial_documentos(fecha_accion);
CREATE INDEX idx_historial_accion ON historial_documentos(accion);

-- ============================================================================
-- 10. FUNCIÓN: Actualizar fecha_actualizacion automáticamente
-- ============================================================================
CREATE OR REPLACE FUNCTION update_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 11. TRIGGERS: Actualizar fecha_actualizacion
-- ============================================================================
CREATE TRIGGER update_usuarios_fecha_actualizacion
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion();

CREATE TRIGGER update_documentos_fecha_actualizacion
    BEFORE UPDATE ON documentos
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion();

CREATE TRIGGER update_categorias_fecha_actualizacion
    BEFORE UPDATE ON categorias
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion();

-- ============================================================================
-- 12. DATOS INICIALES: PERMISOS
-- ============================================================================
INSERT INTO permisos (nombre, descripcion) VALUES 
('crear_documentos', 'Crear nuevos documentos'),
('leer_documentos', 'Ver documentos'),
('editar_documentos', 'Editar documentos existentes'),
('eliminar_documentos', 'Eliminar documentos'),
('descargar_documentos', 'Descargar documentos'),
('gestionar_usuarios', 'Administrar usuarios del sistema'),
('ver_reportes', 'Ver reportes y estadísticas'),
('configurar_sistema', 'Configurar parámetros del sistema');

-- ============================================================================
-- 13. DATOS INICIALES: ROLES_PERMISOS
-- ============================================================================
-- Admin: todos los permisos
INSERT INTO roles_permisos (rol, id_permiso) VALUES 
('admin', 1), ('admin', 2), ('admin', 3), ('admin', 4), 
('admin', 5), ('admin', 6), ('admin', 7), ('admin', 8);

-- Editor: crear, leer, editar, descargar
INSERT INTO roles_permisos (rol, id_permiso) VALUES 
('editor', 1), ('editor', 2), ('editor', 3), ('editor', 5);

-- Asesor: solo leer y descargar
INSERT INTO roles_permisos (rol, id_permiso) VALUES 
('asesor', 2), ('asesor', 5);

-- ============================================================================
-- 14. DATOS INICIALES: USUARIOS
-- ============================================================================
-- Contraseñas encriptadas con bcrypt (10 rounds)
-- admin123 -> $2a$10$o40pKc0QrOSFUBsJdd6beOdFjbKHdIUpSH9TknW3CzSYEIjvc0ejG
-- asesor123 -> $2a$10$0oJ8P5uPm7kTL9lZT.i7ieBoRNMf5cO2nJF1HU89Yk.hSzhCkHlbq
-- editor123 -> $2a$10$o4l32oGWPehzzSjOXr8VQeOtN5ipJbpHhiJ2r.6.h9/QsUCmmvyMG

INSERT INTO usuarios (nombre, username, email, password, rol) VALUES 
('Administrador', 'admin', 'admin@sistema.com', '$2a$10$o40pKc0QrOSFUBsJdd6beOdFjbKHdIUpSH9TknW3CzSYEIjvc0ejG', 'admin'),
('Asesor Demo', 'asesor', 'asesor@sistema.com', '$2a$10$0oJ8P5uPm7kTL9lZT.i7ieBoRNMf5cO2nJF1HU89Yk.hSzhCkHlbq', 'asesor'),
('Editor Demo', 'editor', 'editor@sistema.com', '$2a$10$o4l32oGWPehzzSjOXr8VQeOtN5ipJbpHhiJ2r.6.h9/QsUCmmvyMG', 'editor');

-- ============================================================================
-- 15. DATOS INICIALES: TIPOS_DOCUMENTO
-- ============================================================================
INSERT INTO tipos_documento (nombre, descripcion, extensiones_permitidas) VALUES 
('Contrato', 'Documentos contractuales', ARRAY['pdf', 'docx', 'doc']),
('Informe', 'Informes y reportes', ARRAY['pdf', 'docx', 'doc', 'xlsx', 'xls']),
('Acta', 'Actas de reuniones', ARRAY['pdf', 'docx', 'doc']),
('Memorando', 'Memorandos internos', ARRAY['pdf', 'docx', 'doc']),
('Propuesta', 'Propuestas comerciales', ARRAY['pdf', 'docx', 'doc', 'pptx', 'ppt']),
('Imagen', 'Archivos de imagen', ARRAY['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']),
('Base de Datos', 'Archivos de base de datos', ARRAY['accdb', 'mdb', 'db', 'sqlite']),
('Hoja de Cálculo', 'Archivos de Excel y similares', ARRAY['xlsx', 'xls', 'csv', 'ods']),
('Presentación', 'Presentaciones', ARRAY['pptx', 'ppt', 'odp']),
('Otro', 'Otros tipos de documentos', ARRAY['txt', 'rtf', 'odt']);

-- ============================================================================
-- 16. DATOS INICIALES: IMPORTANCIAS
-- ============================================================================
INSERT INTO importancias (nivel, descripcion, orden) VALUES 
('Alta', 'Documentos de alta prioridad', 1),
('Media', 'Documentos de prioridad media', 2),
('Baja', 'Documentos de baja prioridad', 3);

-- ============================================================================
-- 17. DATOS INICIALES: CATEGORÍAS
-- ============================================================================
INSERT INTO categorias (nombre, descripcion, color, icono, orden) VALUES 
('Administrativos', 'Documentos administrativos y de gestión', '#FF9800', '📋', 1),
('Legales', 'Contratos, acuerdos y documentos legales', '#F44336', '⚖️', 2),
('Financieros', 'Documentos contables y financieros', '#4CAF50', '💰', 3),
('Recursos Humanos', 'Documentos de personal y RRHH', '#9C27B0', '👥', 4),
('Técnicos', 'Manuales, especificaciones técnicas', '#2196F3', '🔧', 5),
('Marketing', 'Materiales de marketing y promoción', '#E91E63', '📢', 6),
('Proyectos', 'Documentos relacionados con proyectos', '#00BCD4', '📊', 7),
('Archivo General', 'Documentos diversos sin categoría específica', '#607D8B', '📁', 8);

-- ============================================================================
-- 18. VISTAS ÚTILES
-- ============================================================================

-- Vista: Documentos con información completa
CREATE OR REPLACE VIEW v_documentos_completos AS
SELECT 
    d.id,
    d.nombre_original,
    d.nombre_archivo,
    d.ruta,
    u.nombre as usuario_nombre,
    u.username as usuario_username,
    t.nombre as tipo_documento,
    i.nivel as importancia,
    c.nombre as categoria,
    c.color as categoria_color,
    c.icono as categoria_icono,
    d.formato,
    d.tamaño,
    d.mime_type,
    d.es_publico,
    d.estado,
    d.fecha_subida,
    d.fecha_actualizacion
FROM documentos d
JOIN usuarios u ON d.id_usuario = u.id
JOIN tipos_documento t ON d.id_tipo_documento = t.id
JOIN importancias i ON d.id_importancia = i.id
LEFT JOIN categorias c ON d.id_categoria = c.id
WHERE d.estado = 'activo';

-- Vista: Historial de documentos con información de usuario
CREATE OR REPLACE VIEW v_historial_documentos AS
SELECT 
    h.id,
    h.id_documento,
    d.nombre_original as documento_nombre,
    h.id_usuario,
    u.nombre as usuario_nombre,
    u.username as usuario_username,
    h.accion,
    h.descripcion,
    h.fecha_accion
FROM historial_documentos h
JOIN documentos d ON h.id_documento = d.id
JOIN usuarios u ON h.id_usuario = u.id
ORDER BY h.fecha_accion DESC;

-- Vista: Estadísticas de documentos por categoría
CREATE OR REPLACE VIEW v_estadisticas_categorias AS
SELECT 
    c.id,
    c.nombre,
    c.color,
    c.icono,
    COUNT(d.id) as total_documentos,
    COUNT(CASE WHEN d.estado = 'activo' THEN 1 END) as documentos_activos,
    COUNT(CASE WHEN d.estado = 'archivado' THEN 1 END) as documentos_archivados,
    COUNT(CASE WHEN d.estado = 'eliminado' THEN 1 END) as documentos_eliminados
FROM categorias c
LEFT JOIN documentos d ON c.id = d.id_categoria
GROUP BY c.id, c.nombre, c.color, c.icono
ORDER BY c.orden;

-- Vista: Permisos de usuarios
CREATE OR REPLACE VIEW v_permisos_usuarios AS
SELECT 
    u.id,
    u.nombre,
    u.username,
    u.rol,
    p.nombre as permiso,
    p.descripcion
FROM usuarios u
JOIN roles_permisos rp ON u.rol = rp.rol
JOIN permisos p ON rp.id_permiso = p.id
ORDER BY u.nombre, p.nombre;

-- ============================================================================
-- 19. FUNCIONES ÚTILES
-- ============================================================================

-- Función: Obtener tamaño total de documentos por usuario
CREATE OR REPLACE FUNCTION get_tamaño_documentos_usuario(p_id_usuario INTEGER)
RETURNS BIGINT AS $$
BEGIN
    RETURN COALESCE((
        SELECT SUM(tamaño)
        FROM documentos
        WHERE id_usuario = p_id_usuario AND estado = 'activo'
    ), 0);
END;
$$ LANGUAGE plpgsql;

-- Función: Contar documentos por categoría
CREATE OR REPLACE FUNCTION get_documentos_por_categoria(p_id_categoria INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM documentos
        WHERE id_categoria = p_id_categoria AND estado = 'activo'
    );
END;
$$ LANGUAGE plpgsql;

-- Función: Obtener últimos documentos modificados
CREATE OR REPLACE FUNCTION get_ultimos_documentos(p_limite INTEGER DEFAULT 10)
RETURNS TABLE (
    id INTEGER,
    nombre_original VARCHAR,
    usuario_nombre VARCHAR,
    fecha_actualizacion TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT d.id, d.nombre_original, u.nombre, d.fecha_actualizacion
    FROM documentos d
    JOIN usuarios u ON d.id_usuario = u.id
    WHERE d.estado = 'activo'
    ORDER BY d.fecha_actualizacion DESC
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 20. COMENTARIOS DE DOCUMENTACIÓN
-- ============================================================================

COMMENT ON TABLE usuarios IS 'Almacena información de usuarios del sistema con roles y permisos';
COMMENT ON TABLE documentos IS 'Tabla principal que almacena metadatos de documentos';
COMMENT ON TABLE categorias IS 'Categorías para organizar documentos';
COMMENT ON TABLE historial_documentos IS 'Registro de auditoría de todas las acciones sobre documentos';
COMMENT ON TABLE documentos_permisos IS 'Permisos granulares a nivel de documento';

COMMENT ON COLUMN usuarios.rol IS 'Roles: admin, editor, asesor';
COMMENT ON COLUMN documentos.estado IS 'Estados: activo, archivado, eliminado';
COMMENT ON COLUMN documentos.es_publico IS 'Si es TRUE, todos los usuarios pueden verlo';

-- ============================================================================
-- FIN DEL SCHEMA
-- ============================================================================
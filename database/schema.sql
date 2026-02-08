-- Crear base de datos PostgreSQL
-- CREATE DATABASE sgd;
-- \c sgd;

-- Tabla de usuarios
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

-- Tabla de permisos
CREATE TABLE permisos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de roles_permisos (relación muchos a muchos)
CREATE TABLE roles_permisos (
    id SERIAL PRIMARY KEY,
    rol VARCHAR(20) NOT NULL,
    id_permiso INTEGER NOT NULL,
    FOREIGN KEY (id_permiso) REFERENCES permisos(id) ON DELETE CASCADE,
    UNIQUE(rol, id_permiso)
);

-- Tabla de tipos de documento
CREATE TABLE tipos_documento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    extensiones_permitidas TEXT[], -- Array de extensiones permitidas
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de importancias
CREATE TABLE importancias (
    id SERIAL PRIMARY KEY,
    nivel VARCHAR(20) NOT NULL UNIQUE,
    descripcion TEXT,
    orden INTEGER NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de documentos
CREATE TABLE documentos (
    id SERIAL PRIMARY KEY,
    nombre_original VARCHAR(255) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta VARCHAR(500) NOT NULL,
    id_usuario INTEGER NOT NULL,
    id_tipo_documento INTEGER NOT NULL,
    id_importancia INTEGER NOT NULL,
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
    FOREIGN KEY (id_importancia) REFERENCES importancias(id) ON DELETE RESTRICT
);

-- Tabla de permisos específicos por documento
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

-- Tabla de historial de cambios
CREATE TABLE historial_documentos (
    id SERIAL PRIMARY KEY,
    id_documento INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    accion VARCHAR(50) NOT NULL, -- 'creado', 'editado', 'eliminado', 'descargado'
    descripcion TEXT,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_documento) REFERENCES documentos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Función para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION update_fecha_actualizacion()
RETURNS TRIGGER AS $
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$ language 'plpgsql';

-- Trigger para usuarios
CREATE TRIGGER update_usuarios_fecha_actualizacion
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion();

-- Trigger para documentos
CREATE TRIGGER update_documentos_fecha_actualizacion
    BEFORE UPDATE ON documentos
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion();

-- Insertar permisos básicos
INSERT INTO permisos (nombre, descripcion) VALUES 
('crear_documentos', 'Crear nuevos documentos'),
('leer_documentos', 'Ver documentos'),
('editar_documentos', 'Editar documentos existentes'),
('eliminar_documentos', 'Eliminar documentos'),
('descargar_documentos', 'Descargar documentos'),
('gestionar_usuarios', 'Administrar usuarios del sistema'),
('ver_reportes', 'Ver reportes y estadísticas'),
('configurar_sistema', 'Configurar parámetros del sistema');

-- Asignar permisos por rol
INSERT INTO roles_permisos (rol, id_permiso) VALUES 
-- Admin: todos los permisos
('admin', 1), ('admin', 2), ('admin', 3), ('admin', 4), ('admin', 5), ('admin', 6), ('admin', 7), ('admin', 8),
-- Editor: crear, leer, editar, descargar
('editor', 1), ('editor', 2), ('editor', 3), ('editor', 5),
-- Asesor: solo leer y descargar
('asesor', 2), ('asesor', 5);

-- Insertar datos iniciales con nuevas credenciales
INSERT INTO usuarios (nombre, username, email, password, rol) VALUES 
('Administrador', 'admin', 'admin@sistema.com', '$2a$10$o40pKc0QrOSFUBsJdd6beOdFjbKHdIUpSH9TknW3CzSYEIjvc0ejG', 'admin'),
('Asesor Demo', 'asesor', 'asesor@sistema.com', '$2a$10$0oJ8P5uPm7kTL9lZT.i7ieBoRNMf5cO2nJF1HU89Yk.hSzhCkHlbq', 'asesor'),
('Editor Demo', 'editor', 'editor@sistema.com', '$2a$10$o4l32oGWPehzzSjOXr8VQeOtN5ipJbpHhiJ2r.6.h9/QsUCmmvyMG', 'editor');

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

INSERT INTO importancias (nivel, descripcion, orden) VALUES 
('Alta', 'Documentos de alta prioridad', 1),
('Media', 'Documentos de prioridad media', 2),
('Baja', 'Documentos de baja prioridad', 3);
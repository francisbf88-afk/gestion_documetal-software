-- Agregar tabla de categorías
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#2196F3', -- Color hexadecimal para la UI
    icono VARCHAR(50) DEFAULT '📁', -- Emoji o nombre de icono
    orden INTEGER DEFAULT 0, -- Para ordenar las categorías
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agregar trigger para actualizar fecha_actualizacion
CREATE TRIGGER update_categorias_fecha_actualizacion
    BEFORE UPDATE ON categorias
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion();

-- Agregar columna de categoría a la tabla documentos
ALTER TABLE documentos 
ADD COLUMN id_categoria INTEGER,
ADD CONSTRAINT fk_documentos_categoria 
    FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE SET NULL;

-- Insertar categorías por defecto
INSERT INTO categorias (nombre, descripcion, color, icono, orden) VALUES 
('Administrativos', 'Documentos administrativos y de gestión', '#FF9800', '📋', 1),
('Legales', 'Contratos, acuerdos y documentos legales', '#F44336', '⚖️', 2),
('Financieros', 'Documentos contables y financieros', '#4CAF50', '💰', 3),
('Recursos Humanos', 'Documentos de personal y RRHH', '#9C27B0', '👥', 4),
('Técnicos', 'Manuales, especificaciones técnicas', '#2196F3', '🔧', 5),
('Marketing', 'Materiales de marketing y promoción', '#E91E63', '📢', 6),
('Proyectos', 'Documentos relacionados con proyectos', '#00BCD4', '📊', 7),
('Archivo General', 'Documentos diversos sin categoría específica', '#607D8B', '📁', 8);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_documentos_categoria ON documentos(id_categoria);
CREATE INDEX idx_categorias_activa ON categorias(activa);
CREATE INDEX idx_categorias_orden ON categorias(orden);

-- Actualizar documentos existentes para asignarles una categoría por defecto
UPDATE documentos 
SET id_categoria = (SELECT id FROM categorias WHERE nombre = 'Archivo General' LIMIT 1)
WHERE id_categoria IS NULL;
-- Agregar columna is_active a la tabla categorias
ALTER TABLE categorias ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Agregar comentario a la columna
COMMENT ON COLUMN categorias.is_active IS 'Estado de la categoría (activo/inactivo)'; 
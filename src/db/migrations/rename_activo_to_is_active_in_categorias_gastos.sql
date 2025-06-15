-- Renombrar la columna activo a is_active en la tabla categorias_gastos
ALTER TABLE categorias_gastos RENAME COLUMN activo TO is_active;

-- Actualizar el comentario de la columna
COMMENT ON COLUMN categorias_gastos.is_active IS 'Estado de la categoría (activo/inactivo)'; 
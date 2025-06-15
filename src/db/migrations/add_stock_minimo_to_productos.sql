-- Agregar columna stock_minimo a la tabla productos
ALTER TABLE productos ADD COLUMN stock_minimo INTEGER;

-- Actualizar productos existentes con un valor por defecto
UPDATE productos SET stock_minimo = 10 WHERE stock_minimo IS NULL;

-- Hacer la columna NOT NULL después de actualizar los valores existentes
ALTER TABLE productos ALTER COLUMN stock_minimo SET NOT NULL;

-- Agregar comentario a la columna
COMMENT ON COLUMN productos.stock_minimo IS 'Stock mínimo requerido para el producto. Si el stock actual es menor o igual a este valor, el producto se considera bajo en stock.'; 
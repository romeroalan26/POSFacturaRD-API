-- Agregar columna usuario_id a la tabla ventas
ALTER TABLE ventas
ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuarios(id);

-- Crear índice para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_ventas_usuario_id ON ventas(usuario_id);

-- Comentario explicativo
COMMENT ON COLUMN ventas.usuario_id IS 'ID del usuario que registró la venta'; 
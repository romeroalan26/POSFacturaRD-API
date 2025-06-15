-- Agregar columna usuario_id a la tabla gastos
ALTER TABLE gastos
ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuarios(id);

-- Crear índice para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_gastos_usuario_id ON gastos(usuario_id);

-- Agregar comentario explicativo
COMMENT ON COLUMN gastos.usuario_id IS 'ID del usuario que registró el gasto'; 
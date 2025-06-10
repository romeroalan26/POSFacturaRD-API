-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar algunas categorías por defecto
INSERT INTO categorias (nombre, descripcion) VALUES
    ('Bebidas', 'Bebidas y refrescos'),
    ('Alimentos', 'Productos alimenticios'),
    ('Limpieza', 'Productos de limpieza'),
    ('Higiene', 'Productos de higiene personal'),
    ('Otros', 'Productos varios')
ON CONFLICT (nombre) DO NOTHING;

-- Agregar columna categoria_id a la tabla productos
ALTER TABLE productos
ADD COLUMN IF NOT EXISTS categoria_id INTEGER REFERENCES categorias(id),
ADD CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id);

-- Crear índice para la columna categoria_id
CREATE INDEX IF NOT EXISTS idx_productos_categoria_id ON productos(categoria_id);

-- Migrar datos existentes (si hay categorías en la columna categoria)
DO $$
DECLARE
    cat RECORD;
BEGIN
    FOR cat IN SELECT DISTINCT categoria FROM productos WHERE categoria IS NOT NULL LOOP
        -- Insertar la categoría si no existe
        INSERT INTO categorias (nombre)
        VALUES (cat.categoria)
        ON CONFLICT (nombre) DO NOTHING;
        
        -- Actualizar los productos con el nuevo categoria_id
        UPDATE productos p
        SET categoria_id = c.id
        FROM categorias c
        WHERE p.categoria = c.nombre
        AND p.categoria_id IS NULL;
    END LOOP;
END $$;

-- Eliminar la columna categoria antigua
ALTER TABLE productos DROP COLUMN IF EXISTS categoria; 
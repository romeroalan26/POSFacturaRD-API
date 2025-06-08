-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    permissions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar roles por defecto
INSERT INTO roles (name, description, permissions) VALUES
    ('admin', 'Dueño o supervisor. Accede a todo.', '{
        "products": {"view": true, "create": true, "update": true, "delete": true},
        "sales": {"view": true, "create": true, "update": true, "delete": true},
        "reports": {"view": true, "export": true},
        "users": {"view": true, "create": true, "update": true, "delete": true}
    }'),
    ('cajero', 'Operador de caja. Vende productos.', '{
        "products": {"view": true, "create": false, "update": false, "delete": false},
        "sales": {"view": true, "create": true, "update": false, "delete": false},
        "reports": {"view": true, "export": false},
        "users": {"view": false, "create": false, "update": false, "delete": false}
    }'),
    ('inventario', 'Encargado de stock.', '{
        "products": {"view": true, "create": true, "update": true, "delete": false},
        "sales": {"view": false, "create": false, "update": false, "delete": false},
        "reports": {"view": true, "export": true},
        "users": {"view": false, "create": false, "update": false, "delete": false}
    }'),
    ('invitado', 'Rol opcional, solo lectura. Ideal para pruebas o vistas demo.', '{
        "products": {"view": true, "create": false, "update": false, "delete": false},
        "sales": {"view": true, "create": false, "update": false, "delete": false},
        "reports": {"view": true, "export": false},
        "users": {"view": false, "create": false, "update": false, "delete": false}
    }')
ON CONFLICT (name) DO NOTHING;

-- Agregar columna role_id a la tabla usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES roles(id);

-- Actualizar usuarios existentes para asignarles el rol de admin
UPDATE usuarios SET role_id = (SELECT id FROM roles WHERE name = 'admin') WHERE role_id IS NULL; 
-- Asegurar que las tablas tengan las restricciones únicas necesarias
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'categorias_gastos_nombre_key' 
        AND conrelid = 'categorias_gastos'::regclass
    ) THEN
        ALTER TABLE categorias_gastos ADD CONSTRAINT categorias_gastos_nombre_key UNIQUE (nombre);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'productos_nombre_key' 
        AND conrelid = 'productos'::regclass
    ) THEN
        ALTER TABLE productos ADD CONSTRAINT productos_nombre_key UNIQUE (nombre);
    END IF;
END $$;

-- Insertar categorías de gastos si no existen
INSERT INTO categorias_gastos (nombre, descripcion) VALUES
    ('Alquiler', 'Pago de alquiler del local'),
    ('Servicios', 'Pago de servicios (luz, agua, internet)'),
    ('Mantenimiento', 'Gastos de mantenimiento del local'),
    ('Impuestos', 'Pago de impuestos'),
    ('Otros', 'Otros gastos varios')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar productos de prueba si no existen
INSERT INTO productos (nombre, precio, precio_compra, stock, con_itbis, categoria_id, stock_minimo) VALUES
    ('Coca Cola 2L', 175.00, 140.00, 100, true, (SELECT id FROM categorias WHERE nombre = 'Bebidas'), 10),
    ('Pepsi 2L', 170.00, 135.00, 100, true, (SELECT id FROM categorias WHERE nombre = 'Bebidas'), 10),
    ('Pan de Agua', 25.00, 15.00, 50, false, (SELECT id FROM categorias WHERE nombre = 'Alimentos'), 5),
    ('Leche 1L', 85.00, 65.00, 30, false, (SELECT id FROM categorias WHERE nombre = 'Alimentos'), 5),
    ('Detergente 1kg', 250.00, 200.00, 20, true, (SELECT id FROM categorias WHERE nombre = 'Limpieza'), 3),
    ('Jabón de Baño', 45.00, 30.00, 40, true, (SELECT id FROM categorias WHERE nombre = 'Higiene'), 5),
    ('Papel Higiénico', 120.00, 90.00, 25, true, (SELECT id FROM categorias WHERE nombre = 'Higiene'), 5)
ON CONFLICT (nombre) DO NOTHING;

-- Insertar ventas de prueba
DO $$
DECLARE
    v_producto RECORD;
    v_fecha TIMESTAMP;
    v_metodo_pago TEXT;
    v_cantidad INTEGER;
    v_venta_id INTEGER;
    v_subtotal NUMERIC(10,2);
    v_itbis_total NUMERIC(10,2);
    v_total_final NUMERIC(10,2);
    v_usuario_id INTEGER;
BEGIN
    -- Obtener un usuario admin para las ventas
    SELECT id INTO v_usuario_id FROM usuarios WHERE role_id = (SELECT id FROM roles WHERE name = 'admin') LIMIT 1;
    
    -- Insertar 100 ventas aleatorias
    FOR i IN 1..100 LOOP
        -- Generar fecha aleatoria (últimos 6 meses)
        v_fecha := NOW() - (random() * interval '180 days');
        
        -- Seleccionar método de pago aleatorio
        v_metodo_pago := (ARRAY['efectivo', 'tarjeta', 'transferencia'])[floor(random() * 3 + 1)];
        
        -- Insertar la venta
        INSERT INTO ventas (fecha, metodo_pago, usuario_id)
        VALUES (v_fecha, v_metodo_pago, v_usuario_id)
        RETURNING id INTO v_venta_id;
        
        -- Insertar 1-5 productos aleatorios por venta
        FOR j IN 1..floor(random() * 5 + 1) LOOP
            -- Seleccionar producto aleatorio
            SELECT * INTO v_producto FROM productos ORDER BY random() LIMIT 1;
            
            -- Generar cantidad aleatoria (1-5)
            v_cantidad := floor(random() * 5 + 1);
            
            -- Calcular subtotales
            v_subtotal := v_producto.precio * v_cantidad;
            v_itbis_total := CASE WHEN v_producto.con_itbis THEN v_subtotal * 0.18 ELSE 0 END;
            v_total_final := v_subtotal + v_itbis_total;
            
            -- Insertar producto en la venta
            INSERT INTO venta_productos (venta_id, producto_id, cantidad, precio_unitario, precio_compra)
            VALUES (v_venta_id, v_producto.id, v_cantidad, v_producto.precio, v_producto.precio_compra);
            
            -- Actualizar stock
            UPDATE productos SET stock = stock - v_cantidad WHERE id = v_producto.id;
        END LOOP;
        
        -- Actualizar totales de la venta
        UPDATE ventas 
        SET subtotal = (
            SELECT SUM(precio_unitario * cantidad) 
            FROM venta_productos 
            WHERE venta_id = v_venta_id
        ),
        itbis_total = (
            SELECT SUM(CASE 
                WHEN p.con_itbis THEN precio_unitario * cantidad * 0.18 
                ELSE 0 
            END)
            FROM venta_productos vp
            JOIN productos p ON p.id = vp.producto_id
            WHERE vp.venta_id = v_venta_id
        ),
        total_final = (
            SELECT SUM(precio_unitario * cantidad) + 
                   SUM(CASE 
                       WHEN p.con_itbis THEN precio_unitario * cantidad * 0.18 
                       ELSE 0 
                   END)
            FROM venta_productos vp
            JOIN productos p ON p.id = vp.producto_id
            WHERE vp.venta_id = v_venta_id
        )
        WHERE id = v_venta_id;
    END LOOP;
END $$;

-- Insertar gastos de prueba
DO $$
DECLARE
    v_categoria_id INTEGER;
    v_fecha TIMESTAMP;
    v_monto NUMERIC(10,2);
    v_usuario_id INTEGER;
BEGIN
    -- Obtener un usuario admin para los gastos
    SELECT id INTO v_usuario_id FROM usuarios WHERE role_id = (SELECT id FROM roles WHERE name = 'admin') LIMIT 1;
    
    -- Insertar 50 gastos aleatorios
    FOR i IN 1..50 LOOP
        -- Seleccionar categoría aleatoria
        SELECT id INTO v_categoria_id FROM categorias_gastos ORDER BY random() LIMIT 1;
        
        -- Generar fecha aleatoria (últimos 6 meses)
        v_fecha := NOW() - (random() * interval '180 days');
        
        -- Generar monto aleatorio entre 1000 y 50000
        v_monto := 1000 + (random() * 49000);
        
        -- Insertar el gasto
        INSERT INTO gastos (monto, descripcion, categoria_id, fecha, usuario_id)
        VALUES (
            v_monto,
            'Gasto de prueba ' || i,
            v_categoria_id,
            v_fecha,
            v_usuario_id
        );
    END LOOP;
END $$; 
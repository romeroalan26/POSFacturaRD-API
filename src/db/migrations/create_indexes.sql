-- Índices para la tabla usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_role_id ON usuarios(role_id);

-- Índices para la tabla productos
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);
CREATE INDEX IF NOT EXISTS idx_productos_stock ON productos(stock) WHERE stock > 0;
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);

-- Índices para la tabla ventas
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_metodo_pago ON ventas(metodo_pago);

-- Índices para la tabla venta_productos
CREATE INDEX IF NOT EXISTS idx_venta_productos_venta_id ON venta_productos(venta_id);
CREATE INDEX IF NOT EXISTS idx_venta_productos_producto_id ON venta_productos(producto_id);

-- Índices para la tabla roles
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name); 